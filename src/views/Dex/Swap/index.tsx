/** @jsxImportSource theme-ui */
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useAllTokens, useCurrency } from 'hooks/Tokens'
import { Field, SwapDelay } from 'state/swap/actions'
import { Flex, useModal } from '@ape.swap/uikit'
import { useSwapCallback } from 'hooks/useSwapCallback'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { computeTradePriceBreakdown } from 'utils/prices'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'contexts/Localization'
import track from 'utils/track'
import {
  useExpertModeManager,
  useIsModalShown,
  useUserRecentTransactions,
  useUserSlippageTolerance,
} from 'state/user/hooks'
import { CurrencyAmount, JSBI, Token, Trade } from '@ape.swap/sdk'
import { useDefaultsFromURLSearch, useDerivedSwapInfo, useSwapActionHandlers, useSwapState } from 'state/swap/hooks'
import useWrapCallback, { WrapType } from 'hooks/useWrapCallback'
import maxAmountSpend from 'utils/maxAmountSpend'
import { dexStyles } from '../styles'
import DexPanel from '../components/DexPanel'
import DexNav from '../components/DexNav'
import ConfirmSwapModal from './components/ConfirmSwapModal'
import ImportTokenWarningModal from './components/ImportTokenWarningModal'
import SwapSwitchButton from './components/SwapSwitchButton'
import DexActions from './components/DexActions'
import DexTradeInfo from './components/DexTradeInfo'
import LoadingBestRoute from './components/LoadingBestRoute'
import ExpertModeRecipient from './components/ExpertModeRecipient'
import confirmPriceImpactWithoutFee from './components/confirmPriceImpactWithoutFee'
import RecentTransactions from '../components/RecentTransactions'
import { useBananaAddress } from 'hooks/useAddress'
import { showCircular } from 'utils'

