/** @jsxImportSource theme-ui */
import React from 'react'
import { Text } from '@apeswapfinance/uikit'
import { Flex, LinkExternal } from '@ape.swap/uikit'
import { Farm } from 'state/types'
import { useTranslation } from 'contexts/Localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'

const InfoContent: React.FC<{ farm: Farm }> = ({ farm }) => {
  const { t } = useTranslation()
  const { chainId } = useActiveWeb3React()
  const bscScanUrl = `https://bscscan.com/address/${farm.lpAddresses[chainId]}`
  const { projectLink } = farm

  return (
    <Flex sx={{ flexDirection: 'column' }}>
      <Flex sx={{ width: '100%', alignItems: 'space-between', justifyContent: 'space-between' }}>
        <Text style={{ fontSize: '12px' }}>{t('Multiplier')}</Text>
        <Text bold style={{ fontSize: '12px' }}>
          {Math.round(parseFloat(farm.multiplier) * 1000) / 100}X
        </Text>
      </Flex>
      <Flex sx={{ width: '100%', alignItems: 'space-between', justifyContent: 'space-between' }}>
        <Text style={{ fontSize: '12px' }}>{t('Stake')}</Text>
        <Text bold style={{ fontSize: '12px' }}>
          {farm.lpSymbol} {t('LP')}
        </Text>
      </Flex>
      <Flex sx={{ alignItems: 'center', justifyContent: 'center', marginTop: '15px' }}>
        <LinkExternal href={bscScanUrl} style={{ fontSize: '14px' }}>
          {t('View on BscScan')}
        </LinkExternal>
      </Flex>
      {projectLink && (
        <Flex sx={{ alignItems: 'center', justifyContent: 'center', marginTop: '15px' }}>
          <LinkExternal href={projectLink} style={{ fontSize: '14px' }}>
            {t('Learn More')}
          </LinkExternal>
        </Flex>
      )}
    </Flex>
  )
}

export default InfoContent
