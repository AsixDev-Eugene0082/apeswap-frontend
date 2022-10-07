/* eslint-disable no-param-reassign */
import {
  Currency,
  CurrencyAmount,
  currencyEquals,
  ETHER,
  JSBI,
  Pair,
  Percent,
  SmartRouter,
  Token,
  TokenAmount,
  WETH,
  Zap,
} from '@ape.swap/sdk'
import flatMap from 'lodash/flatMap'
import { useMemo } from 'react'
import useActiveWeb3React from 'hooks/useActiveWeb3React'

import { useUserSingleHopOnly } from 'state/user/hooks'
import {
  BASES_TO_CHECK_TRADES_AGAINST,
  CUSTOM_BASES,
  BETTER_TRADE_LESS_HOPS_THRESHOLD,
  ADDITIONAL_BASES,
  BIPS_BASE,
} from '../../config/constants'
import { PairState, usePairs } from '../usePairs'
import { wrappedCurrency, wrappedCurrencyAmount } from '../../utils/wrappedCurrency'
import { useUnsupportedTokens } from '../Tokens'
import isZapBetter from 'utils/zap'
import { MergedZap } from 'state/zap/actions'
import { computeTradePriceBreakdown } from 'utils/prices'

function useAllCommonPairs(currencyA?: Currency, currencyB?: Currency): Pair[] {
  const { chainId } = useActiveWeb3React()

  const [tokenA, tokenB] = chainId
    ? [wrappedCurrency(currencyA, chainId), wrappedCurrency(currencyB, chainId)]
    : [undefined, undefined]

  const bases: Token[] = useMemo(() => {
    if (!chainId) return []

    const common = BASES_TO_CHECK_TRADES_AGAINST[chainId] ?? []
    const additionalA = tokenA ? ADDITIONAL_BASES[chainId]?.[tokenA.address] ?? [] : []
    const additionalB = tokenB ? ADDITIONAL_BASES[chainId]?.[tokenB.address] ?? [] : []

    return [...common, ...additionalA, ...additionalB]
  }, [chainId, tokenA, tokenB])

  const basePairs: [Token, Token][] = useMemo(
    () => flatMap(bases, (base): [Token, Token][] => bases.map((otherBase) => [base, otherBase])),
    [bases],
  )

  const allPairCombinations: [Token, Token][] = useMemo(
    () =>
      tokenA && tokenB
        ? [
            // the direct pair
            [tokenA, tokenB],
            // token A against all bases
            ...bases.map((base): [Token, Token] => [tokenA, base]),
            // token B against all bases
            ...bases.map((base): [Token, Token] => [tokenB, base]),
            // each base against all bases
            ...basePairs,
          ]
            .filter((tokens): tokens is [Token, Token] => Boolean(tokens[0] && tokens[1]))
            .filter(([t0, t1]) => t0.address !== t1.address)
            .filter(([tokenA_, tokenB_]) => {
              if (!chainId) return true
              const customBases = CUSTOM_BASES[chainId]

              const customBasesA: Token[] | undefined = customBases?.[tokenA_.address]
              const customBasesB: Token[] | undefined = customBases?.[tokenB_.address]

              if (!customBasesA && !customBasesB) return true

              if (customBasesA && !customBasesA.find((base) => tokenB_.equals(base))) return false
              if (customBasesB && !customBasesB.find((base) => tokenA_.equals(base))) return false

              return true
            })
        : [],
    [tokenA, tokenB, bases, basePairs, chainId],
  )

  const allPairs = usePairs(allPairCombinations)

  // only pass along valid pairs, non-duplicated pairs
  return useMemo(
    () =>
      Object.values(
        allPairs
          // filter out invalid pairs
          .filter((result): result is [PairState.EXISTS, Pair] => Boolean(result[0] === PairState.EXISTS && result[1]))
          // filter out duplicated pairs
          .reduce<{ [pairAddress: string]: Pair }>((memo, [, curr]) => {
            memo[curr.liquidityToken.address] = memo[curr.liquidityToken.address] ?? curr
            return memo
          }, {}),
      ),
    [allPairs],
  )
}

const MAX_HOPS = 3

/**
 * Returns the best trade for the exact amount of tokens in to the given token out
 */
