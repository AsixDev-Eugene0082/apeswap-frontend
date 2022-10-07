import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useRefresh from 'hooks/useRefresh'
import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { useFetchTokenPrices, useTokenPrices } from 'state/tokenPrices/hooks'
import { Bills, State } from 'state/types'
import {
  fetchBillsPublicDataAsync,
  fetchBillsUserDataAsync,
  fetchUserOwnedBillsDataAsync,
  setInitialBillsDataAsync,
} from '.'

export const usePollBills = () => {
  const { chainId } = useActiveWeb3React()
  const dispatch = useAppDispatch()
  const { tokenPrices } = useTokenPrices()
  useEffect(() => {
    dispatch(fetchBillsPublicDataAsync(chainId, tokenPrices))
  }, [dispatch, tokenPrices, chainId])
}

export const usePollUserBills = (): Bills[] => {
  const { slowRefresh } = useRefresh()
  const dispatch = useAppDispatch()
  const { chainId, account } = useActiveWeb3React()
  const bills = useSelector((state: State) => state.bills.data)
  // When the length of bills change data will be reloaded. Need for cross chain and pulling bills data
  const billsLoaded = bills.length
  useEffect(() => {
    if (account) {
      dispatch(fetchBillsUserDataAsync(chainId, account))
      dispatch(fetchUserOwnedBillsDataAsync(chainId, account))
    }
  }, [account, dispatch, slowRefresh, billsLoaded, chainId])
  return bills
}

export const useBills = (): Bills[] => {
  const bills = useSelector((state: State) => state.bills.data)
  return bills
}

export const useSetBills = () => {
  const { chainId } = useActiveWeb3React()
  const refChainId = useRef(null)
  useFetchTokenPrices()
  const dispatch = useAppDispatch()
  const bills = useBills()
  useEffect(() => {
    if (bills.length === 0 || refChainId.current !== chainId) {
      dispatch(setInitialBillsDataAsync(chainId))
      refChainId.current = chainId
    }
  }, [chainId, bills.length, dispatch])
}
