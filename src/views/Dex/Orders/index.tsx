/** @jsxImportSource theme-ui */
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useAllTokens, useCurrency } from 'hooks/Tokens'
import { Field } from 'state/orders/actions'
import { Flex, Text, useModal } from '@ape.swap/uikit'
import { Link } from '@apeswapfinance/uikit'
import { computeLegacyPriceBreakdown } from 'utils/prices'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'contexts/Localization'
import { CurrencyAmount, JSBI, Token, Trade } from '@ape.swap/sdk'
import { useExpertModeManager, useUserSlippageTolerance } from 'state/user/hooks'
import { useDefaultsFromURLSearch, useDerivedSwapInfo, useSwapActionHandlers, useSwapState } from 'state/orders/hooks'
import useWrapCallback, { WrapType } from 'hooks/useWrapCallback'
import { useOrderCallback } from 'hooks/useOrderCallback'
import maxAmountSpend from 'utils/maxAmountSpend'
import { dexStyles } from '../styles'
import DexPanel from '../components/DexPanel'
import DexNav from '../components/DexNav'
import OrderSwapModal from './components/OrderSwapModal'
import confirmPriceImpactWithoutFee from './components/confirmPriceImpactWithoutFee'
import SwapSwitchButton from './components/SwapSwitchButton'
import PriceInputPanel from './components/PriceInputPanel'
import OrdersActions from './components/OrdersActions'
import OrderHistoryPanel from './components/OrderHistoryPanel'
import OrderTradeInfo from './components/OrderTradeInfo'
import ImportTokenWarningModal from '../Swap/components/ImportTokenWarningModal'

