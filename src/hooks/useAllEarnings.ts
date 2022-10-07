import { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { ChainId } from '@ape.swap/sdk'
import masterChefABI from 'config/abi/masterchef.json'
import miniChefABI from 'config/abi/miniApeV2.json'
import { useFarms } from 'state/farms/hooks'
import { useDualFarms } from 'state/dualFarms/hooks'
import multicall from 'utils/multicall'
import { getMasterChefAddress, getMiniChefAddress } from 'utils/addressHelper'
import useRefresh from './useRefresh'

const useAllEarnings = () => {
  const [balances, setBalance] = useState([])
  const { account, chainId } = useWeb3React()
  const { fastRefresh } = useRefresh()
  const masterChefAddress = getMasterChefAddress(chainId)
  const miniChefAddress = getMiniChefAddress(chainId)
  const farmsConfig = useFarms(null)
  const dualFarmsConfig = useDualFarms(null)

  useEffect(() => {
    const fetchAllBSCBalances = async () => {
      try {
        const calls = farmsConfig.map((farm) => ({
          address: masterChefAddress,
          name: 'pendingCake',
          params: [farm.pid, account],
        }))

        const res = await multicall(chainId, masterChefABI, calls)

        setBalance(res)
      } catch (e) {
        console.warn(e)
      }
    }

    const fetchAllMiniChefBalances = async () => {
      try {
        const filteredDualFarms = dualFarmsConfig.filter((farm) => farm.network === chainId)
        const calls = filteredDualFarms.map((farm) => ({
          address: miniChefAddress,
          name: 'pendingBanana',
          params: [farm.pid, account],
        }))

        const res = await multicall(chainId, miniChefABI, calls)

        setBalance(res)
      } catch (e) {
        console.warn(e)
      }
    }

    if (account) {
      if (chainId === ChainId.BSC) {
        fetchAllBSCBalances()
      }
      if (chainId === ChainId.MATIC) {
        fetchAllMiniChefBalances()
      }
    }
  }, [account, fastRefresh, masterChefAddress, chainId, miniChefAddress, dualFarmsConfig, farmsConfig])

  return balances
}

export default useAllEarnings
