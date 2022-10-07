import { createSlice } from '@reduxjs/toolkit'
import BigNumber from 'bignumber.js'
import fetchDualFarms from './fetchDualFarms'
import {
  fetchDualMiniChefEarnings,
  fetchDualFarmUserAllowances,
  fetchDualFarmUserTokenBalances,
  fetchDualFarmUserStakedBalances,
  fetchDualFarmRewarderEarnings,
} from './fetchDualFarmUser'
import { TokenPrices, DualFarm, DualFarmsState, FarmLpAprsType, AppThunk } from '../types'
import fetchDualFarmConfig from './api'

const initialState: DualFarmsState = { data: [] }

export const dualFarmsSlice = createSlice({
  name: 'dualFarms',
  initialState,
  reducers: {
    setInitialDualFarmData: (state, action) => {
      state.data = action.payload
    },
    setDualFarmsPublicData: (state, action) => {
      const liveFarmsData: DualFarm[] = action.payload
      state.data = state.data.map((farm) => {
        const liveFarmData = liveFarmsData.find((f) => f.pid === farm.pid)
        return { ...farm, ...liveFarmData }
      })
    },
    setDualFarmUserData: (state, action) => {
      const userData = action.payload
      state.data = state.data.map((dualFarm) => {
        const userDualFarmData = userData.find((entry) => entry.pid === dualFarm.pid)
        return { ...dualFarm, userData: userDualFarmData }
      })
    },
    updateDualFarmUserData: (state, action) => {
      const { field, value, pid } = action.payload
      const index = state.data.findIndex((p) => p.pid === pid)
      state.data[index] = { ...state.data[index], userData: { ...state.data[index].userData, [field]: value } }
    },
  },
})

// Actions
export const { setInitialDualFarmData, setDualFarmsPublicData, setDualFarmUserData, updateDualFarmUserData } =
  dualFarmsSlice.actions

// Thunks

export const setInitialDualFarmDataAsync = () => async (dispatch) => {
  try {
    const initialDualFarmState: DualFarm[] = await fetchDualFarmConfig()
    dispatch(setInitialDualFarmData(initialDualFarmState || []))
  } catch (error) {
    console.error(error)
  }
}

export const fetchDualFarmsPublicDataAsync =
  (chainId: number, tokenPrices: TokenPrices[], bananaPrice: BigNumber, farmLpAprs: FarmLpAprsType): AppThunk =>
  async (dispatch, getState) => {
    try {
      const dualFarms = getState().dualFarms.data
      const farms = await fetchDualFarms(chainId, tokenPrices, bananaPrice, farmLpAprs, dualFarms)
      dispatch(setDualFarmsPublicData(farms))
    } catch (error) {
      console.warn(error)
    }
  }
export const fetchDualFarmUserDataAsync =
  (chainId: number, account: string): AppThunk =>
  async (dispatch, getState) => {
    try {
      const dualFarms = getState().dualFarms.data
      const userFarmAllowances = await fetchDualFarmUserAllowances(chainId, account, dualFarms)
      const userFarmTokenBalances = await fetchDualFarmUserTokenBalances(chainId, account, dualFarms)
      const userStakedBalances = await fetchDualFarmUserStakedBalances(chainId, account, dualFarms)
      const miniChefEarnings = await fetchDualMiniChefEarnings(chainId, account, dualFarms)
      const rewarderEarnings = await fetchDualFarmRewarderEarnings(chainId, account, dualFarms)
      const arrayOfUserDataObjects = dualFarms.map((dualFarm) => {
        return {
          pid: dualFarm.pid,
          allowance: userFarmAllowances.find((item) => item.pid === dualFarm.pid).value,
          tokenBalance: userFarmTokenBalances.find((item) => item.pid === dualFarm.pid).value,
          stakedBalance: userStakedBalances.find((item) => item.pid === dualFarm.pid).value,
          miniChefEarnings: miniChefEarnings.find((item) => item.pid === dualFarm.pid).value,
          rewarderEarnings: rewarderEarnings.find((item) => item.pid === dualFarm.pid).value,
        }
      })
      dispatch(setDualFarmUserData(arrayOfUserDataObjects))
    } catch (error) {
      console.warn(error)
    }
  }

export const updateDualFarmUserAllowances =
  (chainId: number, pid, account: string): AppThunk =>
  async (dispatch, getState) => {
    const dualFarms = getState().dualFarms.data
    const allowances = await fetchDualFarmUserAllowances(chainId, account, dualFarms)
    const pidIndex = dualFarms.findIndex((f) => f.pid === pid)
    dispatch(updateDualFarmUserData({ pid, field: 'allowance', value: allowances[pidIndex].value }))
  }

export const updateDualFarmUserTokenBalances =
  (chainId: number, pid, account: string): AppThunk =>
  async (dispatch, getState) => {
    const dualFarms = getState().dualFarms.data
    const tokenBalances = await fetchDualFarmUserTokenBalances(chainId, account, dualFarms)
    const pidIndex = dualFarms.findIndex((f) => f.pid === pid)
    dispatch(updateDualFarmUserData({ pid, field: 'tokenBalance', value: tokenBalances[pidIndex].value }))
  }

export const updateDualFarmUserStakedBalances =
  (chainId: number, pid, account: string): AppThunk =>
  async (dispatch, getState) => {
    const dualFarms = getState().dualFarms.data
    const stakedBalances = await fetchDualFarmUserStakedBalances(chainId, account, dualFarms)
    const pidIndex = dualFarms.findIndex((f) => f.pid === pid)
    dispatch(updateDualFarmUserData({ pid, field: 'stakedBalance', value: stakedBalances[pidIndex].value }))
  }

export const updateDualFarmUserEarnings =
  (chainId: number, pid, account: string): AppThunk =>
  async (dispatch, getState) => {
    const dualFarms = getState().dualFarms.data
    const pendingRewards = await fetchDualMiniChefEarnings(chainId, account, dualFarms)
    const pidIndex = dualFarms.findIndex((f) => f.pid === pid)
    dispatch(updateDualFarmUserData({ pid, field: 'miniChefEarnings', value: pendingRewards[pidIndex].value }))
  }

export const updateDualFarmRewarderEarnings =
  (chainId: number, pid, account: string): AppThunk =>
  async (dispatch, getState) => {
    const dualFarms = getState().dualFarms.data
    const rewarderEarnings = await fetchDualFarmRewarderEarnings(chainId, account, dualFarms)
    const pidIndex = dualFarms.findIndex((f) => f.pid === pid)
    dispatch(updateDualFarmUserData({ pid, field: 'rewarderEarnings', value: rewarderEarnings[pidIndex].value }))
  }

export default dualFarmsSlice.reducer
