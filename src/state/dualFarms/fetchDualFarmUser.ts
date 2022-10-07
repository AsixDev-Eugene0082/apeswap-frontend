import BigNumber from 'bignumber.js'
import erc20ABI from 'config/abi/erc20.json'
import miniChefABI from 'config/abi/miniApeV2.json'
import rewarderABI from 'config/abi/miniComplexRewarder.json'
import { DualFarm } from 'state/types'
import { getMiniChefAddress } from 'utils/addressHelper'
import multicall from 'utils/multicall'

export const fetchDualFarmUserAllowances = async (
  chainId: number,
  account: string,
  dualFarms: DualFarm[],
): Promise<{ pid: number; value: string }[]> => {
  const miniChefAddress = getMiniChefAddress(chainId)
  const pids = []
  const calls = dualFarms.map((farm) => {
    const lpContractAddress = farm.stakeTokenAddress
    pids.push(farm.pid)
    return { address: lpContractAddress, name: 'allowance', params: [account, miniChefAddress] }
  })

  const rawLpAllowances = await multicall(chainId, erc20ABI, calls)
  // Return pid, allowance
  return rawLpAllowances.map((lpBalance, i) => {
    return { pid: pids[i], value: new BigNumber(lpBalance).toJSON() }
  })
}

export const fetchDualFarmUserTokenBalances = async (
  chainId: number,
  account: string,
  dualFarms: DualFarm[],
): Promise<{ pid: number; value: string }[]> => {
  const pids = []
  const calls = dualFarms.map((farm) => {
    const lpContractAddress = farm.stakeTokenAddress
    pids.push(farm.pid)
    return {
      address: lpContractAddress,
      name: 'balanceOf',
      params: [account],
    }
  })

  const rawTokenBalances = await multicall(chainId, erc20ABI, calls)
  return rawTokenBalances.map((tokenBalance, i) => {
    return { pid: pids[i], value: new BigNumber(tokenBalance).toJSON() }
  })
}

export const fetchDualFarmUserStakedBalances = async (
  chainId: number,
  account: string,
  dualFarms: DualFarm[],
): Promise<{ pid: number; value: string }[]> => {
  const miniChefAddress = getMiniChefAddress(chainId)
  const pids = []
  const calls = dualFarms.map((farm) => {
    pids.push(farm.pid)
    return {
      address: miniChefAddress,
      name: 'userInfo',
      params: [farm.pid, account],
    }
  })

  const rawStakedBalances = await multicall(chainId, miniChefABI, calls)
  return rawStakedBalances.map((stakedBalance, i) => {
    return { pid: pids[i], value: new BigNumber(stakedBalance[0]._hex).toJSON() }
  })
}

export const fetchDualMiniChefEarnings = async (
  chainId: number,
  account: string,
  dualFarms: DualFarm[],
): Promise<{ pid: number; value: string }[]> => {
  const miniChefAddress = getMiniChefAddress(chainId)
  const pids = []
  const calls = dualFarms.map((farm) => {
    pids.push(farm.pid)
    return {
      address: miniChefAddress,
      name: 'pendingBanana',
      params: [farm.pid, account],
    }
  })

  const rawEarnings = await multicall(chainId, miniChefABI, calls)
  return rawEarnings.map((earnings, i) => {
    return { pid: pids[i], value: new BigNumber(earnings).toJSON() }
  })
}

export const fetchDualFarmRewarderEarnings = async (
  chainId: number,
  account: string,
  dualFarms: DualFarm[],
): Promise<{ pid: number; value: string }[]> => {
  const pids = []
  const calls = dualFarms.map((farm) => {
    pids.push(farm.pid)
    return {
      address: farm.rewarderAddress,
      name: 'pendingToken',
      params: [farm.pid, account],
    }
  })

  const rawEarnings = await multicall(chainId, rewarderABI, calls)
  return rawEarnings.map((earnings, i) => {
    return { pid: pids[i], value: new BigNumber(earnings).toJSON() }
  })
}
