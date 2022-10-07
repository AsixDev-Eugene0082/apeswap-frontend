/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'
import { fetchPoolsBlockLimits, fetchPoolsTotalStatking, fetchPoolTokenStatsAndApr } from './fetchNfaStakingPools'
import {
  fetchPoolsAllowance,
  fetchUserBalances,
  fetchUserStakeBalances,
  fetchUserPendingRewards,
  fetchUserStakedNfas,
} from './fetchNfaStakingPoolsUser'
import { NfaStakingPool, TokenPrices, NfaStakingPoolsState, AppThunk } from '../types'
import fetchNfaStakingConfig from './api'

const initialState: NfaStakingPoolsState = { data: [] }

export const NfaStakingPoolsSlice = createSlice({
  name: 'NfaStakingPools',
  initialState,
  reducers: {
    setInitialNfaStakingData: (state, action) => {
      state.data = action.payload
    },
    setNfaStakingPoolsPublicData: (state, action) => {
      const liveNfaStakingPoolsData: NfaStakingPool[] = action.payload
      state.data = state.data.map((nfaStakingPool) => {
        const liveNfaStakingPoolData = liveNfaStakingPoolsData.find((entry) => entry.sousId === nfaStakingPool.sousId)
        return { ...nfaStakingPool, ...liveNfaStakingPoolData }
      })
    },
    setNfaStakingPoolsUserData: (state, action) => {
      const userData = action.payload
      state.data = state.data.map((nfaStakingPool) => {
        const userPoolData = userData.find((entry) => entry.sousId === nfaStakingPool.sousId)
        return { ...nfaStakingPool, userData: userPoolData }
      })
    },
    updateNfaStakingPoolsUserData: (state, action) => {
      const { field, value, sousId } = action.payload
      const index = state.data.findIndex((p) => p.sousId === sousId)
      state.data[index] = { ...state.data[index], userData: { ...state.data[index].userData, [field]: value } }
    },
  },
})

// Actions
export const {
  setInitialNfaStakingData,
  setNfaStakingPoolsPublicData,
  setNfaStakingPoolsUserData,
  updateNfaStakingPoolsUserData,
} = NfaStakingPoolsSlice.actions

// Thunks

export const setInitialNfaStakingDataAsync = () => async (dispatch) => {
  try {
    const initialNfaStakingState: NfaStakingPool[] = await fetchNfaStakingConfig()
    dispatch(setInitialNfaStakingData(initialNfaStakingState || []))
  } catch (error) {
    console.error(error)
  }
}

export const fetchNfaStakingPoolsPublicDataAsync =
  (chainId: number, tokenPrices: TokenPrices[]): AppThunk =>
  async (dispatch, getState) => {
    const nfaStakingPools = getState().nfaStakingPools.data
    const blockLimits = await fetchPoolsBlockLimits(nfaStakingPools)
    const totalStakings = await fetchPoolsTotalStatking(chainId, nfaStakingPools)
    const tokenStatsAndAprs = await fetchPoolTokenStatsAndApr(tokenPrices, totalStakings, nfaStakingPools)
    const liveData = await Promise.all(
      nfaStakingPools.map(async (nfaStakingPool) => {
        const blockLimit = blockLimits.find((entry) => entry.sousId === nfaStakingPool.sousId)
        const totalStaking = totalStakings.find((entry) => entry.sousId === nfaStakingPool.sousId)
        const tokenStatsAndApr = tokenStatsAndAprs.find((entry) => entry.sousId === nfaStakingPool.sousId)
        return {
          ...blockLimit,
          ...totalStaking,
          ...tokenStatsAndApr,
        }
      }),
    )
    dispatch(setNfaStakingPoolsPublicData(liveData))
  }

export const fetchNfaStakingPoolsUserDataAsync =
  (chainId, account): AppThunk =>
  async (dispatch, getState) => {
    const nfaStakingPools = getState().nfaStakingPools.data
    const allowances = await fetchPoolsAllowance(chainId, account, nfaStakingPools)
    const stakingTokenBalances = await fetchUserBalances(chainId, account, nfaStakingPools)
    const stakedBalances = await fetchUserStakeBalances(chainId, account, nfaStakingPools)
    const pendingRewards = await fetchUserPendingRewards(chainId, account, nfaStakingPools)
    const stakedNfas = await fetchUserStakedNfas(chainId, account, nfaStakingPools)

    const userData = nfaStakingPools.map((nfaStakingPool) => ({
      sousId: nfaStakingPool.sousId,
      allowance: allowances[nfaStakingPool.sousId],
      stakingTokenBalance: stakingTokenBalances[nfaStakingPool.sousId],
      stakedBalance: stakedBalances[nfaStakingPool.sousId],
      pendingReward: pendingRewards[nfaStakingPool.sousId],
      stakedNfas: stakedNfas[nfaStakingPool.sousId],
    }))
    dispatch(setNfaStakingPoolsUserData(userData))
  }

export const updateNfaStakingUserAllowance =
  (chainId: number, sousId: string, account: string): AppThunk =>
  async (dispatch, getState) => {
    const nfaStakingPools = getState().nfaStakingPools.data
    const allowances = await fetchPoolsAllowance(chainId, account, nfaStakingPools)
    dispatch(updateNfaStakingPoolsUserData({ sousId, field: 'allowance', value: allowances[sousId] }))
  }

export const updateNfaStakingUserBalance =
  (chainId: number, sousId: string, account: string): AppThunk =>
  async (dispatch, getState) => {
    const nfaStakingPools = getState().nfaStakingPools.data
    const tokenBalances = await fetchUserBalances(chainId, account, nfaStakingPools)
    dispatch(updateNfaStakingPoolsUserData({ sousId, field: 'stakingTokenBalance', value: tokenBalances[sousId] }))
  }

export const updateUserNfaStakingStakedBalance =
  (chainId: number, sousId: string, account: string): AppThunk =>
  async (dispatch, getState) => {
    const nfaStakingPools = getState().nfaStakingPools.data
    const stakedBalances = await fetchUserStakeBalances(chainId, account, nfaStakingPools)
    dispatch(updateNfaStakingPoolsUserData({ sousId, field: 'stakedBalance', value: stakedBalances[sousId] }))
  }

export const updateUserNfaStakingPendingReward =
  (chainId: number, sousId: string, account: string): AppThunk =>
  async (dispatch, getState) => {
    const nfaStakingPools = getState().nfaStakingPools.data
    const pendingRewards = await await fetchUserStakedNfas(chainId, account, nfaStakingPools)
    dispatch(updateNfaStakingPoolsUserData({ sousId, field: 'pendingReward', value: pendingRewards[sousId] }))
  }

export default NfaStakingPoolsSlice.reducer
