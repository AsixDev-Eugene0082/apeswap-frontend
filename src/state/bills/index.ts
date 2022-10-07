import { createSlice } from '@reduxjs/toolkit'
import {
  fetchBillsAllowance,
  fetchUserBalances,
  fetchUserOwnedBills,
  fetchUserOwnedBillNftData,
} from './fetchBillsUser'
import { TokenPrices, AppThunk, BillsState, Bills } from '../types'
import fetchBills from './fetchBills'
import { getNewBillNftData } from './getBillNftData'
import fetchBillsConfig from './api'

const initialState: BillsState = { data: [] }

export const billsSlice = createSlice({
  name: 'Bills',
  initialState,
  reducers: {
    setInitialBillsData: (state, action) => {
      state.data = action.payload
    },
    setBillsPublicData: (state, action) => {
      const liveBillsData: Bills[] = action.payload
      state.data = state.data.map((bill) => {
        const liveBillData = liveBillsData.find((entry) => entry.index === bill.index)
        return { ...bill, ...liveBillData }
      })
    },
    setBillsUserData: (state, action) => {
      const userData = action.payload
      state.data = state.data.map((bill) => {
        const userBillData = userData.find((entry) => entry.index === bill.index)
        return { ...bill, userData: userBillData }
      })
    },
    setUserOwnedBillsData: (state, action) => {
      const userData = action.payload
      state.data = state.data.map((bill) => {
        const userOwnedBillsData = userData.find((entry) => entry.index === bill.index)
        return { ...bill, userOwnedBillsData: userOwnedBillsData?.userOwnedBills }
      })
    },
    setUserOwnedBillsNftData: (state, action) => {
      const userData = action.payload
      state.data = state.data.map((bill) => {
        const userOwnedBillsNftData = userData.find((entry) => entry.index === bill.index)
        return { ...bill, userOwnedBillsNftData: userOwnedBillsNftData?.userOwnedBillsNfts }
      })
    },
    updateBillsUserData: (state, action) => {
      const { field, value, index } = action.payload
      const i = state.data.findIndex((bill) => bill.index === index)
      state.data[i] = { ...state.data[i], userData: { ...state.data[i].userData, [field]: value } }
    },
    updateBillsUserNftData: (state, action) => {
      const { value, index } = action.payload
      const i = state.data.findIndex((bill) => bill.index === index)
      state.data[i] = {
        ...state.data[i],
        userOwnedBillsNftData: { ...state.data[i].userOwnedBillsNftData, ...value },
      }
    },
  },
})

// Actions
export const {
  setInitialBillsData,
  setBillsPublicData,
  setBillsUserData,
  setUserOwnedBillsData,
  setUserOwnedBillsNftData,
  updateBillsUserData,
} = billsSlice.actions

// Thunks

export const setInitialBillsDataAsync = (chainId: number) => async (dispatch) => {
  try {
    const initialBillState: Bills[] = await fetchBillsConfig()
    const filterBillsByChainId = initialBillState.filter((bill) => bill.contractAddress?.[chainId] !== '')
    dispatch(setInitialBillsData(filterBillsByChainId || []))
  } catch (error) {
    console.error(error)
  }
}

export const fetchBillsPublicDataAsync =
  (chainId: number, tokenPrices: TokenPrices[]): AppThunk =>
  async (dispatch, getState) => {
    try {
      const bills = getState().bills.data
      const returnedBills = await fetchBills(chainId, tokenPrices, bills)
      dispatch(setBillsPublicData(returnedBills))
    } catch (error) {
      console.warn(error)
    }
  }

export const fetchBillsUserDataAsync =
  (chainId: number, account): AppThunk =>
  async (dispatch, getState) => {
    try {
      // fetch and set user bill interaction data
      const bills = getState().bills.data
      const allowances = await fetchBillsAllowance(chainId, account, bills)
      const stakingTokenBalances = await fetchUserBalances(chainId, account, bills)
      const userData = bills.map((bill) => ({
        index: bill.index,
        allowance: allowances[bill.index],
        stakingTokenBalance: stakingTokenBalances[bill.index],
      }))
      dispatch(setBillsUserData(userData))
    } catch (error) {
      console.warn(error)
    }
  }

export const fetchUserOwnedBillsDataAsync =
  (chainId: number, account): AppThunk =>
  async (dispatch, getState) => {
    try {
      // Fetch and set user owned bill data without NFT Data
      const bills = getState().bills.data
      const userOwnedBills = await fetchUserOwnedBills(chainId, account, bills)
      const mapUserOwnedBills = bills.map((bill) =>
        userOwnedBills.filter((b) => b.address === bill.contractAddress[chainId]),
      )
      const userOwnedBillsData = bills.map((bill, i) => ({
        index: bill.index,
        userOwnedBills: mapUserOwnedBills[i],
      }))
      dispatch(setUserOwnedBillsData(userOwnedBillsData))

      // Fetch owned bill NFT data
      const ownedBillsData = mapUserOwnedBills.flatMap((bs) => {
        return bs.map((b) => {
          return { id: b.id, billNftAddress: b.billNftAddress }
        })
      })
      const userBillNftData = await fetchUserOwnedBillNftData(ownedBillsData, chainId)
      const ownedBillsWithNftData = mapUserOwnedBills.map((bs, index) => {
        return {
          index: bills[index].index,
          userOwnedBillsNfts: [
            ...bs.map((b) => {
              return userBillNftData.find((nftB) => parseInt(nftB.id) === parseInt(b.id))?.data
            }),
          ],
        }
      })
      dispatch(setUserOwnedBillsNftData(ownedBillsWithNftData))
    } catch (error) {
      console.warn(error)
    }
  }

export const updateUserAllowance =
  (chainId: number, index: number, account: string): AppThunk =>
  async (dispatch, getState) => {
    const bills = getState().bills.data
    const allowances = await fetchBillsAllowance(chainId, account, bills)
    dispatch(updateBillsUserData({ index, field: 'allowance', value: allowances[index] }))
  }

export const updateUserBalance =
  (chainId: number, index: string, account: string): AppThunk =>
  async (dispatch, getState) => {
    const bills = getState().bills.data
    const tokenBalances = await fetchUserBalances(chainId, account, bills)
    dispatch(updateBillsUserData({ index, field: 'stakingTokenBalance', value: tokenBalances[index] }))
  }

/**
 * @deprecated since multiple NFT contracts
 */
export const updateUserNftData =
  (index: number, billNftId: string, transactionHash: string, chainId: number): AppThunk =>
  async (dispatch) => {
    const fetchedBillNftData = await getNewBillNftData(billNftId, transactionHash, chainId)
    dispatch(updateBillsUserData({ index, value: fetchedBillNftData }))
  }

export default billsSlice.reducer
