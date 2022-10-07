/** @jsxImportSource theme-ui */
import React, { useMemo } from 'react'
import { Currency, Trade } from '@ape.swap/sdk'
import { computeLegacyPriceBreakdown, warningSeverity } from 'utils/prices'
import { useTranslation } from 'contexts/Localization'
import { Button, Flex } from '@ape.swap/uikit'
import { RouterTypeParams } from 'state/swap/actions'
import OrderTradeInfo from './OrderTradeInfo'

export default function SwapModalFooter({
  trade,
  onConfirm,
  swapErrorMessage,
  disabledConfirm,
  currencies,
  orderMarketStatus,
  realPriceValue,
}: {
  trade: Trade
  currencies: {
    INPUT?: Currency
    OUTPUT?: Currency
  }
  orderMarketStatus: number
  allowedSlippage: number
  onConfirm: () => void
  bestRoute: RouterTypeParams
  swapErrorMessage: string | undefined
  disabledConfirm: boolean
  realPriceValue: string
}) {
  const { t } = useTranslation()
  const { priceImpactWithoutFee } = useMemo(() => computeLegacyPriceBreakdown(trade), [trade])
  const severity = warningSeverity(priceImpactWithoutFee)

  return (
    <Flex sx={{ flexDirection: 'column', transform: 'translate(0px, -10px)', maxWidth: '100%' }}>
      <OrderTradeInfo
        executionPrice={trade?.executionPrice}
        currencies={currencies}
        orderMarketStatus={orderMarketStatus}
        realPriceValue={realPriceValue}
      />
      <>
        <Button fullWidth onClick={onConfirm} disabled={disabledConfirm} mt="12px" id="confirm-swap-or-send">
          {severity > 2 ? t('Order Anyway') : t('Confirm Order')}
        </Button>
        {swapErrorMessage ? 'eror' : null}
      </>
    </Flex>
  )
}
