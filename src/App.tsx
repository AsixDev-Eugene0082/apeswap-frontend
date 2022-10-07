import React, { useState, useEffect, Suspense, lazy, useCallback } from 'react'
import { ChainId } from '@ape.swap/sdk'
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useEagerConnect from 'hooks/useEagerConnect'
import { ResetCSS, ApeSwapTheme } from '@apeswapfinance/uikit'
import { ScrollToTop } from '@ape.swap/uikit'
import BigNumber from 'bignumber.js'
import MarketingModalCheck from 'components/MarketingModalCheck'
import { useFetchBananaPrice } from 'state/tokenPrices/hooks'
import { useFetchProfile, useUpdateNetwork, useFetchLiveIfoStatus, useFetchLiveTagsAndOrdering } from 'state/hooks'
import { usePollBlockNumber } from 'state/block/hooks'
import { PageMeta } from 'components/layout/Page'
import * as Sentry from '@sentry/react'
import { BrowserTracing } from '@sentry/tracing'
import GlobalStyle from './style/Global'
import Menu from './components/Menu'
import ToastListener from './components/ToastListener'
import PageLoader from './components/PageLoader'
import PoolFinder from './views/Dex/PoolFinder'
import ResetScroll from './utils/resetScroll'
// Most used routes get loaded directly
import Pool from './views/Dex/Pool'
import Swap from './views/Dex/Swap'
import AddLiquidity from './views/Dex/AddLiquidity'
import Zap from './views/Dex/Zap'
import RemoveLiquidity from './views/Dex/RemoveLiquidity'
import useCircularStaking from 'hooks/useCircularStaking'

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  integrations: [new BrowserTracing()],
  tracesSampleRate: 0.1,
})

declare module '@emotion/react' {
  export interface Theme extends ApeSwapTheme {}
}

// Route-based code splitting
const Home = lazy(() => import('./views/Homepage'))
const Farms = lazy(() => import('./views/Farms'))
const Pools = lazy(() => import('./views/Pools'))
const JungleFarms = lazy(() => import('./views/JungleFarms'))
const Ifos = lazy(() => import('./views/Ifos'))
const NotFound = lazy(() => import('./views/NotFound'))
const DualFarms = lazy(() => import('./views/DualFarms'))
const Nft = lazy(() => import('./views/Nft'))
const BabRaffle = lazy(() => import('./views/BabRaffle'))
const Nfa = lazy(() => import('./views/Nft/Nfa'))
const ApeZone = lazy(() => import('./views/ApeZone'))
const Stats = lazy(() => import('./views/Stats'))
const Auction = lazy(() => import('./views/Auction'))
const BurningGames = lazy(() => import('./views/BurningGames'))
const AdminPools = lazy(() => import('./views/AdminPools'))
const Vaults = lazy(() => import('./views/Vaults'))
const NfaStaking = lazy(() => import('./views/NfaStaking'))
const Bills = lazy(() => import('./views/Bills'))
const Orders = lazy(() => import('./views/Dex/Orders'))
const TermsOfUse = lazy(() => import('./views/LegalPages/TermsOfUse'))
const PrivacyPolicy = lazy(() => import('./views/LegalPages/PrivacyPolicy'))
const ProtocolDashboard = lazy(() => import('./views/ProtocolDashboard'))
const redirectSwap = () => import('./views/Dex/Swap/redirects')

const RedirectPathToSwapOnly = lazy(async () =>
  redirectSwap().then((r) => ({
    default: r.RedirectPathToSwapOnly,
  })),
)
const RedirectToSwap = lazy(async () =>
  redirectSwap().then((r) => ({
    default: r.RedirectToSwap,
  })),
)

const redirectAddLiquidity = () => import('./views/Dex/AddLiquidity/redirects')
const RedirectDuplicateTokenIds = lazy(async () =>
  redirectAddLiquidity().then((r) => ({
    default: r.RedirectDuplicateTokenIds,
  })),
)
const RedirectOldAddLiquidityPathStructure = lazy(async () =>
  redirectAddLiquidity().then((r) => ({
    default: r.RedirectOldAddLiquidityPathStructure,
  })),
)
const RedirectToAddLiquidity = lazy(async () =>
  redirectAddLiquidity().then((r) => ({
    default: r.RedirectToAddLiquidity,
  })),
)

// This config is required for number formating
BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
})