export function useTradeExactIn(currencyAmountIn?: CurrencyAmount, currencyOut?: Currency): Zap | null {
  const { chainId } = useActiveWeb3React()
  const allowedPairs = useAllCommonPairs(currencyAmountIn?.currency, currencyOut)

  const [singleHopOnly] = useUserSingleHopOnly()
  const wrapped =
    (currencyAmountIn?.currency === ETHER && currencyEquals(WETH[chainId], currencyOut)) ||
    (currencyEquals(WETH[chainId], currencyAmountIn?.currency) && currencyOut === ETHER)

  return useMemo(() => {
    if (currencyAmountIn?.currency === currencyOut || wrapped) {
      return null
    }
    if (currencyAmountIn && currencyOut && allowedPairs.length > 0) {
      if (singleHopOnly) {
        return (
          Zap.bestZapExactIn(allowedPairs, currencyAmountIn, currencyOut, { maxHops: 1, maxNumResults: 1 })[0] ?? null
        )
      }
      // search through trades with varying hops, find best trade out of them
      let bestTradeSoFar: Zap | null = null
      for (let i = 1; i <= MAX_HOPS; i++) {
        const currentTrade: Zap | null =
          Zap.bestZapExactIn(allowedPairs, currencyAmountIn, currencyOut, { maxHops: i, maxNumResults: 1 })[0] ?? null
        // if current trade is best yet, save it
        if (isZapBetter(bestTradeSoFar, currentTrade, BETTER_TRADE_LESS_HOPS_THRESHOLD)) {
          bestTradeSoFar = currentTrade
        }
      }
      return bestTradeSoFar
    }

    return null
  }, [allowedPairs, currencyAmountIn, currencyOut, singleHopOnly, wrapped])
}

export function useIsTransactionUnsupported(currencyIn?: Currency, currencyOut?: Currency): boolean {
  const unsupportedTokens: { [address: string]: Token } = useUnsupportedTokens()
  const { chainId } = useActiveWeb3React()

  const tokenIn = wrappedCurrency(currencyIn, chainId)
  const tokenOut = wrappedCurrency(currencyOut, chainId)

  // if unsupported list loaded & either token on list, mark as unsupported
  if (unsupportedTokens) {
    if (tokenIn && Object.keys(unsupportedTokens).includes(tokenIn.address)) {
      return true
    }
    if (tokenOut && Object.keys(unsupportedTokens).includes(tokenOut.address)) {
      return true
    }
  }

  return false
}

