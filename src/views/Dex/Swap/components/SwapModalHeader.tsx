/** @jsxImportSource theme-ui */
import React, { useMemo } from 'react'
import { Trade, TradeType } from '@ape.swap/sdk'
import { Text, ErrorIcon, Button, Flex, Svg } from '@ape.swap/uikit'
import { computeTradePriceBreakdown, warningSeverity } from 'utils/prices'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { AutoColumn } from 'components/layout/Column'
import { RouterTypeParams } from 'state/swap/actions'
import { CurrencyLogo } from 'components/Logo'
import { RowBetween, RowFixed } from 'components/layout/Row'
import truncateHash from 'utils/truncateHash'
import { useTranslation } from 'contexts/Localization'
import { styles } from './styles'

export default function SwapModalHeader({
  trade,
  recipient,
  showAcceptChanges,
  onAcceptChanges,
  bestRoute,
}: {
  trade: Trade
  allowedSlippage: number
  recipient: string | null
  showAcceptChanges: boolean
  bestRoute: RouterTypeParams
  onAcceptChanges: () => void
}) {
  const { t } = useTranslation()

  const { chainId } = useActiveWeb3React()
  const { priceImpactWithoutFee } = useMemo(
    () => computeTradePriceBreakdown(chainId, bestRoute.smartRouter, trade),
    [trade, chainId, bestRoute],
  )
  const priceImpactSeverity = warningSeverity(priceImpactWithoutFee)

  const truncatedRecipient = recipient ? truncateHash(recipient) : ''

  const recipientInfoText = `${t('Output will be sent to')} ${truncatedRecipient}`

  const [recipientSentToText, postSentToText] = recipientInfoText.split(truncatedRecipient)

  return (
    <>
      <Flex sx={{ ...styles.SwapConfirmDisabledInputContainer, transform: 'translate(0px, 12px)' }}>
        <Text
          size="22px"
          weight={700}
          color={showAcceptChanges && trade.tradeType === TradeType.EXACT_OUTPUT ? 'yellow' : 'text'}
        >
          {trade.inputAmount.toSignificant(6)}
        </Text>
        <Flex sx={{ alignItems: 'center' }}>
          <CurrencyLogo currency={trade.inputAmount.currency} size="30px" />
          <Text size="14px" weight={700} ml="10px">
            {trade.inputAmount.currency.getSymbol(chainId)}
          </Text>
        </Flex>
      </Flex>
      <Flex sx={{ justifyContent: 'center' }}>
        <Flex sx={styles.outerLogoCircle}>
          <Flex sx={styles.innerLogoCircle}>
            <Svg icon="arrow" width="6px" color="primaryBright" />
          </Flex>
        </Flex>
      </Flex>
      <Flex sx={{ ...styles.SwapConfirmDisabledInputContainer, transform: 'translate(0px, -12px)' }}>
        <Text
          size="22px"
          weight={700}
          color={
            priceImpactSeverity > 2
              ? 'error'
              : showAcceptChanges && trade.tradeType === TradeType.EXACT_INPUT
              ? 'yellow'
              : 'text'
          }
        >
          {trade.outputAmount.toSignificant(6)}
        </Text>
        <Flex sx={{ alignItems: 'center' }}>
          <CurrencyLogo currency={trade.outputAmount.currency} size="30px" />
          <Text size="14px" weight={700} ml="10px">
            {trade.outputAmount.currency.getSymbol(chainId)}
          </Text>
        </Flex>
      </Flex>
      <>
        {showAcceptChanges ? (
          <Flex sx={{ margin: '10px 0px' }}>
            <RowBetween>
              <RowFixed>
                <ErrorIcon mr="8px" />
                <Text bold>{t('Price Updated')}</Text>
              </RowFixed>
              <Button size="sm" onClick={onAcceptChanges}>
                {t('Accept')}
              </Button>
            </RowBetween>
          </Flex>
        ) : null}
        {recipient !== null ? (
          <AutoColumn justify="flex-start" gap="sm" style={{ padding: '12px 0 0 0px' }}>
            <Text>
              {recipientSentToText}
              <b title={recipient}>{truncatedRecipient}</b>
              {postSentToText}
            </Text>
          </AutoColumn>
        ) : null}
      </>
    </>
  )
}
