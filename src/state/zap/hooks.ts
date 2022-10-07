import { parseUnits } from '@ethersproject/units'
import { Currency, CurrencyAmount, ETHER, JSBI, Token, TokenAmount, Zap, ZapType } from '@ape.swap/sdk'
import { useCallback, useEffect, useMemo } from 'react'
import contracts from 'config/constants/contracts'
import { useSelector } from 'react-redux'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useENS from 'hooks/ENS/useENS'
import { useCurrency, useDefaultTokens } from 'hooks/Tokens'
import { mergeBestZaps, useTradeExactIn } from 'hooks/Zap/Zap'
import { isAddress } from 'utils'
import { AppState, useAppDispatch } from '../index'
import { useCurrencyBalances } from '../wallet/hooks'
import {
  Field,
  MergedZap,
  replaceZapState,
  selectInputCurrency,
  selectOutputCurrency,
  setInputList,
  setRecipient,
  setZapNewOutputList,
  setZapType,
  typeInput,
} from './actions'
import { useUserSlippageTolerance, useValidTrackedTokenPairs } from '../user/hooks'
import { usePair } from 'hooks/usePairs'
import useTotalSupply from 'hooks/useTotalSupply'

import BigNumber from 'bignumber.js'
import fetchZapInputTokens from './api'

export function useZapState(): AppState['zap'] {
  return useSelector<AppState, AppState['zap']>((state) => state.zap)
}

export function useZapActionHandlers(): {
  onCurrencySelection: (field: Field, currency: Currency[]) => void
  onUserInput: (field: Field, typedValue: string) => void
  onChangeRecipient: (recipient: string | null) => void
  onSetZapType: (zapType: ZapType) => void
  onInputSelect: (field: Field, currency: Currency) => void
  onOutputSelect: (currencies: { currency1: string; currency2: string }) => void
} {
  const dispatch = useAppDispatch()

  const onCurrencySelection = useCallback(
    (field: Field, currencies: Currency[]) => {
      const currency = currencies[0]
      if (field === Field.INPUT) {
        dispatch(
          selectInputCurrency({
            currencyId: currency instanceof Token ? currency.address : currency === ETHER ? 'ETH' : '',
          }),
        )
      } else {
        const currency2 = currencies[1]
        dispatch(
          selectOutputCurrency({
            currency1: currency instanceof Token ? currency.address : currency === ETHER ? 'ETH' : '',
            currency2: currency2 instanceof Token ? currency2.address : currency2 === ETHER ? 'ETH' : '',
          }),
        )
      }
    },
    [dispatch],
  )

  const onUserInput = useCallback(
    (field: Field, typedValue: string) => {
      dispatch(typeInput({ field, typedValue }))
    },
    [dispatch],
  )

  const onChangeRecipient = useCallback(
    (recipient: string | null) => {
      dispatch(setRecipient({ recipient }))
    },
    [dispatch],
  )

  const onSetZapType = useCallback(
    (zapType: ZapType) => {
      dispatch(setZapType({ zapType }))
    },
    [dispatch],
  )

  const onInputSelect = useCallback(
    (field: Field, currency: Currency) => {
      dispatch(
        selectInputCurrency({
          currencyId: currency instanceof Token ? currency.address : currency === ETHER ? 'ETH' : '',
        }),
      )
      dispatch(typeInput({ field, typedValue: '0' }))
    },
    [dispatch],
  )

  const onOutputSelect = useCallback(
    (currencies: { currency1: string; currency2: string }) => {
      dispatch(selectOutputCurrency(currencies))
    },
    [dispatch],
  )

  return {
    onCurrencySelection,
    onUserInput,
    onChangeRecipient,
    onSetZapType,
    onInputSelect,
    onOutputSelect,
  }
}

