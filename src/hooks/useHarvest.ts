import { useCallback } from 'react'
import sousChef from 'config/abi/sousChef.json'
import { useWeb3React } from '@web3-react/core'
import { ChainId } from '@ape.swap/sdk'
import { useDispatch } from 'react-redux'
import { soushHarvest, harvest, nfaStakeHarvest, miniChefHarvest, jungleHarvest } from 'utils/callHelpers'
import { usePools } from 'state/pools/hooks'
import track from 'utils/track'
import { useNetworkChainId } from 'state/hooks'
import { getContract } from 'utils'
import { useJungleFarms } from 'state/jungleFarms/hooks'
import { SousChef, JungleChef } from 'config/abi/types'
import { updateDualFarmRewarderEarnings, updateDualFarmUserEarnings } from 'state/dualFarms'
import { updateUserNfaStakingPendingReward, updateNfaStakingUserBalance } from 'state/nfaStakingPools'
import { useMasterchef, useMiniChefContract, useSousChef, useNfaStakingChef, useJungleChef } from './useContract'
import useActiveWeb3React from './useActiveWeb3React'

export const useHarvest = (farmPid: number) => {
  const { chainId } = useWeb3React()
  const masterChefContract = useMasterchef()

  const handleHarvest = useCallback(async () => {
    const txHash = await harvest(masterChefContract, farmPid)
    track({
      event: 'farm',
      chain: chainId,
      data: {
        cat: 'harvest',
        pid: farmPid,
      },
    })
    return txHash
  }, [farmPid, masterChefContract, chainId])

  return { onHarvest: handleHarvest }
}

export const useJungleHarvest = (jungleId) => {
  const { chainId } = useActiveWeb3React()
  const jungleChefContract = useJungleChef(jungleId)

  const handleHarvest = useCallback(async () => {
    const trxHash = await jungleHarvest(jungleChefContract)

    track({
      event: 'jungle_farm',
      chain: chainId,
      data: {
        cat: 'harvest',
        pid: jungleId,
      },
    })
    return trxHash
  }, [jungleChefContract, jungleId, chainId])

  return { onHarvest: handleHarvest }
}

export const useAllHarvest = (farmPids: number[], chainId: number) => {
  const { account } = useActiveWeb3React()
  const masterChefContract = useMasterchef()
  const miniChefContract = useMiniChefContract()

  const handleHarvest = useCallback(async () => {
    if (chainId === ChainId.MATIC) {
      const harvestPromises = farmPids.reduce((accum, pid) => {
        return [...accum, miniChefHarvest(miniChefContract, pid, account)]
      }, [])
      return Promise.all(harvestPromises)
    }
    const harvestPromises = farmPids.reduce((accum, pid) => {
      return [...accum, harvest(masterChefContract, pid)]
    }, [])
    return Promise.all(harvestPromises)
  }, [account, farmPids, masterChefContract, miniChefContract, chainId])
  return { onReward: handleHarvest }
}

export const useSousHarvest = (sousId) => {
  const { chainId } = useActiveWeb3React()
  const sousChefContract = useSousChef(sousId)
  const masterChefContract = useMasterchef()

  const handleHarvest = useCallback(async () => {
    let trxHash
    if (sousId === 0) {
      trxHash = await harvest(masterChefContract, 0)
    } else {
      trxHash = await soushHarvest(sousChefContract)
    }
    track({
      event: 'pool',
      chain: chainId,
      data: {
        cat: 'harvest',
        pid: sousId,
      },
    })
    return trxHash
  }, [masterChefContract, sousChefContract, sousId, chainId])

  return { onHarvest: handleHarvest }
}

export const useSousHarvestAll = (sousIds: number[]) => {
  const { account, library, chainId } = useActiveWeb3React()
  const masterChefContract = useMasterchef()
  const pools = usePools(null)

  const handleHarvestAll = useCallback(async () => {
    const harvestPromises = sousIds.map((sousId) => {
      const config = pools.find((pool) => pool.sousId === sousId)
      const sousChefContract = getContract(config.contractAddress[chainId], sousChef, library, account) as SousChef
      return sousId === 0 ? harvest(masterChefContract, 0) : soushHarvest(sousChefContract)
    })
    return Promise.all(harvestPromises)
  }, [account, sousIds, library, masterChefContract, chainId, pools])
  return { onHarvestAll: handleHarvestAll }
}

export const useJungleHarvestAll = (jungleIds: number[]) => {
  const { account, library, chainId } = useActiveWeb3React()

  const jungleFarms = useJungleFarms(null)

  const handleHarvestAll = useCallback(async () => {
    const harvestPromises = jungleIds.map((jungleId) => {
      const config = jungleFarms.find((farm) => farm.jungleId === jungleId)
      const jungleChefContract = getContract(config.contractAddress[chainId], sousChef, library, account) as JungleChef
      return jungleHarvest(jungleChefContract)
    })
    return Promise.all(harvestPromises)
  }, [account, jungleIds, library, chainId, jungleFarms])
  return { onHarvestAll: handleHarvestAll }
}

export const useNfaStakingHarvest = (sousId) => {
  const dispatch = useDispatch()
  const { account } = useWeb3React()
  const chainId = useNetworkChainId()
  const nfaStakingChef = useNfaStakingChef(sousId)
  const handleHarvest = useCallback(async () => {
    const trxHash = await nfaStakeHarvest(nfaStakingChef)
    dispatch(updateUserNfaStakingPendingReward(chainId, sousId, account))
    dispatch(updateNfaStakingUserBalance(chainId, sousId, account))
    track({
      event: 'nfa',
      chain: chainId,
      data: {
        cat: 'harvest',
        pid: sousId,
      },
    })
    return trxHash
  }, [account, dispatch, nfaStakingChef, sousId, chainId])

  return { onReward: handleHarvest }
}

export const useMiniChefHarvest = (farmPid: number) => {
  const dispatch = useDispatch()
  const { account, chainId } = useWeb3React()
  const miniChefContract = useMiniChefContract()

  const handleHarvest = useCallback(async () => {
    const txHash = await miniChefHarvest(miniChefContract, farmPid, account)
    track({
      event: 'dualFarm',
      chain: chainId,
      data: {
        cat: 'harvest',
        pid: farmPid,
      },
    })
    dispatch(updateDualFarmUserEarnings(chainId, farmPid, account))
    dispatch(updateDualFarmRewarderEarnings(chainId, farmPid, account))
    return txHash
  }, [account, dispatch, farmPid, miniChefContract, chainId])

  return { onReward: handleHarvest }
}
