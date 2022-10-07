import { parseUnits } from '@ethersproject/units'
import { Currency, CurrencyAmount, ETHER, JSBI, Token, TokenAmount, Trade, ChainId, SmartRouter } from '@ape.swap/sdk'
import { ParsedQs } from 'qs'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useENS from 'hooks/ENS/useENS'
import { useCurrency } from 'hooks/Tokens'
import { useAllCommonPairs } from 'hooks/Trades'
import useParsedQueryString from 'hooks/useParsedQueryString'
import contracts from 'config/constants/contracts'
import useFindBestRoute from 'hooks/useFindBestRoute'
import { isAddress } from 'utils'
import { useTranslation } from 'contexts/Localization'
import { RouterTypes } from 'config/constants'
import { AppDispatch, AppState, useAppDispatch } from '../index'
import { useCurrencyBalances } from '../wallet/hooks'
import {
  Field,
  replaceSwapState,
  selectCurrency,
  setRecipient,
  switchCurrencies,
  typeInput,
  setSwapDelay,
  SwapDelay,
  RouterTypeParams,
  setBestRoute,
} from './actions'

import { SwapState } from './reducer'
import { useUserSlippageTolerance } from '../user/hooks'
import { computeSlippageAdjustedAmounts } from '../../utils/prices'

export function useSwapState(): AppState['swap'] {
  return useSelector<AppState, AppState['swap']>((state) => state.swap)
}

