import { createSlice } from '@reduxjs/toolkit'
import {
  fetchJungleFarmsAllowance,
  fetchUserBalances,
  fetchUserStakeBalances,
  fetchUserPendingRewards,
} from './fetchJungleFarmUser'
import { JungleFarmsState, JungleFarm, TokenPrices, AppThunk } from '../types'
import fetchJungleFarms from './fetchJungleFarms'
import fetchJungleFarmConfig from './api'

const initialState: JungleFarmsState = { data: [] }

export const JungleFarmsSlice = createSlice({
  name: 'JungleFarms',
  initialState,
  reducers: {
    setInitialJungleFarmData: (state, action) => {
      state.data = action.payload
    },
    setJungleFarmsPublicData: (state, action) => {
      const liveJungleFarmsData: JungleFarm[] = action.payload
      state.data = state.data.map((farm) => {
        const liveFarmData = liveJungleFarmsData.find((entry) => entry.jungleId === farm.jungleId)
        return { ...farm, ...liveFarmData }
      })
    },
    setJungleFarmsUserData: (state, action) => {
      const userData = action.payload
      state.data = state.data.map((farm) => {
        const userFarmData = userData.find((entry) => entry.jungleId === farm.jungleId)
        return { ...farm, userData: userFarmData }
      })
    },
    updateJungleFarmsUserData: (state, action) => {
      const { field, value, jungleId } = action.payload
      const index = state.data.findIndex((p) => p.jungleId === jungleId)
      state.data[index] = { ...state.data[index], userData: { ...state.data[index].userData, [field]: value } }
    },
  },
})

// Actions
export const { setInitialJungleFarmData, setJungleFarmsPublicData, setJungleFarmsUserData, updateJungleFarmsUserData } =
  JungleFarmsSlice.actions

// Thunks

export const setInitialJungleFarmDataAsync = () => async (dispatch) => {
  try {
    const initialJungleFarmState: JungleFarm[] = await fetchJungleFarmConfig()
    dispatch(setInitialJungleFarmData(initialJungleFarmState || []))
  } catch (error) {
    console.error(error)
  }
}

export const fetchJungleFarmsPublicDataAsync =
  (chainId: number, tokenPrices: TokenPrices[]): AppThunk =>
  async (dispatch, getState) => {
    try {
      const jungleFarms = getState().jungleFarms.data
      const farms = await fetchJungleFarms(chainId, tokenPrices, jungleFarms)
      dispatch(setJungleFarmsPublicData(farms))
    } catch (error) {
      console.warn(error)
    }
  }

export const fetchJungleFarmsUserDataAsync =
  (chainId: number, account): AppThunk =>
  async (dispatch, getState) => {
    try {
      const jungleFarms = getState().jungleFarms.data
      const allowances = await fetchJungleFarmsAllowance(chainId, account, jungleFarms)
      const stakingTokenBalances = await fetchUserBalances(chainId, account, jungleFarms)
      const stakedBalances = await fetchUserStakeBalances(chainId, account, jungleFarms)
      const pendingRewards = await fetchUserPendingRewards(chainId, account, jungleFarms)
      const userData = jungleFarms.map((farm) => ({
        jungleId: farm.jungleId,
        allowance: allowances[farm.jungleId],
        stakingTokenBalance: stakingTokenBalances[farm.jungleId],
        stakedBalance: stakedBalances[farm.jungleId],
        pendingReward: pendingRewards[farm.jungleId],
      }))
      dispatch(setJungleFarmsUserData(userData))
    } catch (error) {
      console.warn(error)
    }
  }

export const updateJungleFarmsUserAllowance =
  (chainId: number, jungleId: number, account: string): AppThunk =>
  async (dispatch, getState) => {
    const jungleFarms = getState().jungleFarms.data
    const allowances = await fetchJungleFarmsAllowance(chainId, account, jungleFarms)
    dispatch(updateJungleFarmsUserData({ jungleId, field: 'allowance', value: allowances[jungleId] }))
  }

export const updateJungleFarmsUserBalance =
  (chainId: number, jungleId: number, account: string): AppThunk =>
  async (dispatch, getState) => {
    const jungleFarms = getState().jungleFarms.data
    const tokenBalances = await fetchUserBalances(chainId, account, jungleFarms)
    dispatch(updateJungleFarmsUserData({ jungleId, field: 'stakingTokenBalance', value: tokenBalances[jungleId] }))
  }

export const updateJungleFarmsUserStakedBalance =
  (chainId: number, jungleId: number, account: string): AppThunk =>
  async (dispatch, getState) => {
    const jungleFarms = getState().jungleFarms.data
    const stakedBalances = await fetchUserStakeBalances(chainId, account, jungleFarms)
    dispatch(updateJungleFarmsUserData({ jungleId, field: 'stakedBalance', value: stakedBalances[jungleId] }))
  }

export const updateJungleFarmsUserPendingReward =
  (chainId: number, jungleId: number, account: string): AppThunk =>
  async (dispatch, getState) => {
    const jungleFarms = getState().jungleFarms.data
    const pendingRewards = await fetchUserPendingRewards(chainId, account, jungleFarms)
    dispatch(updateJungleFarmsUserData({ jungleId, field: 'pendingReward', value: pendingRewards[jungleId] }))
  }

export default JungleFarmsSlice.reducer
