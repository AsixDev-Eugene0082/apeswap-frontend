/** @jsxImportSource theme-ui */
import { Flex, Text } from '@ape.swap/uikit'
import { styles } from './styles'
import { useTranslation } from 'contexts/Localization'
import React from 'react'
import { orderBy } from 'lodash'
import { useFetchTreasuryBreakdown } from 'state/protocolDashboard/hooks'
import AssetCard from './AssetCard'

const AssetBreakdown: React.FC<{ activeView: number }> = ({ activeView }) => {
  const { t } = useTranslation()
  const treasury = useFetchTreasuryBreakdown()

  // To make image display easier adding a isLp field to lpTokens
  const sortedTreasury = orderBy(
    [
      ...(treasury?.tokens || []),
      ...(treasury?.lpTokens?.map((lp) => {
        return { ...lp, isLp: true }
      }) || []),
    ],
    (token) => token?.value,
    'desc',
  )
  const filterLowAmounts = sortedTreasury?.filter((token) => token.value > 500)
  const sortedOpFunds = filterLowAmounts?.filter((token) => token.location === 'Operational Funds')
  const sortedPolFunds = filterLowAmounts?.filter((token) => token.location === 'POL')
  const activeAssets = [filterLowAmounts, sortedOpFunds, sortedPolFunds][activeView]
  return (
    <Flex sx={styles.cardContainer}>
      <Flex sx={{ flexDirection: 'column', textAlign: 'center', mb: '5px' }}>
        <Text size="22px" weight={700} mb="10px">
          {t('Asset Breakdown')}
        </Text>
      </Flex>
      <div sx={styles.assetBreakdownContainer}>
        {activeAssets?.map((token) => (
          <AssetCard token={token} key={token?.address} />
        ))}
      </div>
    </Flex>
  )
}

export default React.memo(AssetBreakdown)
