/** @jsxImportSource theme-ui */
import React from 'react'
import { ONE_BIPS } from 'config/constants'
import { Flex, Text } from '@ape.swap/uikit'
import { useTranslation } from 'contexts/Localization'
import { MergedZap } from 'state/zap/actions'
import FormattedPriceImpact from '../../../components/FormattedPriceImpact'

interface DetailsPanelProps {
  zap: MergedZap
}

const DetailsPanel: React.FC<DetailsPanelProps> = ({ zap }) => {
  const { t } = useTranslation()
  const { pairOut, currencyOut1, currencyOut2, liquidityProviderFee, currencyIn, chainId, totalPriceImpact } = zap
  return (
    <Flex sx={{ flexDirection: 'column', marginTop: '15px' }}>
      <Row>
        <StyledText>{t('Price Impact')}</StyledText>
        <FormattedPriceImpact priceImpact={totalPriceImpact} />
      </Row>
      <Row>
        <StyledText>{t('Liquidity Provider Fee')}</StyledText>
        <StyledText>
          {liquidityProviderFee.toSignificant(3)} {currencyIn.currency.getSymbol(chainId)}
        </StyledText>
      </Row>
      <Row>
        <StyledText>{t('Share of Pool')}</StyledText>
        <StyledText>
          {(pairOut?.poolTokenPercentage?.lessThan(ONE_BIPS) ? '<0.01' : pairOut?.poolTokenPercentage?.toFixed(2)) ??
            '0'}
          %
        </StyledText>
      </Row>
      <Row>
        <StyledText>{`${currencyOut1?.outputCurrency?.symbol} per ${currencyOut2?.outputCurrency?.symbol}`}</StyledText>
        <StyledText>{currencyOut1?.outputAmount?.divide(currencyOut2?.outputAmount).toSignificant(5)}</StyledText>
      </Row>
      <Row>
        <StyledText>{`${currencyOut2?.outputCurrency?.symbol} per ${currencyOut1.outputCurrency.symbol}`}</StyledText>
        <StyledText>{currencyOut2?.outputAmount?.divide(currencyOut1?.outputAmount).toSignificant(5)}</StyledText>
      </Row>
    </Flex>
  )
}

export default React.memo(DetailsPanel)

const Row: React.FC = ({ children }) => {
  return <Flex sx={{ justifyContent: 'space-between' }}>{children}</Flex>
}

const StyledText: React.FC = ({ children }) => {
  return <Text sx={{ fontSize: '12px', lineHeight: '18px' }}>{children}</Text>
}
