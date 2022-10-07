import { combineReducers } from '@reduxjs/toolkit'
import multicall from 'lib/state/multicall'
import farmsReducer from './farms'
import toastsReducer from './toasts'
import poolsReducer from './pools'
import profileReducer from './profile'
import statsReducer from './stats'
import statsOverallReducer from './statsOverall'
import auctionReducer from './auction'
import vaultReducer from './vaults'
import tokenPricesReducer from './tokenPrices'
import iazosReducer from './iazos'
import networkReducer from './network'
import nfaStakingPoolsReducer from './nfaStakingPools'
import dualFarmsReducer from './dualFarms'
import jungleFarmsReducer from './jungleFarms'
import blockReducer from './block'
import billsReducer from './bills'
import swap from './swap/reducer'
import orders from './orders/reducer'
import user from './user/reducer'
import lists from './lists/reducer'
import transactions from './transactions/reducer'
import burn from './burn/reducer'
import mint from './mint/reducer'
import lpPricesReducer from './lpPrices'
import nfasReducer from './nfas'
import zap from './zap/reducer'
import protocolDashboardReducer from './protocolDashboard'

const reducer = combineReducers({
  farms: farmsReducer,
  block: blockReducer,
  toasts: toastsReducer,
  pools: poolsReducer,
  profile: profileReducer,
  stats: statsReducer,
  statsOverall: statsOverallReducer,
  auctions: auctionReducer,
  vaults: vaultReducer,
  tokenPrices: tokenPricesReducer,
  lpTokenPrices: lpPricesReducer,
  iazos: iazosReducer,
  network: networkReducer,
  nfaStakingPools: nfaStakingPoolsReducer,
  dualFarms: dualFarmsReducer,
  jungleFarms: jungleFarmsReducer,
  bills: billsReducer,
  nfas: nfasReducer,
  protocolDashboard: protocolDashboardReducer,
  multicall: multicall.reducer,
  swap,
  user,
  lists,
  transactions,
  burn,
  mint,
  orders,
  zap,
})

export default reducer
