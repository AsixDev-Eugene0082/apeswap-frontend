import { ChainId } from '@ape.swap/sdk'
import BigNumber from 'bignumber.js'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useRefresh from 'hooks/useRefresh'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { useFarmLpAprs } from 'state/hooks'
import { useFetchLpTokenPrices } from 'state/lpPrices/hooks'
import { useFetchTokenPrices, usePriceBananaBusd, useTokenPrices } from 'state/tokenPrices/hooks'
import { DualFarm, State } from 'state/types'
import { fetchDualFarmsPublicDataAsync, fetchDualFarmUserDataAsync, setInitialDualFarmDataAsync } from '.'

export const usePollDualFarms = () => {
  const { chainId } = useActiveWeb3React()
  const dispatch = useAppDispatch()
  const { tokenPrices } = useTokenPrices()
  // Made a string because hooks will refresh bignumbers
  const bananaPrice = usePriceBananaBusd().toString()
  const farmLpAprs = useFarmLpAprs()

  useEffect(() => {
    const fetchFarms = () => {
      if (chainId === ChainId.MATIC) {
        dispatch(fetchDualFarmsPublicDataAsync(chainId, tokenPrices, new BigNumber(bananaPrice), farmLpAprs))
      }
    }
    fetchFarms()
  }, [dispatch, chainId, tokenPrices, bananaPrice, farmLpAprs])
}

export const useDualFarms = (account): DualFarm[] => {
  const { slowRefresh } = useRefresh()
  const dispatch = useAppDispatch()
  const { chainId } = useActiveWeb3React()
  const farms = useSelector((state: State) => state.dualFarms.data)
  const farmsLoaded = farms.length > 0
  useEffect(() => {
    if (account && (chainId === ChainId.MATIC || chainId === ChainId.MATIC_TESTNET)) {
      dispatch(fetchDualFarmUserDataAsync(chainId, account))
    }
  }, [account, dispatch, slowRefresh, chainId, farmsLoaded])
  return farms
}

export const useFarmFromPid = (pid): DualFarm => {
  const farm = useSelector((state: State) => state.dualFarms.data.find((f) => f.pid === pid))
  return farm
}

export const useFarmFromSymbol = (lpSymbol: string): DualFarm => {
  const farm = useSelector((state: State) =>
    state.dualFarms.data.find(
      () => `${farm?.stakeTokens?.token0?.symbol}-${farm?.stakeTokens?.token1?.symbol}` === lpSymbol,
    ),
  )
  return farm
}

export const useFarmUser = (pid) => {
  const farm = useFarmFromPid(pid)

  return {
    allowance: farm?.userData ? new BigNumber(farm.userData.allowance) : new BigNumber(0),
    tokenBalance: farm?.userData ? new BigNumber(farm.userData.tokenBalance) : new BigNumber(0),
    stakedBalance: farm?.userData ? new BigNumber(farm.userData.stakedBalance) : new BigNumber(0),
    earnings: farm?.userData ? new BigNumber(farm.userData.rewarderEarnings) : new BigNumber(0),
  }
}

export const useSetDualFarms = () => {
  useFetchLpTokenPrices()
  useFetchTokenPrices()
  const dispatch = useAppDispatch()
  const farms = useDualFarms(null)
  if (farms.length === 0) {
    dispatch(setInitialDualFarmDataAsync())
  }
}