// Since a best zap can be null when its the same token we have to check for each possibility
export function mergeBestZaps(
  bestZapOne: Zap | null,
  bestZapTwo: Zap | null,
  outputCurrencies: Currency[],
  outputPair: [PairState, Pair],
  allowedSlippage: number,
  totalPairSupply: TokenAmount,
  chainId: number,
): MergedZap {
  const currencyIn = bestZapOne?.inputAmount.currency || bestZapTwo?.inputAmount.currency
  const slippageTolerance = new Percent(JSBI.BigInt(allowedSlippage), BIPS_BASE)

  // We need to check if a zap path will wrap to not estimate a route
  const inAndOutWrappedOne =
    (currencyIn === ETHER && currencyEquals(WETH[chainId], outputCurrencies[0])) ||
    (currencyEquals(WETH[chainId], currencyIn) && outputCurrencies[0] === ETHER)
  const inAndOutWrappedTwo =
    (currencyIn === ETHER && currencyEquals(WETH[chainId], outputCurrencies[1])) ||
    (currencyEquals(WETH[chainId], currencyIn) && outputCurrencies[1] === ETHER)

  // If the input token and output token are the same we need to handle values differently
  const inAndOutAreTheSame1Flag = currencyIn === outputCurrencies[0] || inAndOutWrappedOne
  const inAndOutAreTheSame2Flag = currencyIn === outputCurrencies[1] || inAndOutWrappedTwo

  // output currencies
  const outputCurrencyOne = wrappedCurrency(outputCurrencies[0], chainId)
  const outputCurrencyTwo = wrappedCurrency(outputCurrencies[1], chainId)

  const halfInput = bestZapOne?.inputAmount || bestZapTwo?.inputAmount
  // Since we divide the input by two for each route we add both inputs here
  const inputAmount =
    bestZapOne && bestZapTwo
      ? JSBI.add(bestZapOne.inputAmount.raw, bestZapTwo.inputAmount.raw)
      : bestZapOne
      ? JSBI.add(bestZapOne.inputAmount.raw, bestZapOne.inputAmount.raw)
      : bestZapTwo
      ? JSBI.add(bestZapTwo.inputAmount.raw, bestZapTwo.inputAmount.raw)
      : JSBI.BigInt(0)

  // get best paths for each
  const pathOne = bestZapOne ? bestZapOne.route.path : []
  const pathTwo = bestZapTwo ? bestZapTwo.route.path : []

  // get output amounts
  const outputOne = inAndOutAreTheSame1Flag ? halfInput : bestZapOne?.outputAmount
  const outputTwo = inAndOutAreTheSame2Flag ? halfInput : bestZapTwo?.outputAmount

  // output pairs
  const [pairState, pair] = outputPair

  const swapOutOne = outputOne
  const swapOutTwo = outputTwo

  const minSwapOutOne = inAndOutAreTheSame1Flag ? halfInput : bestZapOne?.minimumAmountOut(slippageTolerance)
  const minSwapOutTwo = inAndOutAreTheSame2Flag ? halfInput : bestZapTwo?.minimumAmountOut(slippageTolerance)

  // Wrap currencies to handle native
  const [wOutputOne, wOutputTwo, wMinSwapOutOne, wMinSwapOutTwo] = [
    wrappedCurrencyAmount(outputOne, chainId),
    wrappedCurrencyAmount(outputTwo, chainId),
    wrappedCurrencyAmount(minSwapOutOne, chainId),
    wrappedCurrencyAmount(minSwapOutTwo, chainId),
  ]

  const { priceImpactWithoutFee: priceImpactWithoutFeeOne, realizedLPFee: realizedLPFeeOne } =
    computeTradePriceBreakdown(chainId, SmartRouter.APE, bestZapOne)

  const { priceImpactWithoutFee: priceImpactWithoutFeeTwo, realizedLPFee: realizedLPFeeTwo } =
    computeTradePriceBreakdown(chainId, SmartRouter.APE, bestZapTwo)

  // Take the greater price impact as that will be used for the LP value
  const totalPriceImpact =
    priceImpactWithoutFeeOne && priceImpactWithoutFeeTwo
      ? priceImpactWithoutFeeOne.greaterThan(priceImpactWithoutFeeTwo)
        ? priceImpactWithoutFeeOne
        : priceImpactWithoutFeeTwo
      : priceImpactWithoutFeeOne
      ? priceImpactWithoutFeeOne
      : priceImpactWithoutFeeTwo

  // Add fees if swap occurs otherwise use swap
  const liquidityProviderFee =
    realizedLPFeeOne && realizedLPFeeTwo
      ? realizedLPFeeOne?.add(realizedLPFeeTwo)
      : realizedLPFeeOne
      ? realizedLPFeeOne
      : realizedLPFeeTwo

  const pairInAmount =
    outputCurrencyOne &&
    wOutputOne &&
    wOutputTwo &&
    outputCurrencyTwo &&
    pair
      ?.priceOf(inAndOutAreTheSame1Flag ? outputCurrencyTwo : outputCurrencyOne)
      .quote(inAndOutAreTheSame1Flag ? wOutputTwo : wOutputOne)

  const minPairInAmount =
    outputCurrencyOne &&
    wMinSwapOutOne &&
    wMinSwapOutTwo &&
    outputCurrencyTwo &&
    pair
      ?.priceOf(inAndOutAreTheSame1Flag ? outputCurrencyTwo : outputCurrencyOne)
      .quote(inAndOutAreTheSame1Flag ? wMinSwapOutTwo : wMinSwapOutOne)
      .raw.toString()

  const liquidityMinted =
    wOutputOne && wOutputTwo && totalPairSupply && pair?.getLiquidityMinted(totalPairSupply, wOutputOne, wOutputTwo)

  const poolTokenPercentage =
    liquidityMinted && totalPairSupply
      ? new Percent(liquidityMinted.raw, totalPairSupply.add(liquidityMinted).raw)
      : null

  return {
    currencyIn: {
      currency: currencyIn,
      inputAmount,
    },
    currencyOut1: {
      outputCurrency: outputCurrencyOne,
      outputAmount: outputOne,
      minOutputAmount: minSwapOutOne?.raw.toString(),
      path: pathOne,
    },
    currencyOut2: {
      outputCurrency: outputCurrencyTwo,
      outputAmount: outputTwo,
      minOutputAmount: minSwapOutTwo?.raw.toString(),
      path: pathTwo,
    },
    pairOut: {
      pair,
      pairState,
      totalPairSupply,
      liquidityMinted,
      inAmount: inAndOutAreTheSame1Flag
        ? { token1: pairInAmount, token2: swapOutTwo }
        : { token1: swapOutOne, token2: pairInAmount },
      minInAmount: inAndOutAreTheSame1Flag
        ? { token1: minPairInAmount, token2: minSwapOutTwo?.raw.toString() }
        : { token1: minSwapOutOne?.raw.toString(), token2: minPairInAmount },
      poolTokenPercentage,
    },
    liquidityProviderFee,
    totalPriceImpact,
    chainId,
  }
}
