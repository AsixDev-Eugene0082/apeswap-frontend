/** @jsxImportSource theme-ui */
import React from 'react'
import { Flex } from '@ape.swap/uikit'
import { useTranslation } from 'contexts/Localization'
import Banner from 'components/Banner'
import SwiperProvider from 'contexts/SwiperProvider'
import Values from 'views/Homepage/components/Values/Values'
import BabInfoCard from './components/BabInfoCard'
import NFBGiveaway from './components/NFBGiveaway'
import Services from 'views/Homepage/components/Services/Services'
import NewToDeFi from './components/NewToDeFi'

const Nft = () => {
  const { t } = useTranslation()

  return (
    <Flex
      sx={{
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        mb: '100px',
        marginTop: '30px',
      }}
    >
      <Flex
        sx={{
          flexDirection: 'column',
          width: ['90%', '90%', '90%', '100%'],
          maxWidth: '1200px',
          gap: ['20px', '20px', '20px', '50px'],
        }}
      >
        <Banner
          banner="BABbanner"
          link="https://ape-swap.medium.com/apeswap-adds-launch-support-for-binances-first-soulbound-token-dbb2e0e4c263"
          title={t('ApeSwap BAB Pass')}
        />
        <BabInfoCard />
        <NFBGiveaway />
      </Flex>
      <Flex className="services-con" sx={{ width: '100%', flexDirection: 'column' }}>
        <NewToDeFi />
        <SwiperProvider>
          <Services bab />
        </SwiperProvider>
        <Flex sx={{ marginTop: '25px' }} />
        <SwiperProvider>
          <Values />
        </SwiperProvider>
      </Flex>
    </Flex>
  )
}

export default Nft
