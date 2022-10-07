/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'
import {
  fetchVaultUserAllowances,
  fetchVaultUserStakedAndPendingBalances,
  fetchVaultUserTokenBalances,
} from './fetchVaultsUser'
import { VaultsState, TokenPrices, Vault, FarmLpAprsType, AppThunk } from '../types'
import fetchVaults from './fetchVaults'
import fetchVaultConfig from './api'

const initialState: VaultsState = { data: [], loadVaultData: false, userDataLoaded: false }

export const vaultSlice = createSlice({
  name: 'Vaults',
  initialState,
  reducers: {
    setInitialVaultData: (state, action) => {
      state.data = action.payload
    },
    setLoadVaultData: (state, action) => {
      const liveVaultsData: Vault[] = action.payload
      state.data = state.data.map((vault) => {
        const liveVaultData = liveVaultsData.find((entry) => entry.id === vault.id)
        return { ...vault, ...liveVaultData }
      })
    },
    setVaultUserData: (state, action) => {
      const userData = action.payload
      state.data = state.data.map((vault) => {
        const userVaultData = userData.find((entry) => entry.id === vault.id)
        return { ...vault, userData: userVaultData }
      })
    },
    updateVaultsUserData: (state, action) => {
      const { field, value, id } = action.payload
      const index = state.data.findIndex((v) => v.id === id)
      state.data[index] = { ...state.data[index], userData: { ...state.data[index].userData, [field]: value } }
    },

    setVaultsLoad: (state, action) => {
      state.loadVaultData = action.payload
    },
  },
})

// thunks

export const setInitialVaultDataAsync = (chainId: number) => async (dispatch) => {
  try {
    const initialVaultState: Vault[] = await fetchVaultConfig()
    const filteredVaults = initialVaultState?.filter((vault) => vault.availableChains.includes(chainId))
    dispatch(setInitialVaultData(filteredVaults || []))
  } catch (error) {
    console.error(error)
  }
}

export const fetchVaultsPublicDataAsync =
  (chainId: number, tokenPrices: TokenPrices[], farmLpAprs: FarmLpAprsType): AppThunk =>
  async (dispatch, getState) => {
    try {
      const vaultsConfig = getState().vaults.data
      const vaults = await fetchVaults(chainId, tokenPrices, farmLpAprs, vaultsConfig)
      dispatch(setLoadVaultData(vaults))
    } catch (error) {
      console.warn(error)
    }
  }

export const fetchVaultUserDataAsync =
  (account: string, chainId: number): AppThunk =>
  async (dispatch, getState) => {
    try {
      const vaults = getState().vaults.data
      const filteredVaults = vaults.filter((vault) => vault.availableChains.includes(chainId))
      const userVaultAllowances = await fetchVaultUserAllowances(account, chainId, vaults)
      const userVaultTokenBalances = await fetchVaultUserTokenBalances(account, chainId, vaults)
      const userVaultBalances = await fetchVaultUserStakedAndPendingBalances(account, chainId, vaults)
      const userData = filteredVaults.map((vault, index) => {
        return {
          id: vault.id,
          allowance: userVaultAllowances[index],
          tokenBalance: userVaultTokenBalances[index],
          stakedBalance: userVaultBalances.stakedBalances[index],
          pendingRewards: userVaultBalances.pendingRewards[index],
        }
      })
      dispatch(setVaultUserData(userData))
    } catch (error) {
      console.warn(error)
    }
  }

export const updateVaultUserAllowance =
  (account: string, chainId: number, id: number): AppThunk =>
  async (dispatch, getState) => {
    const vaults = getState().vaults.data
    const allowances = await fetchVaultUserAllowances(account, chainId, vaults)
    const filteredVaults = vaults.filter((vault) => vault.availableChains.includes(chainId))
    const index = filteredVaults.findIndex((v) => v.pid === id)
    dispatch(updateVaultsUserData({ id, field: 'allowance', value: allowances[index] }))
  }

export const updateVaultUserBalance =
  (account: string, chainId: number, id: number): AppThunk =>
  async (dispatch, getState) => {
    const vaults = getState().vaults.data
    const tokenBalances = await fetchVaultUserTokenBalances(account, chainId, vaults)
    const filteredVaults = vaults.filter((vault) => vault.availableChains.includes(chainId))
    const index = filteredVaults.findIndex((v) => v.id === id)
    dispatch(updateVaultsUserData({ id, field: 'tokenBalance', value: tokenBalances[index] }))
  }

export const updateVaultUserStakedBalance =
  (account: string, chainId: number, id: number): AppThunk =>
  async (dispatch, getState) => {
    const vaults = getState().vaults.data
    const stakedBalances = await fetchVaultUserStakedAndPendingBalances(account, chainId, vaults)
    const filteredVaults = vaults.filter((vault) => vault.availableChains.includes(chainId))
    const index = filteredVaults.findIndex((v) => v.id === id)
    dispatch(updateVaultsUserData({ id, field: 'stakedBalance', value: stakedBalances.stakedBalances[index] }))
  }

// Actions
export const { setInitialVaultData, setLoadVaultData, setVaultUserData, setVaultsLoad, updateVaultsUserData } =
  vaultSlice.actions

export default vaultSlice.reducer
