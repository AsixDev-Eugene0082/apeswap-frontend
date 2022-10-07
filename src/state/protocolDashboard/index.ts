/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'
import { ProtocolDashboardState } from './types'
import getTreasuryBreakdown, {
  getOverviewBananaDistribution,
  getOverviewMcapTvlRatio,
  getOverviewProtocolMetrics,
  getOverviewTvl,
  getOverviewVolume,
  getTreasuryAssetOverview,
  getTreasuryHistory,
} from './api'

const initialState: ProtocolDashboardState = {
  overviewTvl: null,
  overviewVolume: [],
  overviewProtocolMetrics: [],
  overviewBananaDistribution: [],
  overviewMcapTvlRatio: [],
  treasuryAssetOverview: [],
  treasuryHistory: [],
  treasuryBreakdown: null,
}

export const statsSlice = createSlice({
  name: 'protocol-dashboard',
  initialState,
  reducers: {
    setOverviewTvl: (state, action) => {
      state.overviewTvl = action.payload
    },
    setOverviewVolume: (state, action) => {
      state.overviewVolume = action.payload
    },
    setOverviewProtocolMetrics: (state, action) => {
      state.overviewProtocolMetrics = action.payload
    },
    setOverviewBananaDistribution: (state, action) => {
      state.overviewBananaDistribution = action.payload
    },
    setOverviewMcapTvlRatio: (state, action) => {
      state.overviewMcapTvlRatio = action.payload
    },
    setTreasuryAssetOverview: (state, action) => {
      state.treasuryAssetOverview = action.payload
    },
    setTreasuryHistory: (state, action) => {
      state.treasuryHistory = action.payload
    },
    setTreasuryBreakdown: (state, action) => {
      state.treasuryBreakdown = action.payload
    },
  },
})

// Actions
export const {
  setOverviewTvl,
  setOverviewVolume,
  setOverviewProtocolMetrics,
  setOverviewBananaDistribution,
  setOverviewMcapTvlRatio,
  setTreasuryAssetOverview,
  setTreasuryHistory,
  setTreasuryBreakdown,
} = statsSlice.actions

// Thunks

export const fetchOverviewTvl = () => async (dispatch) => {
  const data = await getOverviewTvl()
  dispatch(setOverviewTvl(data))
}

export const fetchOverviewVolume = () => async (dispatch) => {
  const data = await getOverviewVolume()
  dispatch(setOverviewVolume(data))
}

export const fetchOverviewProtocolMetrics = () => async (dispatch) => {
  const data = await getOverviewProtocolMetrics()
  dispatch(setOverviewProtocolMetrics(data))
}

export const fetchOverviewBananaDistribution = () => async (dispatch) => {
  const data = await getOverviewBananaDistribution()
  dispatch(setOverviewBananaDistribution(data))
}

export const fetchOverviewMcapTvlRatio = () => async (dispatch) => {
  const data = await getOverviewMcapTvlRatio()
  dispatch(setOverviewMcapTvlRatio(data))
}

export const fetchTreasuryAssetOverview = () => async (dispatch) => {
  const data = await getTreasuryAssetOverview()
  dispatch(setTreasuryAssetOverview(data))
}

export const fetchTreasuryHistory = () => async (dispatch) => {
  const data = await getTreasuryHistory()
  dispatch(setTreasuryHistory(data))
}

export const fetchTreasuryBreakdown = () => async (dispatch) => {
  const data = await getTreasuryBreakdown()
  dispatch(setTreasuryBreakdown(data))
}

export default statsSlice.reducer
