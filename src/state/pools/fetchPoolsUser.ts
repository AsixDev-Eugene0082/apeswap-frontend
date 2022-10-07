import sousChefABI from 'config/abi/sousChef.json'
import masterChefABI from 'config/abi/masterchef.json'
import erc20ABI from 'config/abi/erc20.json'
import { getMasterChefAddress } from 'utils/addressHelper'
import { getContract } from 'utils/getContract'
import multicall from 'utils/multicall'
import BigNumber from 'bignumber.js'
import { QuoteToken } from 'config/constants/types'
import { Pool } from 'state/types'

export const fetchPoolsAllowance = async (chainId: number, account, poolsConfig: Pool[]) => {
  const nonBnbPools = poolsConfig.filter((p) => p.stakingToken.address !== QuoteToken.BNB)
  const calls = nonBnbPools.map((p) => ({
    address: p.stakingToken.address[chainId],
    name: 'allowance',
    params: [account, p.contractAddress[chainId]],
  }))

  const allowances = await multicall(chainId, erc20ABI, calls)
  return nonBnbPools.reduce(
    (acc, pool, index) => ({ ...acc, [pool.sousId]: new BigNumber(allowances[index]).toJSON() }),
    {},
  )
}

export const fetchUserBalances = async (chainId: number, account, poolsConfig: Pool[]) => {
  // Non BNB pools
  const nonBnbPools = poolsConfig.filter((p) => p.stakingToken.address !== QuoteToken.BNB)
  const calls = nonBnbPools.map((p) => ({
    address: p.stakingToken.address[chainId],
    name: 'balanceOf',
    params: [account],
  }))
  const tokenBalancesRaw = await multicall(chainId, erc20ABI, calls)
  const tokenBalances = nonBnbPools.reduce(
    (acc, pool, index) => ({ ...acc, [pool.sousId]: new BigNumber(tokenBalancesRaw[index]).toJSON() }),
    {},
  )

  return { ...tokenBalances }
}

export const fetchUserStakeBalances = async (chainId: number, account, poolsConfig: Pool[]) => {
  const nonMasterPools = poolsConfig.filter((p) => p.sousId !== 0)
  const masterChefAddress = getMasterChefAddress(chainId)
  const masterChefContract = getContract(masterChefABI, masterChefAddress, chainId)
  const calls = nonMasterPools.map((p) => ({
    address: p.contractAddress[chainId],
    name: 'userInfo',
    params: [account],
  }))
  const userInfo = await multicall(chainId, sousChefABI, calls)
  const stakedBalances = nonMasterPools.reduce(
    (acc, pool, index) => ({
      ...acc,
      [pool.sousId]: new BigNumber(userInfo[index].amount._hex).toJSON(),
    }),
    {},
  )

  const { amount: masterPoolAmount } = await masterChefContract.userInfo('0', account)

  return { ...stakedBalances, 0: new BigNumber(masterPoolAmount.toString()).toJSON() }
}

export const fetchUserPendingRewards = async (chainId: number, account, poolsConfig: Pool[]) => {
  const nonMasterPools = poolsConfig.filter((p) => p.sousId !== 0)
  const masterChefAddress = getMasterChefAddress(chainId)
  const masterChefContract = getContract(masterChefABI, masterChefAddress, chainId)
  const calls = nonMasterPools.map((p) => ({
    address: p.contractAddress[chainId],
    name: 'pendingReward',
    params: [account],
  }))
  const res = await multicall(chainId, sousChefABI, calls)
  const pendingRewards = nonMasterPools.reduce(
    (acc, pool, index) => ({
      ...acc,
      [pool.sousId]: new BigNumber(res[index]).toJSON(),
    }),
    {},
  )

  const pendingReward = await masterChefContract.pendingCake('0', account)

  return { ...pendingRewards, 0: new BigNumber(pendingReward.toString()).toJSON() }
}
