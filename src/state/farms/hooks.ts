import { ChainId } from '@ape.swap/sdk'
import BigNumber from 'bignumber.js'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useRefresh from 'hooks/useRefresh'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { useFarmLpAprs, useLpTokenPrices } from 'state/hooks'
import { useFetchLpTokenPrices } from 'state/lpPrices/hooks'
import { useBananaPrice } from 'state/tokenPrices/hooks'
import { Farm, State, StatsState } from 'state/types'
import { fetchFarmsPublicDataAsync, fetchFarmUserDataAsync, setInitialFarmDataAsync } from '.'

export const usePollFarms = () => {
  const { chainId } = useActiveWeb3React()
  const dispatch = useAppDispatch()
  const { lpTokenPrices } = useLpTokenPrices()
  const { slowRefresh } = useRefresh()
  // Made a string because hooks will refresh bignumbers
  const bananaPrice = useBananaPrice()
  const farmLpAprs = useFarmLpAprs()

  useEffect(() => {
    if (chainId === ChainId.BSC) {
      dispatch(fetchFarmsPublicDataAsync(chainId, lpTokenPrices, new BigNumber(bananaPrice), farmLpAprs))
    }
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [dispatch, chainId, lpTokenPrices?.length, farmLpAprs?.lpAprs?.length, slowRefresh])
}
export const useFarms = (account): Farm[] => {
  const { slowRefresh } = useRefresh()
  const dispatch = useAppDispatch()
  const { chainId } = useActiveWeb3React()
  const farms = useSelector((state: State) => state.farms.data)
  const farmsLoaded = farms.length > 0
  useEffect(() => {
    if (account && (chainId === ChainId.BSC || chainId === ChainId.BSC_TESTNET)) {
      dispatch(fetchFarmUserDataAsync(chainId, account))
    }
  }, [account, dispatch, slowRefresh, chainId, farmsLoaded])
  return farms
}

export const useFarmFromPid = (pid): Farm => {
  const farm = useSelector((state: State) => state.farms.data.find((f) => f.pid === pid))
  return farm
}

export const useFarmFromSymbol = (lpSymbol: string): Farm => {
  const farm = useSelector((state: State) => state.farms.data.find((f) => f.lpSymbol === lpSymbol))
  return farm
}

export const useFarmUser = (pid) => {
  const farm = useFarmFromPid(pid)

  return {
    allowance: farm?.userData ? new BigNumber(farm.userData.allowance) : new BigNumber(0),
    tokenBalance: farm?.userData ? new BigNumber(farm.userData.tokenBalance) : new BigNumber(0),
    stakedBalance: farm?.userData ? new BigNumber(farm.userData.stakedBalance) : new BigNumber(0),
    earnings: farm?.userData ? new BigNumber(farm.userData.earnings) : new BigNumber(0),
  }
}

export const useFarmTags = (chainId: number) => {
  const { Tags }: StatsState = useSelector((state: State) => state.stats)
  const farmTags = Tags?.[`${chainId}`].farms
  return { farmTags }
}

export const useSetFarms = () => {
  useFetchLpTokenPrices()
  const dispatch = useAppDispatch()
  const farms = useFarms(null)
  if (farms.length === 0) {
    dispatch(setInitialFarmDataAsync())
  }
}

export const useFarmOrderings = (chainId: number) => {
  const { Ordering }: StatsState = useSelector((state: State) => state.stats)
  const farmOrderings = Ordering?.[`${chainId}`]?.farms

  return { farmOrderings }
}
