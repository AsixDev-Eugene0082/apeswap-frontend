import { ChainId } from '@ape.swap/sdk'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useRefresh from 'hooks/useRefresh'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { useNetworkChainId } from 'state/hooks'
import { useFetchTokenPrices, useTokenPrices } from 'state/tokenPrices/hooks'
import { JungleFarm, State, StatsState } from 'state/types'
import { fetchJungleFarmsPublicDataAsync, fetchJungleFarmsUserDataAsync, setInitialJungleFarmDataAsync } from '.'

export const usePollJungleFarms = () => {
  const chainId = useNetworkChainId()
  const { tokenPrices } = useTokenPrices()

  const dispatch = useAppDispatch()
  useEffect(() => {
    if (chainId === ChainId.BSC) {
      dispatch(fetchJungleFarmsPublicDataAsync(chainId, tokenPrices))
    }
  }, [dispatch, tokenPrices, chainId])
}

export const useJungleFarms = (account): JungleFarm[] => {
  const { slowRefresh } = useRefresh()
  const dispatch = useAppDispatch()
  const { chainId } = useActiveWeb3React()
  const farms = useSelector((state: State) => state.jungleFarms.data)
  const farmsLoaded = farms.length > 0

  useEffect(() => {
    if (account && (chainId === ChainId.BSC || chainId === ChainId.BSC_TESTNET)) {
      dispatch(fetchJungleFarmsUserDataAsync(chainId, account))
    }
  }, [account, dispatch, slowRefresh, farmsLoaded, chainId])

  return farms
}

export const useSetJungleFarms = () => {
  useFetchTokenPrices()
  const dispatch = useAppDispatch()
  const jungleFarms = useJungleFarms(null)
  if (jungleFarms.length === 0) {
    dispatch(setInitialJungleFarmDataAsync())
  }
}

export const useJungleFarmTags = (chainId: number) => {
  const { Tags }: StatsState = useSelector((state: State) => state.stats)
  const jungleFarmTags = Tags?.[`${chainId}`]?.jungleFarms

  return { jungleFarmTags }
}

export const useJungleFarmOrderings = (chainId: number) => {
  const { Ordering }: StatsState = useSelector((state: State) => state.stats)
  const jungleFarmOrderings = Ordering?.[`${chainId}`]?.jungleFarms

  return { jungleFarmOrderings }
}
