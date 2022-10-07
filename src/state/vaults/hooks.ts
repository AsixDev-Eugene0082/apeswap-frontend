import BigNumber from 'bignumber.js'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useRefresh from 'hooks/useRefresh'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { useFarmLpAprs } from 'state/hooks'
import { useFetchLpTokenPrices } from 'state/lpPrices/hooks'
import { useFetchTokenPrices, useTokenPrices } from 'state/tokenPrices/hooks'
import { VaultsState, State, Vault } from 'state/types'
import { fetchVaultsPublicDataAsync, fetchVaultUserDataAsync, setInitialVaultDataAsync } from '.'

// Vault data
export const usePollVaultsData = (includeArchive = false) => {
  const dispatch = useAppDispatch()
  const { slowRefresh } = useRefresh()
  const { account, chainId } = useActiveWeb3React()
  const { tokenPrices } = useTokenPrices()
  const farmLpAprs = useFarmLpAprs()
  useEffect(() => {
    dispatch(fetchVaultsPublicDataAsync(chainId, tokenPrices, farmLpAprs))
    if (account) {
      dispatch(fetchVaultUserDataAsync(account, chainId))
    }
  }, [includeArchive, dispatch, slowRefresh, account, chainId, tokenPrices, farmLpAprs])
}

// Vaults

export const useVaults = () => {
  const { loadVaultData, userDataLoaded, data }: VaultsState = useSelector((state: State) => state.vaults)
  return { vaults: data, loadVaultData, userDataLoaded }
}

export const useVaultFromPid = (pid): Vault => {
  const vault = useSelector((state: State) => state.vaults.data.find((v) => v.pid === pid))
  return vault
}

export const useVaultUser = (pid) => {
  const vault = useVaultFromPid(pid)

  return {
    allowance: vault.userData ? new BigNumber(vault.userData.allowance) : new BigNumber(0),
    tokenBalance: vault.userData ? new BigNumber(vault.userData.tokenBalance) : new BigNumber(0),
    stakedBalance: vault.userData ? new BigNumber(vault.userData.stakedBalance) : new BigNumber(0),
    stakedWantBalance: vault.userData ? new BigNumber(vault.userData.stakedWantBalance) : new BigNumber(0),
  }
}

export const useSetVaults = () => {
  useFetchTokenPrices()
  useFetchLpTokenPrices()
  const dispatch = useAppDispatch()
  const { vaults } = useVaults()
  const { chainId } = useActiveWeb3React()
  if (vaults.length === 0) {
    dispatch(setInitialVaultDataAsync(chainId))
  }
}
