import React from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import { MarketingModal } from '@ape.swap/uikit'
import { LendingBodies } from 'components/MarketingModalContent/Lending/'
import { FarmsBodies } from 'components/MarketingModalContent/Farms/'
import { PoolsBodies } from 'components/MarketingModalContent/Pools/'
import { BillsBodies } from 'components/MarketingModalContent/Bills/'
import CircularModal from 'components/CircularModal'
import { useTranslation } from 'contexts/Localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import MoonPayModal from 'views/Topup/MoonpayModal'
import GnanaModal from 'components/GnanaModal'
//import SwiperProvider from 'contexts/SwiperProvider'
//import QuestModal from '../MarketingModalContent/Quests/QuestModal'
import {
  MODAL_TYPE,
  // SET_DEFAULT_MODAL_KEY,
  // SHOW_DEFAULT_MODAL_KEY
} from 'config/constants'
import { circularRoute } from 'utils'

const MarketingModalCheck = () => {
  const { chainId } = useActiveWeb3React()
  const location = useLocation()
  const history = useHistory()
  const { t } = useTranslation()
  /*
  useMemo(() => {
    const onHomepage = history.location.pathname === '/'
    const sdmk = localStorage.getItem(SET_DEFAULT_MODAL_KEY)
    const isdm = localStorage.getItem(SHOW_DEFAULT_MODAL_KEY)

    // This needs to be fixed but I didnt want to reset users local storage keys
    // Basically first land users wont get the modal until they refresh so I added a showDefaultModalFlag variable
    const isDefaultModalSet = JSON.parse(sdmk)
    const isShowDefaultModal = JSON.parse(isdm)
    const showDefaultModalFlag = isShowDefaultModal || (!isShowDefaultModal && !isDefaultModalSet)

    if (!isDefaultModalSet) {
      localStorage.setItem(SHOW_DEFAULT_MODAL_KEY, JSON.stringify('SHOW'))
    }

    if (showDefaultModalFlag && onHomepage) {
      history.push({ search: '?modal=tutorial' })
    }
  }, [history])
  */

  const farmsRoute = location.search.includes('modal=1')
  const poolsRoute = location.search.includes('modal=2')
  const lendingRoute = location.search.includes('modal=3')
  const billsRoute = location.search.includes('modal=bills')
  //const questRoute = location.search.includes('modal=tutorial')
  const moonpayRoute = location.search.includes('modal=moonpay')
  const getGnanaRoute = location.search.includes('modal=gnana')
  const buyRoute = circularRoute(chainId, location, 'modal=circular-buy')
  const sellRoute = circularRoute(chainId, location, 'modal=circular-sell')
  const phRoute = circularRoute(chainId, location, 'modal=circular-ph')
  const ghRoute = circularRoute(chainId, location, 'modal=circular-gh')

  const { LendingBody1, LendingBody2, LendingBody3, LendingBody4, LendingBody5 } = LendingBodies
  const { FarmsBody1, FarmsBody2, FarmsBody3, FarmsBody4 } = FarmsBodies
  const { PoolsBody1, PoolsBody2, PoolsBody3, PoolsBody4 } = PoolsBodies
  const { BillsBody1 } = BillsBodies

  const onDismiss = () => {
    history.push({
      pathname: location.pathname,
    })
  }

  const lending = [
    <LendingBody1 key="lend1" />,
    <LendingBody2 key="lend2" />,
    <LendingBody3 key="lend3" />,
    <LendingBody4 key="lend4" />,
    <LendingBody5 key="lend5" />,
  ]
  const farms = [
    <FarmsBody1 key="farm1" />,
    <FarmsBody2 key="farm2" />,
    <FarmsBody3 key="farm3" />,
    <FarmsBody4 key="farm4" />,
  ]
  const pools = [
    <PoolsBody1 key="pool1" />,
    <PoolsBody2 key="pool2" />,
    <PoolsBody3 key="pool3" />,
    <PoolsBody4 key="pool4" />,
  ]
  const bills = [<BillsBody1 key="bill1" />]

  return lendingRoute ? (
    <MarketingModal
      title={t("Welcome to ApeSwap's Lending Network")}
      description={t('How does it work?')}
      onDismiss={onDismiss}
      startEarning={onDismiss}
      startEarningText={t('Start Earning')}
    >
      {lending}
    </MarketingModal>
  ) : farmsRoute ? (
    <MarketingModal
      title={t("Welcome to ApeSwap's Farms")}
      description={t('Start earning passive income with your cryptocurrency!')}
      onDismiss={onDismiss}
      startEarning={onDismiss}
      startEarningText={t('Start Earning')}
    >
      {farms}
    </MarketingModal>
  ) : poolsRoute ? (
    <MarketingModal
      title={t("Welcome to ApeSwap's Pools")}
      description={t('Earn tokens by staking BANANA or GNANA')}
      onDismiss={onDismiss}
      startEarning={onDismiss}
      startEarningText={t('Start Earning')}
    >
      {pools}
    </MarketingModal>
  ) : billsRoute ? (
    <MarketingModal
      title={t('Welcome to ApeSwap Treasury Bills')}
      onDismiss={onDismiss}
      startEarning={onDismiss}
      startEarningText={t("I'M READY")}
    >
      {bills}
    </MarketingModal>
  ) : /* ) : questRoute ? (
     <SwiperProvider>
       <QuestModal onDismiss={onDismiss} />
     </SwiperProvider> */
  moonpayRoute ? (
    <MoonPayModal onDismiss={onDismiss} />
  ) : getGnanaRoute ? (
    <GnanaModal onDismiss={onDismiss} />
  ) : buyRoute ? (
    <CircularModal actionType={MODAL_TYPE.BUYING} onDismiss={onDismiss} />
  ) : sellRoute ? (
    <CircularModal actionType={MODAL_TYPE.SELLING} onDismiss={onDismiss} />
  ) : phRoute ? (
    <CircularModal actionType={MODAL_TYPE.POOL_HARVEST} onDismiss={onDismiss} />
  ) : ghRoute ? (
    <CircularModal actionType={MODAL_TYPE.GENERAL_HARVEST} onDismiss={onDismiss} />
  ) : null
}

export default React.memo(MarketingModalCheck)