// try to parse a user entered amount for a given token
export function tryParseAmount(value?: string, currency?: Currency): CurrencyAmount | undefined {
  if (!value || !currency) {
    return undefined
  }
  try {
    const typedValueParsed = parseUnits(value, currency.decimals).toString()
    if (typedValueParsed !== '0') {
      return currency instanceof Token
        ? new TokenAmount(currency, JSBI.BigInt(typedValueParsed))
        : CurrencyAmount.ether(JSBI.BigInt(typedValueParsed))
    }
  } catch (error) {
    // should fail if the user specifies too many decimal places of precision (or maybe exceed max uint?)
    console.debug(`Failed to parse input amount: "${value}"`, error)
  }
  // necessary for all paths to return a value
  return undefined
}

const BAD_RECIPIENT_ADDRESSES: string[] = [
  '0xBCfCcbde45cE874adCB698cC183deBcF17952812', // v2 factory
  '0xf164fC0Ec4E93095b804a4795bBe1e041497b92a', // v2 router 01
  '0x05fF2B0DB69458A0750badebc4f9e13aDd608C7F', // v2 router 02
]

/**
 * Returns true if any of the pairs or tokens in a trade have the given checksummed address
 * @param trade to check for the given address
 * @param checksummedAddress address to check in the pairs and tokens
 */
function involvesAddress(trade: Zap, checksummedAddress: string): boolean {
  return (
    trade.route.path.some((token) => token.address === checksummedAddress) ||
    trade.route.pairs.some((pair) => pair.liquidityToken.address === checksummedAddress)
  )
}

// from the current swap inputs, compute the best trade and return it.
export function useDerivedZapInfo(): {
  currencies: { [field in Field]?: Currency }
  currencyBalances: { [field in Field]?: CurrencyAmount }
  parsedAmount: CurrencyAmount | undefined
  zap: MergedZap
  inputError?: string
} {
  const {
    typedValue,
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currency1: outputCurrencyId1, currency2: outputCurrencyId2 },
    recipient,
  } = useZapState()

  const { account, chainId } = useActiveWeb3React()

  const inputCurrency = useCurrency(inputCurrencyId)
  const out1 = useCurrency(useMemo(() => outputCurrencyId1, [outputCurrencyId1]))
  const out2 = useCurrency(useMemo(() => outputCurrencyId2, [outputCurrencyId2]))
  const outputCurrencies = useMemo(() => {
    return [out1, out2]
  }, [out1, out2])
  const outputPair = usePair(outputCurrencies[0], outputCurrencies[1])
  const totalSupply = useTotalSupply(outputPair?.[1]?.liquidityToken)

  const recipientLookup = useENS(recipient ?? undefined)
  const to: string | null = (recipient === null ? account : recipientLookup.address) ?? null
  const [allowedSlippage] = useUserSlippageTolerance(true)

  const relevantTokenBalances = useCurrencyBalances(account ?? undefined, [
    inputCurrency ?? undefined,
    outputPair?.[1]?.liquidityToken ?? undefined,
  ])

  // Change to currency amount. Divide the typed input by 2 to get correct distributions
  const halfTypedValue = new BigNumber(typedValue).div(2).toFixed(18, 5)

  const parsedAmount = tryParseAmount(halfTypedValue === 'NaN' ? '0' : halfTypedValue, inputCurrency ?? undefined)

  const bestZapOne = useTradeExactIn(parsedAmount, outputCurrencies[0] ?? undefined)
  const bestZapTwo = useTradeExactIn(parsedAmount, outputCurrencies[1] ?? undefined)
  const zap = useMemo(
    () => mergeBestZaps(bestZapOne, bestZapTwo, outputCurrencies, outputPair, allowedSlippage, totalSupply, chainId),
    [bestZapOne, bestZapTwo, outputCurrencies, outputPair, allowedSlippage, totalSupply, chainId],
  )

  const currencyBalances = {
    [Field.INPUT]: relevantTokenBalances[0],
    [Field.OUTPUT]: relevantTokenBalances[1],
  }

  const currencies: { [field in Field]?: Currency } = {
    [Field.INPUT]: inputCurrency ?? undefined,
    [Field.OUTPUT]: inputCurrency ?? undefined,
  }

  let inputError: string | undefined
  if (!account) {
    inputError = 'Connect Wallet'
  }

  if (!parsedAmount) {
    inputError = inputError ?? 'Enter an amount'
  }

  if (!currencies[Field.INPUT] || !currencies[Field.OUTPUT] || !outputPair[1]) {
    inputError = inputError ?? 'Select a token'
  }

  const formattedTo = isAddress(to)
  if (!to || !formattedTo) {
    inputError = inputError ?? 'Enter a recipient'
  } else if (
    BAD_RECIPIENT_ADDRESSES.indexOf(formattedTo) !== -1 ||
    (bestZapOne && involvesAddress(bestZapOne, formattedTo))
  ) {
    inputError = inputError ?? 'Invalid recipient'
  }

  // compare input balance to max input based on version
  const [balanceIn, amountIn] = [
    currencyBalances[Field.INPUT],
    zap?.currencyIn?.inputAmount ? zap?.currencyIn.inputAmount : null,
  ]

  if (balanceIn && amountIn && JSBI.lessThan(balanceIn.raw, amountIn)) {
    inputError = `Insufficient ${zap.currencyIn.currency.getSymbol(chainId)} balance`
  }

  return {
    currencies,
    currencyBalances,
    parsedAmount,
    zap,
    inputError,
  }
}

