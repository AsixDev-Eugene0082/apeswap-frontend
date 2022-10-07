import { ChainId } from '@ape.swap/sdk'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useRefresh from 'hooks/useRefresh'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { useNetworkChainId } from 'state/hooks'
import { useFetchTokenPrices, useTokenPrices } from 'state/tokenPrices/hooks'
import { Pool, State, StatsState } from 'state/types'
import { fetchPoolsPublicDataAsync, fetchPoolsUserDataAsync, setInitialPoolDataAsync } from '.'

export const usePollPools = () => {
  const chainId = useNetworkChainId()
  const { tokenPrices } = useTokenPrices()
  const dispatch = useAppDispatch()
  useEffect(() => {
    if (chainId === ChainId.BSC) {
      dispatch(fetchPoolsPublicDataAsync(chainId, tokenPrices))
    }
  }, [dispatch, tokenPrices, chainId])
}

export const usePools = (account): Pool[] => {
  const { slowRefresh } = useRefresh()
  const dispatch = useAppDispatch()
  const { chainId } = useActiveWeb3React()
  const pools = useSelector((state: State) => state.pools.data)
  const poolsLoaded = pools.length > 0
  useEffect(() => {
    if (account && (chainId === ChainId.BSC || chainId === ChainId.BSC_TESTNET)) {
      dispatch(fetchPoolsUserDataAsync(chainId, account))
    }
  }, [account, dispatch, slowRefresh, chainId, poolsLoaded])

  return pools
}

export const usePoolFromPid = (sousId): Pool => {
  const pool = useSelector((state: State) => state.pools.data.find((p) => p.sousId === sousId))
  return pool
}

export const useGnanaPools = (account): Pool[] => {
  const pools = usePools(account).filter((pool) => pool.stakingToken.symbol === 'GNANA')
  return pools
}

export const useAllPools = (): Pool[] => {
  const pools = useSelector((state: State) => state.pools.data)
  return pools
}

export const usePoolTags = (chainId: number) => {
  const { Tags }: StatsState = useSelector((state: State) => state.stats)
  const poolTags = Tags?.[`${chainId}`]?.pools

  return { poolTags }
}

export const useSetPools = () => {
  useFetchTokenPrices()
  const dispatch = useAppDispatch()
  const pools = useAllPools()
  if (pools.length === 0) {
    dispatch(setInitialPoolDataAsync())
  }
}

// ORDERING
export const usePoolOrderings = (chainId: number) => {
  const { Ordering }: StatsState = useSelector((state: State) => state.stats)
  const poolOrderings = Ordering?.[`${chainId}`]?.pools

  return { poolOrderings }
}