export function useSwapActionHandlers(): {
  onCurrencySelection: (field: Field, currency: Currency, typedValue?: string) => void
  onSwitchTokens: () => void
  onUserInput: (field: Field, typedValue: string) => void
  onChangeRecipient: (recipient: string | null) => void
  onSetSwapDelay: (swapDelay: SwapDelay) => void
  onBestRoute: (bestRoute: RouterTypeParams) => void
} {
  const dispatch = useAppDispatch()
  const timer = useRef(null)

  const onSetSwapDelay = useCallback(
    (swapDelay: SwapDelay) => {
      dispatch(setSwapDelay({ swapDelay }))
    },
    [dispatch],
  )

  const onSwitchTokens = useCallback(() => {
    dispatch(switchCurrencies())
    // Set input to complete to recalculate the best path
    onSetSwapDelay(SwapDelay.USER_INPUT_COMPLETE)
  }, [dispatch, onSetSwapDelay])

  const onUserInput = useCallback(
    (field: Field, typedValue: string) => {
      dispatch(typeInput({ field, typedValue }))
      if (!typedValue) {
        onSetSwapDelay(SwapDelay.INIT)
        return
      }
      // Set state as user input delay
      onSetSwapDelay(SwapDelay.USER_INPUT)
      // Reset previous timer on user input
      clearTimeout(timer.current)
      // Set new timer to check wallchain router
      timer.current = setTimeout(() => {
        // Set state that user has finished inputing
        onSetSwapDelay(SwapDelay.USER_INPUT_COMPLETE)
      }, 300)
    },
    [dispatch, onSetSwapDelay, timer],
  )

  const onCurrencySelection = useCallback(
    (field: Field, currency: Currency, typedValue?: string) => {
      // We dont need to timeout if their is no typed value
      dispatch(
        selectCurrency({
          field,
          currencyId: currency instanceof Token ? currency.address : currency === ETHER ? 'ETH' : '',
        }),
      )
      // Set input to complete to recalculate the best path
      if (!typedValue) {
        onSetSwapDelay(SwapDelay.USER_INPUT_COMPLETE)
      } else {
        onSetSwapDelay(SwapDelay.USER_INPUT)
        timer.current = setTimeout(() => {
          // Set state that user has finished inputing
          onSetSwapDelay(SwapDelay.USER_INPUT_COMPLETE)
        }, 1000)
      }
    },
    [dispatch, onSetSwapDelay],
  )

  const onChangeRecipient = useCallback(
    (recipient: string | null) => {
      dispatch(setRecipient({ recipient }))
    },
    [dispatch],
  )

  const onBestRoute = useCallback(
    (bestRoute: RouterTypeParams) => {
      dispatch(setBestRoute({ bestRoute }))
    },
    [dispatch],
  )

  return {
    onSwitchTokens,
    onCurrencySelection,
    onUserInput,
    onChangeRecipient,
    onSetSwapDelay,
    onBestRoute,
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
function involvesAddress(trade: Trade, checksummedAddress: string): boolean {
  return (
    trade.route.path.some((token) => token.address === checksummedAddress) ||
    trade.route.pairs.some((pair) => pair.liquidityToken.address === checksummedAddress)
  )
}

// from the current swap inputs, compute the best trade and return it.
export function useDerivedSwapInfo(): {
  currencies: { [field in Field]?: Currency }
  currencyBalances: { [field in Field]?: CurrencyAmount }
  parsedAmount: CurrencyAmount | undefined
  v2Trade: Trade | undefined
  inputError?: string
  v1Trade: Trade | undefined
} {
  const { account, chainId } = useActiveWeb3React()

  const { t } = useTranslation()

  const {
    independentField,
    typedValue,
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
    recipient,
  } = useSwapState()
  const inputCurrency = useCurrency(inputCurrencyId)
  const outputCurrency = useCurrency(outputCurrencyId)
  useAllCommonPairs(inputCurrency, outputCurrency)
  const { v2Trade, bestTradeExactIn, bestTradeExactOut } = useFindBestRoute()
  const recipientLookup = useENS(recipient ?? undefined)
  const to: string | null = (recipient === null ? account : recipientLookup.address) ?? null

  const relevantTokenBalances = useCurrencyBalances(account ?? undefined, [
    inputCurrency ?? undefined,
    outputCurrency ?? undefined,
  ])

  const isExactIn: boolean = independentField === Field.INPUT
  const parsedAmount = tryParseAmount(typedValue, (isExactIn ? inputCurrency : outputCurrency) ?? undefined)

  const currencyBalances = useMemo(
    () => ({
      [Field.INPUT]: relevantTokenBalances[0],
      [Field.OUTPUT]: relevantTokenBalances[1],
    }),
    [relevantTokenBalances],
  )

  const currencies: { [field in Field]?: Currency | null } = useMemo(
    () => ({
      [Field.INPUT]: inputCurrency ?? undefined,
      [Field.OUTPUT]: outputCurrency ?? undefined,
    }),
    [inputCurrency, outputCurrency],
  )

  let inputError: string | undefined
  if (!account) {
    inputError = t('Connect Wallet')
  }

  if (!parsedAmount) {
    inputError = inputError ?? t('Enter an amount')
  }

  if (!currencies[Field.INPUT] || !currencies[Field.OUTPUT]) {
    inputError = inputError ?? t('Select a token')
  }

  const formattedTo = isAddress(to)
  if (!to || !formattedTo) {
    inputError = inputError ?? t('Enter a recipient')
  } else if (
    BAD_RECIPIENT_ADDRESSES.indexOf(formattedTo) !== -1 ||
    (bestTradeExactIn && involvesAddress(bestTradeExactIn, formattedTo)) ||
    (bestTradeExactOut && involvesAddress(bestTradeExactOut, formattedTo))
  ) {
    inputError = inputError ?? t('Invalid recipient')
  }

  const [allowedSlippage] = useUserSlippageTolerance()

  const slippageAdjustedAmounts = v2Trade && allowedSlippage && computeSlippageAdjustedAmounts(v2Trade, allowedSlippage)
  // const swapCalls = useSwapCallArguments(v2Trade, allowedSlippage, recipient)

  // compare input balance to max input based on version
  const [balanceIn, amountIn] = [
    currencyBalances[Field.INPUT],
    slippageAdjustedAmounts ? slippageAdjustedAmounts[Field.INPUT] : null,
  ]

  if (balanceIn && amountIn && balanceIn.lessThan(amountIn)) {
    inputError = `${t('Insufficient')} ${amountIn.currency.getSymbol(chainId)} ${t('balance')}`
  }

  return {
    currencies,
    currencyBalances,
    parsedAmount,
    v2Trade: v2Trade ?? undefined,
    inputError,
    v1Trade: undefined,
  }
}

function parseCurrencyFromURLParameter(urlParam: any): string {
  if (typeof urlParam === 'string') {
    const valid = isAddress(urlParam)
    if (valid) return valid
    if (urlParam.toUpperCase() === 'ETH') return 'ETH'
    if (valid === false) return 'ETH'
  }
  return 'ETH' ?? ''
}

function parseTokenAmountURLParameter(urlParam: any): string {
  // eslint-disable-next-line no-restricted-globals
  return typeof urlParam === 'string' && !isNaN(parseFloat(urlParam)) ? urlParam : ''
}

function parseIndependentFieldURLParameter(urlParam: any): Field {
  return typeof urlParam === 'string' && urlParam.toLowerCase() === 'output' ? Field.OUTPUT : Field.INPUT
}

const ENS_NAME_REGEX = /^[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)?$/
const ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/
function validatedRecipient(recipient: any): string | null {
  if (typeof recipient !== 'string') return null
  const address = isAddress(recipient)
  if (address) return address
  if (ENS_NAME_REGEX.test(recipient)) return recipient
  if (ADDRESS_REGEX.test(recipient)) return recipient
  return null
}

export function queryParametersToSwapState(parsedQs: ParsedQs, chainId: ChainId): SwapState {
  let inputCurrency = parseCurrencyFromURLParameter(parsedQs.inputCurrency)
  let outputCurrency = parseCurrencyFromURLParameter(parsedQs.outputCurrency)

  const chainAddress = contracts.banana[chainId]

  if (inputCurrency === outputCurrency) {
    if (typeof parsedQs.outputCurrency === 'string') {
      inputCurrency = ''
    } else {
      outputCurrency = chainAddress
    }
  }

  const recipient = validatedRecipient(parsedQs.recipient)
  const swapDelay = SwapDelay.INIT
  const bestRoute = { routerType: RouterTypes.APE, smartRouter: SmartRouter.APE }

  return {
    [Field.INPUT]: {
      currencyId: inputCurrency,
    },
    [Field.OUTPUT]: {
      currencyId: outputCurrency,
    },
    typedValue: parseTokenAmountURLParameter(parsedQs.exactAmount),
    independentField: parseIndependentFieldURLParameter(parsedQs.exactField),
    recipient,
    swapDelay,
    bestRoute,
  }
}

// updates the swap state to use the defaults for a given network
export function useDefaultsFromURLSearch():
  | { inputCurrencyId: string | undefined; outputCurrencyId: string | undefined }
  | undefined {
  const { chainId } = useActiveWeb3React()
  const dispatch = useDispatch<AppDispatch>()
  const parsedQs = useParsedQueryString()
  const parsed = useMemo(() => {
    return queryParametersToSwapState(parsedQs, chainId)
  }, [parsedQs, chainId])
  const swapDelay = SwapDelay.INIT
  const bestRoute = { routerType: RouterTypes.APE, smartRouter: SmartRouter.APE }
  useEffect(() => {
    if (!chainId) return
    const inputCurrencyId = parsed[Field.INPUT].currencyId ?? undefined
    const outputCurrencyId = parsed[Field.OUTPUT].currencyId ?? undefined

    dispatch(
      replaceSwapState({
        typedValue: parsed.typedValue,
        field: parsed.independentField,
        inputCurrencyId,
        outputCurrencyId,
        recipient: parsed.recipient,
        swapDelay,
        bestRoute,
      }),
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, chainId])

  return { inputCurrencyId: parsed[Field.INPUT].currencyId, outputCurrencyId: parsed[Field.OUTPUT].currencyId }
}