// Set default currencies for zap state
export function useDefaultCurrencies() {
  const { chainId, account } = useActiveWeb3React()
  const dispatch = useAppDispatch()
  useEffect(() => {
    const outputCurrencies = { currency1: 'ETH', currency2: contracts.banana[chainId] }
    const inputCurrency = 'ETH'
    dispatch(
      replaceZapState({
        typedValue: '',
        field: '',
        inputCurrencyId: inputCurrency,
        outputCurrencyId: outputCurrencies,
        recipient: account,
        zapType: ZapType.ZAP,
      }),
    )
  }, [dispatch, chainId, account])
}

// Set zap output list. Keep this pretty simple to allow multiple products to use it
// This will be mostly used by products rather than the dex
export function useSetZapOutputList(currencyIds: { currencyIdA: string; currencyIdB: string }[]) {
  const dispatch = useAppDispatch()
  /* eslint-disable react-hooks/exhaustive-deps */
  useMemo(() => dispatch(setZapNewOutputList({ zapNewOutputList: currencyIds })), [currencyIds.length, dispatch])
}

// Hook to set the dex output list.
// Since we want to use multiple token pairs that exists this hook is a bit more involved than the simple setOutputList
export function useSetZapDexOutputList() {
  // Get default token list and pinned pair tokens and create valid pairs
  const trackedTokenPairs = useValidTrackedTokenPairs()
  useSetZapOutputList(
    useMemo(() => {
      return trackedTokenPairs?.map(([token1, token2]) => {
        return { currencyIdA: token1.address, currencyIdB: token2.address }
      })
    }, [trackedTokenPairs]),
  )
}

// Hook to return the output token list to be used in the search modal
export const useZapOutputList = (): { currencyA: Token; currencyB: Token }[] => {
  const { zapNewOutputList: currencyIds } = useZapState()
  const tokens = useDefaultTokens()
  const filteredTokens = useMemo(
    () =>
      currencyIds.map(({ currencyIdA, currencyIdB }) => {
        const checkedCurrencyIdA = isAddress(currencyIdA)
        const checkedCurrencyIdB = isAddress(currencyIdB)
        if (!checkedCurrencyIdA || !checkedCurrencyIdB) return null
        return { currencyA: tokens[checkedCurrencyIdA], currencyB: tokens[checkedCurrencyIdB] }
      }),
    [currencyIds, tokens],
  )
  return filteredTokens
}

// Hook to set the zap input list
export function useSetZapInputList() {
  const dispatch = useAppDispatch()
  useEffect(() => {
    const getZapInputList = async () => {
      const resp: { [symbol: string]: Token } = await fetchZapInputTokens()
      dispatch(setInputList({ zapInputList: resp }))
    }
    getZapInputList()
  }, [dispatch])
}

// Hook to use the input list
export function useZapInputList(): { [address: string]: Token } {
  const { zapInputList } = useZapState()
  if (!zapInputList) return
  return zapInputList
}