const Orders: React.FC = () => {
  const loadedUrlParams = useDefaultsFromURLSearch()
  // modal and loading
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

  const { t } = useTranslation()

  const [allowedSlippage] = useUserSlippageTolerance()

  const history = useHistory()

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
  const importTokensNotInDefault =
    urlLoadedTokens &&
    urlLoadedTokens.filter((token: Token) => {
      return !(token.address in defaultTokens)
    })

  const [onPresentImportTokenWarningModal] = useModal(
    <ImportTokenWarningModal tokens={importTokensNotInDefault} onCancel={() => history.push('/limit-orders')} />,
  )

  useEffect(() => {
    if (importTokensNotInDefault.length > 0) {
      onPresentImportTokenWarningModal()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [importTokensNotInDefault.length])

  // for expert mode
  const [isExpertMode] = useExpertModeManager()

  const { INPUT, OUTPUT, independentField, typedValue, recipient } = useSwapState()

  // the callback to execute the swap
  const { onSwitchTokens, onCurrencySelection, onUserInput } = useSwapActionHandlers()
  const { v2Trade, currencyBalances, parsedAmount, currencies, inputError: swapInputError } = useDerivedSwapInfo()

  const [inputCurrency, outputCurrency] = [useCurrency(INPUT?.currencyId), useCurrency(OUTPUT?.currencyId)]

  const { wrapType, execute: onWrap } = useWrapCallback(currencies[Field.INPUT], currencies[Field.OUTPUT], typedValue)
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: showWrap
      ? parsedAmounts[independentField]?.toExact() ?? ''
      : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  }

  const maxAmountInput: CurrencyAmount | undefined = maxAmountSpend(currencyBalances[Field.INPUT])

  const { priceImpactWithoutFee } = computeLegacyPriceBreakdown(trade)

  const [limitOrderPrice, setLimitOrderPrice] = useState<string>('')
  const [inputFocused, setInputFocused] = useState<boolean>(true)
  const realPriceValue = useMemo(() => {
    if (inputFocused) {
      const price = Number(formattedAmounts[Field.OUTPUT]) / Number(formattedAmounts[Field.INPUT])
      return price === Infinity || Number.isNaN(price) ? '' : price.toFixed(6)
    }
    return limitOrderPrice
  }, [inputFocused, limitOrderPrice, formattedAmounts])

  const outputMinAmount = useMemo(() => {
    return (Number(realPriceValue) * Number(formattedAmounts[Field.INPUT])).toString()
  }, [realPriceValue, formattedAmounts])

  const realOutputValue = useMemo(
    () => (inputFocused ? formattedAmounts[Field.OUTPUT] : outputMinAmount),
    [inputFocused, formattedAmounts, outputMinAmount],
  )

  const orderMarketStatus = useMemo(() => {
    const marketOutput = trade?.outputAmount.toExact()
    if (marketOutput && outputMinAmount) {
      return ((Number(outputMinAmount) - Number(marketOutput)) * 100) / Number(marketOutput)
    }
    return 0
  }, [trade, outputMinAmount])

  const handleTypePrice = useCallback(
    (value: string) => {
      setInputFocused(false)
      setLimitOrderPrice(value)
    },
    [setInputFocused, setLimitOrderPrice],
  )

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

  // the callback to execute the swap
  const { callback: swapCallback, error: swapCallbackError } = useOrderCallback(
    trade,
    recipient,
    outputMinAmount,
    orderMarketStatus,
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
      })
      .catch((error) => {
        setSwapState({
          attemptingTxn: false,
          tradeToConfirm,
          swapErrorMessage: error.message,
          txHash: undefined,
        })
      })
  }, [priceImpactWithoutFee, swapCallback, tradeToConfirm, t])

  const [onPresentConfirmModal] = useModal(
    <OrderSwapModal
      trade={trade}
      originalTrade={tradeToConfirm}
      onAcceptChanges={handleAcceptChanges}
      attemptingTxn={attemptingTxn}
      txHash={txHash}
      bestRoute={null}
      currencies={currencies}
      orderMarketStatus={orderMarketStatus}
      recipient={recipient}
      allowedSlippage={allowedSlippage}
      onConfirm={handleSwap}
      swapErrorMessage={swapErrorMessage}
      customOnDismiss={handleConfirmDismiss}
      realPriceValue={realPriceValue}
      realOutputAmount={realOutputValue}
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
            fieldType={Field.INPUT}
            onCurrencySelect={onCurrencySelection}
            onUserInput={(field, val) => {
              onUserInput(field, val)
              setInputFocused(true)
            }}
            handleMaxInput={handleMaxInput}
          />
          <SwapSwitchButton onClick={onSwitchTokens} />
          <DexPanel
            value={realOutputValue}
            panelText="To"
            currency={outputCurrency}
            otherCurrency={inputCurrency}
            fieldType={Field.OUTPUT}
            onCurrencySelect={onCurrencySelection}
            onUserInput={onUserInput}
            ordersDisabled
          />
          <PriceInputPanel
            value={realPriceValue}
            currentPrice={trade?.executionPrice.toSignificant(6)}
            inputValue={formattedAmounts[Field.INPUT]}
            inputCurrency={currencies[Field.INPUT]}
            outputCurrency={currencies[Field.OUTPUT]}
            onUserInput={handleTypePrice}
            id="orders-currency-price"
          />
          <OrderTradeInfo
            executionPrice={trade?.executionPrice}
            currencies={currencies}
            orderMarketStatus={orderMarketStatus}
            realPriceValue={realPriceValue}
          />
          <OrdersActions
            trade={trade}
            swapInputError={swapInputError}
            isExpertMode={isExpertMode}
            showWrap={showWrap}
            wrapType={wrapType}
            routerType={null}
            swapCallbackError={swapCallbackError}
            priceImpactWithoutFee={priceImpactWithoutFee}
            userHasSpecifiedInputOutput={userHasSpecifiedInputOutput}
            onWrap={onWrap}
            handleSwap={handleSwap}
            onPresentConfirmModal={onPresentConfirmModal}
            setSwapState={setSwapState}
          />
          <Flex sx={{ justifyContent: 'center', mt: '8px', transform: 'translate(0px, 3px)' }}>
            <Link external href="https://autonomynetwork.io">
              <Text size="12px">Powered by Autonomy Network</Text>
            </Link>
          </Flex>
        </Flex>
        <OrderHistoryPanel />
      </Flex>
    </Flex>
  )
}

export default React.memo(Orders)