const App: React.FC = () => {
  usePollBlockNumber()
  useUpdateNetwork()
  useEagerConnect()
  useFetchBananaPrice()
  useFetchProfile()
  useFetchLiveIfoStatus()
  useFetchLiveTagsAndOrdering()
  // Hotfix for showModal. Update redux state and remove
  useCircularStaking()

  const { account, chainId } = useActiveWeb3React()
  const [showScrollIcon, setShowScrollIcon] = useState(false)

  const showScroll = useCallback(() => {
    if (window.location.pathname === '/') {
      setShowScrollIcon(false)
    } else if (
      window.location.pathname === '/banana-farms' ||
      window.location.pathname === '/pools' ||
      window.location.pathname === '/maximizers' ||
      window.location.pathname === '/iazos'
    ) {
      setShowScrollIcon(true)
    } else {
      setShowScrollIcon(false)
    }
  }, [])

  useEffect(() => {
    showScroll()
    if (account) dataLayer?.push({ event: 'wallet_connect', user_id: account })
  }, [account, showScroll])

  const loadMenu = () => {
    // ETH routes
    if (chainId === ChainId.MAINNET) {
      return (
        <Menu>
          <Suspense fallback={<PageLoader />}>
            <Switch>
              <Route path="/" exact component={Home} />
              <Route path="/terms">
                <TermsOfUse />
              </Route>
              <Route path="/privacy">
                <PrivacyPolicy />
              </Route>
              <Route path="/protocol-dashboard">
                <ProtocolDashboard />
              </Route>
              {/* Redirects */}
              <Route path="/admin-pools">
                <Redirect to="/" />
              </Route>
              <Route path="/banana-farms">
                <Redirect to="/" />
              </Route>
              <Route path="/maximizers">
                <Redirect to="/" />
              </Route>
              <Route path="/treasury-bills">
                <Redirect to="/" />
              </Route>
              <Route exact path="/nft">
                <Redirect to="/" />
              </Route>
              <Route path="/pools">
                <Redirect to="/" />
              </Route>
              <Route path="/jungle-farms">
                <Redirect to="/" />
              </Route>
              <Route path="/admin-pools">
                <Redirect to="/" />
              </Route>
              <Route path="/iao">
                <Redirect to="/" />
              </Route>
              <Route path="/auction">
                <Redirect to="/" />
              </Route>
              <Route exact path="/nft">
                <Redirect to="/" />
              </Route>
              <Route path="/nft/:id">
                <Redirect to="/" />
              </Route>
              <Route path="/gnana">
                <Redirect to="/" />
              </Route>
              <Route path="/stats">
                <Redirect to="/apestats" />
              </Route>
              <Route path="/apestats">
                <Stats />
              </Route>
              {/* SWAP ROUTES */}
              <Route path="/swap" component={Swap} />
              <Route exact strict path="/limit-orders" component={RedirectPathToSwapOnly} />
              <Route exact strict path="/swap/:outputCurrency" component={RedirectToSwap} />
              <Route exact strict path="/send" component={RedirectPathToSwapOnly} />
              <Route exact strict path="/find" component={PoolFinder} />
              <Route exact strict path="/liquidity" component={Pool} />
              <Route exact strict path="/create" component={RedirectToAddLiquidity} />
              <Route exact path="/add/:currencyIdA" component={RedirectOldAddLiquidityPathStructure} />
              <Route exact path="/add/:currencyIdA/:currencyIdB" component={RedirectDuplicateTokenIds} />{' '}
              <Route exact path="/add-liquidity" component={AddLiquidity} />
              <Route exact path="/add-liquidity/:currencyIdA" component={RedirectOldAddLiquidityPathStructure} />
              <Route exact path="/add-liquidity/:currencyIdA/:currencyIdB" component={RedirectDuplicateTokenIds} />
              <Route exact strict path="/remove/:currencyIdA/:currencyIdB" component={RemoveLiquidity} />
              <Route path="/zap">
                <Redirect to={'/add-liquidity'} />
              </Route>
              {/* SWAP ROUTES */}
              <Route component={NotFound} />
            </Switch>
          </Suspense>
        </Menu>
      )
    }

    // MATIC routes
    if (chainId === ChainId.MATIC || chainId === ChainId.MATIC_TESTNET) {
      return (
        <Menu>
          <Suspense fallback={<PageLoader />}>
            <Switch>
              <Route path="/" exact component={Home} />
              {/* <Home />
              </Route> */}
              <Route path="/admin-pools">
                <AdminPools />
              </Route>
              <Route path="/protocol-dashboard">
                <ProtocolDashboard />
              </Route>
              <Route path="/banana-farms">
                <DualFarms />
              </Route>
              <Route path="/apestats">
                <Stats />
              </Route>
              <Route path="/terms">
                <TermsOfUse />
              </Route>
              <Route path="/privacy">
                <PrivacyPolicy />
              </Route>
              {/* Redirects */}
              <Route path="/vaults">
                <Redirect to="/" />
              </Route>
              <Route path="/treasury-bills">
                <Bills />
              </Route>
              <Route exact path="/nft">
                <Redirect to="/" />
              </Route>
              <Route path="/pools">
                <Redirect to="/" />
              </Route>
              <Route path="/jungle-farms">
                <Redirect to="/" />
              </Route>
              <Route path="/admin-pools">
                <Redirect to="/" />
              </Route>
              <Route path="/iao">
                <Redirect to="/" />
              </Route>
              <Route path="/auction">
                <Redirect to="/" />
              </Route>
              <Route exact path="/nft">
                <Redirect to="/" />
              </Route>
              <Route path="/nft/:id">
                <Redirect to="/" />
              </Route>
              <Route path="/gnana">
                <Redirect to="/" />
              </Route>
              {/* SWAP ROUTES */}
              <Route path="/swap" component={Swap} />
              <Route exact strict path="/limit-orders" component={RedirectPathToSwapOnly} />
              <Route exact strict path="/swap/:outputCurrency" component={RedirectToSwap} />
              <Route exact strict path="/send" component={RedirectPathToSwapOnly} />
              <Route exact strict path="/find" component={PoolFinder} />
              <Route exact strict path="/liquidity" component={Pool} />
              <Route exact strict path="/create" component={RedirectToAddLiquidity} />
              <Route exact path="/add/:currencyIdA" component={RedirectOldAddLiquidityPathStructure} />
              <Route exact path="/add/:currencyIdA/:currencyIdB" component={RedirectDuplicateTokenIds} />
              <Route exact path="/add-liquidity" component={AddLiquidity} />
              <Route exact path="/add-liquidity/:currencyIdA" component={RedirectOldAddLiquidityPathStructure} />
              <Route exact path="/add-liquidity/:currencyIdA/:currencyIdB" component={RedirectDuplicateTokenIds} />
              <Route exact strict path="/remove/:currencyIdA/:currencyIdB" component={RemoveLiquidity} />
              <Route exact path="/zap" component={Zap} />
              <Route exact strict path="/zap/:currencyIdA" component={Zap} />
              <Route exact strict path="/zap/:currencyIdA/:currencyIdB/:currencyIdC" component={Zap} />
              {/* SWAP ROUTES */}
              <Route component={NotFound} />
            </Switch>
          </Suspense>
        </Menu>
      )
    }
    // Default BSC routes
    return (
      <Menu>
        <Suspense fallback={<PageLoader />}>
          <Switch>
            <Route exact path="/nft">
              <Nft />
            </Route>
            <Route exact path="/bab-raffle">
              <BabRaffle />
            </Route>
            <Route path="/" exact component={Home} />
            <Route path="/banana-farms">
              <Farms />
            </Route>
            <Route path="/pools">
              <Pools />
            </Route>
            <Route path="/protocol-dashboard">
              <ProtocolDashboard />
            </Route>
            <Route path="/jungle-farms">
              <JungleFarms />
            </Route>
            <Route path="/maximizers">
              <Vaults />
            </Route>
            <Route path="/treasury-bills">
              <Bills />
            </Route>
            <Route path="/admin-pools">
              <AdminPools />
            </Route>
            <Route path="/iao">
              <Ifos />
            </Route>
            <Route path="/auction">
              <Auction />
            </Route>
            <Route exact path="/nft">
              <Nft />
            </Route>
            <Route path="/nft/:id">
              <Nfa />
            </Route>
            <Route path="/staking">
              <NfaStaking />
            </Route>
            <Route path="/gnana">
              <ApeZone />
            </Route>
            <Route path="/apestats">
              <Stats />
            </Route>
            <Route path="/burn">
              <BurningGames />
            </Route>
            <Route path="/spinner">
              <PageLoader />
            </Route>
            <Route path="/terms">
              <TermsOfUse />
            </Route>
            <Route path="/privacy">
              <PrivacyPolicy />
            </Route>
            {/* Redirect */}
            <Route path="/staking">
              <Redirect to="/pools" />
            </Route>
            <Route path="/syrup">
              <Redirect to="/pools" />
            </Route>
            {/* SWAP ROUTES */}
            <Route path="/swap" component={Swap} />
            <Route exact strict path="/limit-orders" component={Orders} />
            <Route exact strict path="/swap/:outputCurrency" component={RedirectToSwap} />
            <Route exact strict path="/send" component={RedirectPathToSwapOnly} />
            <Route exact strict path="/find" component={PoolFinder} />
            <Route exact strict path="/liquidity" component={Pool} />
            <Route exact strict path="/create" component={RedirectToAddLiquidity} />
            <Route exact path="/add/:currencyIdA" component={RedirectOldAddLiquidityPathStructure} />
            <Route exact path="/add/:currencyIdA/:currencyIdB" component={RedirectDuplicateTokenIds} />
            <Route exact path="/add-liquidity" component={AddLiquidity} />
            <Route exact path="/add-liquidity/:currencyIdA" component={RedirectOldAddLiquidityPathStructure} />
            <Route exact path="/add-liquidity/:currencyIdA/:currencyIdB" component={RedirectDuplicateTokenIds} />
            <Route exact strict path="/remove/:currencyIdA/:currencyIdB" component={RemoveLiquidity} />
            <Route exact path="/zap" component={Zap} />
            <Route exact strict path="/zap/:currencyIdA" component={Zap} />
            <Route exact strict path="/zap/:currencyIdA/:currencyIdB/:currencyIdC" component={Zap} />
            {/* SWAP ROUTES */}
            <Route component={NotFound} />
          </Switch>
        </Suspense>
      </Menu>
    )
  }

  return (
    <Router>
      <PageMeta />
      <ResetScroll />
      <ResetCSS />
      <GlobalStyle />
      <MarketingModalCheck />
      {showScrollIcon && <ScrollToTop />}
      {loadMenu()}
      <ToastListener />
    </Router>
  )
}

export default React.memo(App)
