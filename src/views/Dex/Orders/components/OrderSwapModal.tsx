/** @jsxImportSource theme-ui */
import React, { useCallback, useMemo } from 'react'
import { Currency, currencyEquals, Trade } from '@ape.swap/sdk'
import { ModalProps } from '@apeswapfinance/uikit'
import { Flex } from '@ape.swap/uikit'
import { RouterTypeParams } from 'state/swap/actions'
import TransactionConfirmationModal, { TransactionErrorContent } from 'components/TransactionConfirmationModal'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useTranslation } from 'contexts/Localization'
import SwapModalHeader from './SwapModalHeader'
import SwapModalFooter from './SwapModalFooter'

/**
 * Returns true if the trade requires a confirmation of details before we can submit it
 * @param tradeA trade A
 * @param tradeB trade B
 */
function tradeMeaningfullyDiffers(tradeA: Trade, tradeB: Trade): boolean {
  return (
    tradeA.tradeType !== tradeB.tradeType ||
    !currencyEquals(tradeA.inputAmount.currency, tradeB.inputAmount.currency) ||
    !tradeA.inputAmount.equalTo(tradeB.inputAmount) ||
    !currencyEquals(tradeA.outputAmount.currency, tradeB.outputAmount.currency) ||
    !tradeA.outputAmount.equalTo(tradeB.outputAmount)
  )
}
interface ConfirmSwapModalProps {
  trade?: Trade
  originalTrade?: Trade
  attemptingTxn: boolean
  currencies: {
    INPUT?: Currency
    OUTPUT?: Currency
  }
  orderMarketStatus: number
  txHash?: string
  recipient: string | null
  allowedSlippage: number
  realPriceValue: string
  realOutputAmount: string
  bestRoute: RouterTypeParams
  onAcceptChanges: () => void
  onConfirm: () => void
  swapErrorMessage?: string
  customOnDismiss?: () => void
}

const OrderSwapModal: React.FC<ModalProps & ConfirmSwapModalProps> = ({
  trade,
  originalTrade,
  onAcceptChanges,
  allowedSlippage,
  onConfirm,
  onDismiss,
  customOnDismiss,
  bestRoute,
  recipient,
  swapErrorMessage,
  attemptingTxn,
  txHash,
  currencies,
  orderMarketStatus,
  realPriceValue,
  realOutputAmount,
}) => {
  const { chainId } = useActiveWeb3React()
  const { t } = useTranslation()
  const showAcceptChanges = useMemo(
    () => Boolean(trade && originalTrade && tradeMeaningfullyDiffers(trade, originalTrade)),
    [originalTrade, trade],
  )

  const modalHeader = useCallback(() => {
    return trade ? (
      <SwapModalHeader
        trade={trade}
        allowedSlippage={allowedSlippage}
        recipient={recipient}
        showAcceptChanges={showAcceptChanges}
        onAcceptChanges={onAcceptChanges}
        realOutputAmount={realOutputAmount}
        realPriceValue={realPriceValue}
      />
    ) : null
  }, [allowedSlippage, onAcceptChanges, recipient, showAcceptChanges, trade, realPriceValue, realOutputAmount])

  const modalBottom = useCallback(() => {
    return trade ? (
      <SwapModalFooter
        onConfirm={onConfirm}
        trade={trade}
        disabledConfirm={showAcceptChanges}
        bestRoute={bestRoute}
        swapErrorMessage={swapErrorMessage}
        allowedSlippage={allowedSlippage}
        currencies={currencies}
        orderMarketStatus={orderMarketStatus}
        realPriceValue={realPriceValue}
      />
    ) : null
  }, [
    allowedSlippage,
    onConfirm,
    showAcceptChanges,
    swapErrorMessage,
    currencies,
    orderMarketStatus,
    bestRoute,
    trade,
    realPriceValue,
  ])

  // text to show while loading
  const pendingText = `${t('Swapping')} ${trade?.inputAmount?.toSignificant(6) ?? ''} ${
    trade?.inputAmount?.currency?.getSymbol(chainId) ?? ''
  } for ${trade?.outputAmount?.toSignificant(6) ?? ''} ${trade?.outputAmount?.currency?.getSymbol(chainId) ?? ''}`

  const confirmationContent = useCallback(
    () =>
      swapErrorMessage ? (
        <TransactionErrorContent onDismiss={onDismiss} message={swapErrorMessage} />
      ) : (
        <Flex sx={{ flexDirection: 'column', width: '100%' }}>
          {modalHeader()}
          {modalBottom()}
        </Flex>
        // <ConfirmationModalContent topContent={modalHeader} bottomContent={modalBottom} />
      ),
    [onDismiss, modalBottom, modalHeader, swapErrorMessage],
  )

  return (
    <TransactionConfirmationModal
      title={t('Confirm Order')}
      onDismiss={onDismiss}
      customOnDismiss={customOnDismiss}
      attemptingTxn={attemptingTxn}
      hash={txHash}
      content={confirmationContent}
      pendingText={pendingText}
      currencyToAdd={trade?.outputAmount.currency}
    />
  )
}

export default React.memo(OrderSwapModal)
