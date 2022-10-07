import React from 'react'
import { Flex, Svg } from '@apeswapfinance/uikit'
import { useTranslation } from 'contexts/Localization'
import { TVLBreakdown } from './components/TVLBreakdown'
import { ProjectedEarnings } from './components/ProjectedEarnings'
import { Tooltip } from '../Tooltip'

import { AssetsContainer, CardInfo, Container, Heading } from './styles'
import AssetBreakdown from './components/AssetBreakdown'
import { VestedEarnings } from './components/VestedEarnings'

const Analytics: React.FC = () => {
  const { t } = useTranslation()

  return (
    <Container>
      <CardInfo>
        <Heading>TVL Breakdown</Heading>

        <TVLBreakdown />
      </CardInfo>

      <CardInfo>
        <Heading>
          <Flex alignItems="center" style={{ gap: '8px' }}>
            {t('Projected Earnings')}
            <Tooltip
              content={t(
                'Earnings are calculated at current, real-time market rates, are not guaranteed, and are intended for illustrative purposes only.',
              )}
            >
              <Svg icon="question" color="text" width={16} />
            </Tooltip>
          </Flex>
        </Heading>

        <ProjectedEarnings />
      </CardInfo>

      <CardInfo style={{ overflow: 'hidden' }}>
        <Heading>{t('Asset Breakdown')}</Heading>

        <AssetsContainer>
          <AssetBreakdown />
        </AssetsContainer>
      </CardInfo>

      <CardInfo>
        <Heading>
          <Flex alignItems="center" marginBottom="24px" style={{ gap: '8px' }}>
            {t('Vested Earnings')}
            <Tooltip
              content={t(
                'Earnings are vested over predefined timeframes based on your commitments to various ApeSwap products.',
              )}
            >
              <Svg icon="question" color="text" width={16} />
            </Tooltip>
          </Flex>
        </Heading>

        <VestedEarnings />
      </CardInfo>
    </Container>
  )
}

export default React.memo(Analytics)