const Swap: React.FC = () => {
  const { showBuyModal } = useIsModalShown()
  const [{ tradeToConfirm, swapErrorMessage, attemptingTxn, txHash }, setSwapState] = useState<{
    tradeToConfirm: Trade | undefined
    attemptingTxn: boolean
    swapErrorMessage: string | undefined
    txHash: string | undefined
  }>({
    tradeToConfirm: undefined,
    attemptingTxn: false,
    swapErrorMessage: undefined,
    txHash: undefined,
  })

  const loadedUrlParams = useDefaultsFromURLSearch()

  const history = useHistory()

  const [tradeValueUsd, setTradeValueUsd] = useState(0)

  const { chainId } = useActiveWeb3React()

  const { t } = useTranslation()

  const [allowedSlippage] = useUserSlippageTolerance()

  const [recentTransactions] = useUserRecentTransactions()

  // for expert mode
  const [isExpertMode] = useExpertModeManager()

  const { INPUT, OUTPUT, independentField, typedValue, recipient, swapDelay, bestRoute } = useSwapState()

  // the callback to execute the swap
  const { onSwitchTokens, onCurrencySelection, onUserInput, onChangeRecipient } = useSwapActionHandlers()
  const { v2Trade, currencyBalances, parsedAmount, currencies, inputError: swapInputError } = useDerivedSwapInfo()

  const [inputCurrency, outputCurrency] = [useCurrency(INPUT?.currencyId), useCurrency(OUTPUT?.currencyId)]
  const bananaToken = useCurrency(useBananaAddress())
  const buyingBanana = outputCurrency === bananaToken

  const {
    wrapType,
    execute: onWrap,
    inputError: wrapInputError,
  } = useWrapCallback(currencies[Field.INPUT], currencies[Field.OUTPUT], typedValue)
  const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE
  const trade = showWrap ? undefined : v2Trade
  const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT
  const parsedAmounts = showWrap
    ? {
        [Field.INPUT]: parsedAmount,
        [Field.OUTPUT]: parsedAmount,
      }
    : {
        [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : trade?.inputAmount,
        [Field.OUTPUT]: independentField === Field.OUTPUT ? parsedAmount : trade?.outputAmount,
      }

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: showWrap
      ? parsedAmounts[independentField]?.toExact() ?? ''
      : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  }

  const { callback: swapCallback, error: swapCallbackError } = useSwapCallback(
    trade,
    allowedSlippage,
    recipient,
    bestRoute,
  )

  const maxAmountInput: CurrencyAmount | undefined = maxAmountSpend(currencyBalances[Field.INPUT])

  const fetchingBestRoute =
    swapDelay === SwapDelay.USER_INPUT ||
    swapDelay === SwapDelay.FETCHING_SWAP ||
    swapDelay === SwapDelay.FETCHING_BONUS

  const { priceImpactWithoutFee } = computeTradePriceBreakdown(chainId, bestRoute.smartRouter, trade)

  const handleAcceptChanges = useCallback(() => {
    setSwapState((prevState) => ({ ...prevState, tradeToConfirm: trade }))
  }, [trade])

  const handleConfirmDismiss = useCallback(() => {
    setSwapState((prevState) => ({ ...prevState, showConfirm: false })) // if there was a tx hash, we want to clear the input
    if (txHash) {
      onUserInput(Field.INPUT, '')
    }
  }, [onUserInput, txHash])

  const handleMaxInput = useCallback(
    (field: Field) => {
      if (maxAmountInput) {
        onUserInput(field, maxAmountInput.toExact())
      }
    },
    [maxAmountInput, onUserInput],
  )

  const userHasSpecifiedInputOutput = Boolean(
    currencies[Field.INPUT] && currencies[Field.OUTPUT] && parsedAmounts[independentField]?.greaterThan(JSBI.BigInt(0)),
  )

  const { routerType } = bestRoute

  const displayBuyCircular = useCallback(
    () => showBuyModal && showCircular(chainId, history, '?modal=circular-buy'),
    [history, showBuyModal, chainId],
  )
  const handleSwap = useCallback(() => {
    if (priceImpactWithoutFee && !confirmPriceImpactWithoutFee(priceImpactWithoutFee, t)) {
      return
    }
    if (!swapCallback) {
      return
    }
    setSwapState({ attemptingTxn: true, tradeToConfirm, swapErrorMessage: undefined, txHash: undefined })
    swapCallback()
      .then(async (hash) => {
        setSwapState({ attemptingTxn: false, tradeToConfirm, swapErrorMessage: undefined, txHash: hash })
        track({
          event: 'swap',
          value: tradeValueUsd,
          chain: chainId,
          data: {
            router: routerType,
            token1: trade?.inputAmount?.currency?.getSymbol(chainId),
            token2: trade?.outputAmount?.currency?.getSymbol(chainId),
            token1Amount: Number(trade?.inputAmount.toSignificant(6)),
            token2Amount: Number(trade?.outputAmount.toSignificant(6)),
          },
        })
        if (buyingBanana && hash) displayBuyCircular()
      })
      .catch((error) => {
        setSwapState({
          attemptingTxn: false,
          tradeToConfirm,
          swapErrorMessage: error.message,
          txHash: undefined,
        })
      })
  }, [
    priceImpactWithoutFee,
    swapCallback,
    tradeToConfirm,
    trade,
    tradeValueUsd,
    chainId,
    t,
    routerType,
    buyingBanana,
    displayBuyCircular,
  ])

  // token warning stuff
  const [loadedInputCurrency, loadedOutputCurrency] = [
    useCurrency(loadedUrlParams?.inputCurrencyId),
    useCurrency(loadedUrlParams?.outputCurrencyId),
  ]
  const urlLoadedTokens: Token[] = useMemo(
    () => [loadedInputCurrency, loadedOutputCurrency]?.filter((c): c is Token => c instanceof Token) ?? [],
    [loadedInputCurrency, loadedOutputCurrency],
  )

  // dismiss warning if all imported tokens are in active lists
  const defaultTokens = useAllTokens()
  const importTokensNotInDefault = useMemo(
    () =>
      urlLoadedTokens &&
      urlLoadedTokens.filter((token: Token) => {
        return !(token.address in defaultTokens)
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [urlLoadedTokens],
  )

  const [onPresentImportTokenWarningModal] = useModal(
    <ImportTokenWarningModal tokens={importTokensNotInDefault} onCancel={() => history.push('/swap/')} />,
  )

  useEffect(() => {
    if (importTokensNotInDefault.length > 0) {
      onPresentImportTokenWarningModal()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [importTokensNotInDefault.length])

  const [onPresentConfirmModal] = useModal(
    <ConfirmSwapModal
      trade={trade}
      originalTrade={tradeToConfirm}
      onAcceptChanges={handleAcceptChanges}
      attemptingTxn={attemptingTxn}
      txHash={txHash}
      bestRoute={bestRoute}
      recipient={recipient}
      allowedSlippage={allowedSlippage}
      onConfirm={handleSwap}
      swapErrorMessage={swapErrorMessage}
      customOnDismiss={handleConfirmDismiss}
    />,
    true,
    true,
    'swapConfirmModal',
  )

  return (
    <Flex sx={dexStyles.pageContainer}>
      <Flex sx={{ flexDirection: 'column' }}>
        <Flex sx={dexStyles.dexContainer}>
          <DexNav />
          <Flex sx={{ margin: '25px 0px', maxWidth: '100%', width: '420px' }} />
          <DexPanel
            value={formattedAmounts[Field.INPUT]}
            panelText="From"
            currency={inputCurrency}
            otherCurrency={outputCurrency}
            setTradeValueUsd={setTradeValueUsd}
            fieldType={Field.INPUT}
            onCurrencySelect={onCurrencySelection}
            onUserInput={onUserInput}
            handleMaxInput={handleMaxInput}
            smartRouter={bestRoute.smartRouter}
            independentField={independentField}
            disabled={fetchingBestRoute}
          />
          <SwapSwitchButton onClick={onSwitchTokens} />
          <DexPanel
            value={formattedAmounts[Field.OUTPUT]}
            panelText="To"
            currency={outputCurrency}
            otherCurrency={inputCurrency}
            fieldType={Field.OUTPUT}
            onCurrencySelect={onCurrencySelection}
            onUserInput={onUserInput}
            smartRouter={bestRoute.smartRouter}
            independentField={independentField}
            disabled={fetchingBestRoute}
          />

          <ExpertModeRecipient
            recipient={recipient}
            showWrap={showWrap}
            isExpertMode={isExpertMode}
            onChangeRecipient={onChangeRecipient}
          />
          {showWrap ? (
            <></>
          ) : fetchingBestRoute ? (
            <LoadingBestRoute />
          ) : (
            <DexTradeInfo
              trade={v2Trade}
              allowedSlippage={allowedSlippage}
              bestRoute={bestRoute}
              swapDelay={swapDelay}
            />
          )}
          <DexActions
            inputCurrency={inputCurrency}
            trade={trade}
            wrapInputError={wrapInputError}
            swapInputError={swapInputError}
            isExpertMode={isExpertMode}
            showWrap={showWrap}
            wrapType={wrapType}
            routerType={bestRoute.routerType}
            smartRouter={bestRoute.smartRouter}
            swapCallbackError={swapCallbackError}
            priceImpactWithoutFee={priceImpactWithoutFee}
            userHasSpecifiedInputOutput={userHasSpecifiedInputOutput}
            onWrap={onWrap}
            handleSwap={handleSwap}
            onPresentConfirmModal={onPresentConfirmModal}
            setSwapState={setSwapState}
            disabled={fetchingBestRoute}
          />
        </Flex>
        {recentTransactions && <RecentTransactions />}
      </Flex>
    </Flex>
  )
}

export default React.memo(Swap)
