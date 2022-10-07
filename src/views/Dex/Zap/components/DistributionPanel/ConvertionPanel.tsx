/** @jsxImportSource theme-ui */
import React from 'react'
import { Flex, Svg, Text } from '@ape.swap/uikit'
import { Box } from 'theme-ui'
import { MergedZap } from 'state/zap/actions'
import { useTranslation } from 'contexts/Localization'
import { JSBI, Token, TokenAmount } from '@ape.swap/sdk'
import ServiceTokenDisplay from 'components/ServiceTokenDisplay'

interface ConvertionPanelProps {
  zap: MergedZap
}

const ConvertionPanel: React.FC<ConvertionPanelProps> = ({ zap }) => {
  const { t } = useTranslation()
  const { chainId, currencyIn, currencyOut1, currencyOut2, pairOut } = zap

  // This is the true value out as this is the estimated LP pair values

  const currencyOneOut = pairOut?.inAmount.token1.toSignificant(6)
  const currencyTwoOut = pairOut?.inAmount.token2.toSignificant(6)

  const halfInputAmount =
    currencyIn?.currency && currencyIn?.inputAmount
      ? new TokenAmount(currencyIn?.currency as Token, currencyIn?.inputAmount).divide(JSBI.BigInt(2)).toSignificant(5)
      : null

  return (
    <>
      <Flex sx={{ width: '100%' }}>
        <Text size="12px">{t('Converted to')}:</Text>
      </Flex>
      <Flex sx={{ width: '100%', justifyContent: 'space-around', alignItems: 'center', flexWrap: 'wrap' }}>
        <Flex sx={{ minWidth: '160px', justifyContent: 'center' }}>
          <Box sx={{ margin: '3px' }}>
            <ServiceTokenDisplay token1={currencyIn?.currency?.getSymbol(chainId)} stakeLp={true} size={17} />
          </Box>
          <Text size="12px" sx={{ marginRight: '15px' }}>
            {halfInputAmount}
          </Text>
          <Box sx={{ transform: 'rotate(270deg)' }}>
            <Svg color={'primary' as any} icon="arrow" />
          </Box>
          <Box sx={{ margin: '3px' }}>
            <ServiceTokenDisplay token1={currencyOut1?.outputCurrency?.symbol} stakeLp={true} size={17} />
          </Box>
          <Text size="12px">{currencyOneOut}</Text>
        </Flex>
        <Flex sx={{ minWidth: '160px', justifyContent: 'center' }}>
          <Box sx={{ margin: '3px' }}>
            <ServiceTokenDisplay token1={currencyIn?.currency?.getSymbol(chainId)} stakeLp={true} size={17} />
          </Box>
          <Text size="12px" sx={{ marginRight: '15px' }}>
            {halfInputAmount}
          </Text>
          <Box sx={{ transform: 'rotate(270deg)' }}>
            <Svg color={'primary' as any} icon="arrow" />
          </Box>
          <Box sx={{ margin: '3px' }}>
            <ServiceTokenDisplay token1={currencyOut2?.outputCurrency?.symbol} stakeLp={true} size={17} />
          </Box>
          <Text size="12px">{currencyTwoOut}</Text>
        </Flex>
      </Flex>
    </>
  )
}

export default React.memo(ConvertionPanel)
