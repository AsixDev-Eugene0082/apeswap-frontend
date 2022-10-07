// NfaStakingPools

import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useRefresh from 'hooks/useRefresh'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { useTokenPrices } from 'state/tokenPrices/hooks'
import { NfaStakingPool, State } from 'state/types'
import {
  fetchNfaStakingPoolsPublicDataAsync,
  fetchNfaStakingPoolsUserDataAsync,
  setInitialNfaStakingDataAsync,
} from '.'

export const usePollNfaStakingData = () => {
  const { slowRefresh } = useRefresh()
  const { account, chainId } = useActiveWeb3React()
  const dispatch = useAppDispatch()
  const { tokenPrices } = useTokenPrices()
  useEffect(() => {
    dispatch(fetchNfaStakingPoolsPublicDataAsync(chainId, tokenPrices))
    if (account) {
      dispatch(fetchNfaStakingPoolsUserDataAsync(chainId, account))
    }
  }, [account, dispatch, chainId, tokenPrices, slowRefresh])
}

export const useNfaStakingPools = (): NfaStakingPool[] => {
  const nfaStakingPools = useSelector((state: State) => state.nfaStakingPools.data)
  return nfaStakingPools
}

export const useNfaStakingPoolFromPid = (sousId): NfaStakingPool => {
  const nfaStakingPool = useSelector((state: State) => state.nfaStakingPools.data.find((p) => p.sousId === sousId))
  return nfaStakingPool
}

export const useAllNfaStakingPools = (): NfaStakingPool[] => {
  const nfaStakingPools = useSelector((state: State) => state.nfaStakingPools.data)
  return nfaStakingPools
}

export const useSetNfaStakingPools = () => {
  const dispatch = useAppDispatch()
  const nfaStakingPools = useNfaStakingPools()
  if (nfaStakingPools.length === 0) {
    dispatch(setInitialNfaStakingDataAsync())
  }
}
