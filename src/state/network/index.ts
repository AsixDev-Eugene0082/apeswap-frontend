/* eslint-disable no-param-reassign */
import { ChainId } from '@ape.swap/sdk'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { NETWORK_LABEL } from 'config/constants/chains'
import { Network, NetworkState } from 'state/types'
import fetchAndUpdateNetwork from './fetchNetwork'

const chainIdSafeCheck = (): { chainId: number; chainIdFromUrl: boolean } => {
  const { search } = window.location
  const params = new URLSearchParams(search)
  const chainStr = params.get('chain')
  const removeChainParamUrl = window.location.href.split('?chain')[0]
  window.history.pushState({}, document.title, removeChainParamUrl)
  const localStorageChain = parseInt(window.localStorage.getItem('chainIdStatus'))
  if (chainStr) {
    if (chainStr.toLowerCase() === NETWORK_LABEL[ChainId.BSC].toLowerCase()) {
      return { chainId: ChainId.BSC, chainIdFromUrl: true }
    }
    if (chainStr.toLowerCase() === NETWORK_LABEL[ChainId.MATIC].toLowerCase()) {
      return { chainId: ChainId.MATIC, chainIdFromUrl: true }
    }
    if (chainStr.toLowerCase() === NETWORK_LABEL[ChainId.MAINNET].toLowerCase()) {
      return { chainId: ChainId.MAINNET, chainIdFromUrl: true }
    }
    return { chainId: localStorageChain || ChainId.BSC, chainIdFromUrl: false }
  }
  return { chainId: localStorageChain || ChainId.BSC, chainIdFromUrl: false }
}

const { chainId: initChainId, chainIdFromUrl } = chainIdSafeCheck()

const initialState: NetworkState = {
  isInitialized: false,
  isLoading: true,
  data: { chainId: initChainId, chainIdFromUrl },
}

export const networkSlice = createSlice({
  name: 'network',
  initialState,
  reducers: {
    networkFetchStart: (state) => {
      state.isLoading = true
    },
    networkFetchSucceeded: (state, action: PayloadAction<Network>) => {
      state.isInitialized = true
      state.isLoading = false
      state.data = action.payload
    },
    networkFetchFailed: (state) => {
      state.isLoading = false
      state.isInitialized = true
    },
    setNetwork: (state, action) => {
      state.isInitialized = true
      state.isLoading = false
      state.data.chainId = action.payload.chainId
    },
    setChainIdFromUrl: (state, action) => {
      state.isInitialized = true
      state.isLoading = false
      state.data.chainIdFromUrl = action.payload.chainIdFromUrl
    },
  },
})

// Actions
export const { networkFetchStart, networkFetchSucceeded, networkFetchFailed, setNetwork, setChainIdFromUrl } =
  networkSlice.actions

// thunks
export const fetchUserNetwork = (web3ChainId: number, account: string, chainId: number) => (dispatch) => {
  try {
    dispatch(networkFetchStart())
    const network = fetchAndUpdateNetwork(web3ChainId, account, chainId)
    dispatch(setNetwork(network))
    localStorage.setItem(`chainIdStatus`, JSON.stringify(network.chainId))
  } catch (error) {
    dispatch(networkFetchFailed())
  }
}

export const fetchChainIdFromUrl = (updatedChainIdFromUrl: boolean) => (dispatch) => {
  dispatch(setChainIdFromUrl(updatedChainIdFromUrl))
}

export default networkSlice.reducer
