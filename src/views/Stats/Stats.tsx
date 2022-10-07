import React, { useState } from 'react'
import { Select, SelectItem, Text } from '@apeswapfinance/uikit'

import { useTranslation } from 'contexts/Localization'

import useIsMobile from 'hooks/useIsMobile'
import useActiveWeb3React from 'hooks/useActiveWeb3React'

import { useStats } from 'state/statsPage/hooks'
import { ChainOption } from 'state/statsPage/types'

import Page from 'components/layout/Page'
import ConnectButton from 'components/LiquidityWidget/ConnectButton'
import { NFT } from './components/NFT'
import Analytics from './components/Analytics'
import Portfolio from './components/Portfolio'
import PageLoader from '../../components/PageLoader'
import { BannerStats } from './components/BannerStats'
import { TabNavStats } from './components/TabNavStats'
import { ShareButton } from './components/ShareButton'

import { Pacoca, PacocaCard, StatsContent, StyledFlex, TopContent } from './styles'

const displayChainOptions = [
  {
    label: 'All Chains',
    value: 'all',
  },
  {
    label: 'BNB Chain',
    value: 'bnb',
  },
  {
    label: 'Polygon',
    value: 'polygon',
  },
]

const Stats: React.FC = () => {
  const { t } = useTranslation()
  const isMobile = useIsMobile()
  const { account } = useActiveWeb3React()
  const { selectedChain, handleChangeSelectedChain, loading } = useStats()
  const [activeTab, setActiveTab] = useState('Analytics')

  const tabMenuMap = {
    Portfolio: <Portfolio />,
    Analytics: <Analytics />,
    NFT: <NFT />,
  }

  const handleChangeActiveTab = (tab: string) => {
    setActiveTab(tab)
  }

  return (
    <>
      <TopContent>
        <StyledFlex loading={loading}>
          <Select
            size="sm"
            width={isMobile ? '100%' : '122px'}
            height="36px"
            onChange={(e) => handleChangeSelectedChain(e.target.value as ChainOption)}
            active={selectedChain}
          >
            {displayChainOptions.map((option) => {
              return (
                <SelectItem key={option.label} value={option.value} size="sm">
                  <Text fontSize="12px !important" fontWeight={500}>
                    {t(option.label)}
                  </Text>
                </SelectItem>
              )
            })}
          </Select>
          <ShareButton />
        </StyledFlex>
      </TopContent>

      <BannerStats />

      <Page width="1220px">
        <TabNavStats activeTab={activeTab} onChangeActiveTab={handleChangeActiveTab} />

        <StatsContent>
          {!account ? (
            <>
              <div style={{ marginBottom: '144px' }}>
                <Text margin="128px 0 16px 0" textTransform="uppercase">
                  {t('You are not connected')}
                </Text>
                <ConnectButton />
              </div>
            </>
          ) : loading ? (
            <PageLoader />
          ) : (
            tabMenuMap[activeTab]
          )}
        </StatsContent>
        <PacocaCard href="https://pacoca.io/" target="_blank">
          <Text fontSize="12px">Stats powered by</Text>
          <Pacoca width="83px" height="24px" />
        </PacocaCard>
      </Page>
    </>
  )
}

export default Stats
