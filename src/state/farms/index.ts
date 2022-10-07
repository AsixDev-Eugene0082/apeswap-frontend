import { createSlice } from '@reduxjs/toolkit'
import BigNumber from 'bignumber.js'
import {
  fetchFarmUserEarnings,
  fetchFarmUserAllowances,
  fetchFarmUserTokenBalances,
  fetchFarmUserStakedBalances,
} from './fetchFarmUser'
import { FarmsState, Farm, LpTokenPrices, FarmLpAprsType, AppThunk } from '../types'
import fetchFarms from './fetchFarms'
import fetchFarmConfig from './api'

const initialState: FarmsState = {
  data: [],
}

export const farmsSlice = createSlice({
  name: 'Farms',
  initialState,
  reducers: {
    setInitialFarmData: (state, action) => {
      state.data = action.payload
    },
    setFarmsPublicData: (state, action) => {
      const liveFarmsData: Farm[] = action.payload
      state.data = state.data.map((farm) => {
        const liveFarmData = liveFarmsData.find((f) => f.pid === farm.pid)
        return { ...farm, ...liveFarmData }
      })
    },
    setFarmUserData: (state, action) => {
      const { arrayOfUserDataObjects } = action.payload
      arrayOfUserDataObjects.forEach((userDataEl) => {
        const { index } = userDataEl
        state.data[index] = { ...state.data[index], userData: userDataEl }
      })
    },
    updateFarmUserData: (state, action) => {
      const { field, value, pid } = action.payload
      const index = state.data.findIndex((p) => p.pid === pid)
      state.data[index] = { ...state.data[index], userData: { ...state.data[index].userData, [field]: value } }
    },
  },
})

// Actions
export const { setInitialFarmData, setFarmsPublicData, setFarmUserData, updateFarmUserData } = farmsSlice.actions

// Thunks
export const fetchFarmsPublicDataAsync =
  (chainId: number, lpPrices: LpTokenPrices[], bananaPrice: BigNumber, farmLpAprs: FarmLpAprsType): AppThunk =>
  async (dispatch, getState) => {
    try {
      const farmsConfig = getState().farms.data
      const farms = await fetchFarms(chainId, lpPrices, bananaPrice, farmLpAprs, farmsConfig)
      dispatch(setFarmsPublicData(farms))
    } catch (error) {
      console.warn(error)
    }
  }
export const fetchFarmUserDataAsync =
  (chainId: number, account: string): AppThunk =>
  async (dispatch, getState) => {
    try {
      const farms = getState().farms.data
      const userFarmAllowances = await fetchFarmUserAllowances(chainId, account, farms)
      const userFarmTokenBalances = await fetchFarmUserTokenBalances(chainId, account, farms)
      const userStakedBalances = await fetchFarmUserStakedBalances(chainId, account, farms)
      const userFarmEarnings = await fetchFarmUserEarnings(chainId, account, farms)

      const arrayOfUserDataObjects = userFarmAllowances.map((_, index) => {
        return {
          index,
          allowance: userFarmAllowances[index],
          tokenBalance: userFarmTokenBalances[index],
          stakedBalance: userStakedBalances[index],
          earnings: userFarmEarnings[index],
        }
      })
      dispatch(setFarmUserData({ arrayOfUserDataObjects }))
    } catch (error) {
      console.warn(error)
    }
  }

export const setInitialFarmDataAsync = (): AppThunk => async (dispatch) => {
  try {
    const initialFarmState: Farm[] = await fetchFarmConfig()
    dispatch(setInitialFarmData(initialFarmState || []))
  } catch (error) {
    console.error(error)
  }
}

export const updateFarmUserAllowances =
  (chainId: number, pid, account: string): AppThunk =>
  async (dispatch, getState) => {
    const farms = getState().farms.data
    const allowances = await fetchFarmUserAllowances(chainId, account, farms)
    dispatch(updateFarmUserData({ pid, field: 'allowance', value: allowances[pid] }))
  }

export const updateFarmUserTokenBalances =
  (chainId: number, pid, account: string): AppThunk =>
  async (dispatch, getState) => {
    const farms = getState().farms.data
    const tokenBalances = await fetchFarmUserTokenBalances(chainId, account, farms)
    dispatch(updateFarmUserData({ pid, field: 'tokenBalance', value: tokenBalances[pid] }))
  }

export const updateFarmUserStakedBalances =
  (chainId: number, pid, account: string): AppThunk =>
  async (dispatch, getState) => {
    const farms = getState().farms.data
    const stakedBalances = await fetchFarmUserStakedBalances(chainId, account, farms)
    dispatch(updateFarmUserData({ pid, field: 'stakedBalance', value: stakedBalances[pid] }))
  }

export const updateFarmUserEarnings =
  (chainId: number, pid, account: string): AppThunk =>
  async (dispatch, getState) => {
    const farms = getState().farms.data
    const pendingRewards = await fetchFarmUserEarnings(chainId, account, farms)
    dispatch(updateFarmUserData({ pid, field: 'earnings', value: pendingRewards[pid] }))
  }

export default farmsSlice.reducer
