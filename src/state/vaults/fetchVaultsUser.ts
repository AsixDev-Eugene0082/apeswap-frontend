import BigNumber from 'bignumber.js'
import erc20ABI from 'config/abi/erc20.json'
import vaultApeV1ABI from 'config/abi/vaultApeV1.json'
import vaultApeV2ABI from 'config/abi/vaultApeV2.json'
import multicall from 'utils/multicall'
import { getVaultApeAddressV1, getVaultApeAddressV2 } from 'utils/addressHelper'
import { Vault } from 'state/types'

export const fetchVaultUserAllowances = async (account: string, chainId: number, vaultsConfig: Vault[]) => {
  const vaultApeAddressV1 = getVaultApeAddressV1(chainId)
  const vaultApeAddressV2 = getVaultApeAddressV2(chainId)
  const filteredVaults = vaultsConfig.filter((vault) => vault.availableChains.includes(chainId))
  const calls = filteredVaults.map((vault) => {
    return {
      address: vault.stakeToken.address[chainId],
      name: 'allowance',
      params: [account, vault.version === 'V1' ? vaultApeAddressV1 : vaultApeAddressV2],
    }
  })
  const rawStakeAllowances = await multicall(chainId, erc20ABI, calls)
  const parsedStakeAllowances = rawStakeAllowances.map((stakeBalance) => {
    return new BigNumber(stakeBalance).toJSON()
  })
  return parsedStakeAllowances
}

export const fetchVaultUserTokenBalances = async (account: string, chainId: number, vaultsConfig: Vault[]) => {
  const filteredVaults = vaultsConfig.filter((vault) => vault.availableChains.includes(chainId))
  const calls = filteredVaults.map((vault) => {
    return {
      address: vault.stakeToken.address[chainId],
      name: 'balanceOf',
      params: [account],
    }
  })
  const rawTokenBalances = await multicall(chainId, erc20ABI, calls)
  const parsedTokenBalances = rawTokenBalances.map((tokenBalance) => {
    return new BigNumber(tokenBalance).toJSON()
  })
  return parsedTokenBalances
}

export const fetchVaultUserStakedAndPendingBalances = async (
  account: string,
  chainId: number,
  vaultsConfig: Vault[],
) => {
  const vaultApeAddressV1 = getVaultApeAddressV1(chainId)
  const vaultApeAddressV2 = getVaultApeAddressV2(chainId)
  const filteredVaults = vaultsConfig.filter((vault) => vault.availableChains.includes(chainId))
  const calls = filteredVaults.map((vault) => {
    return vault.version === 'V1'
      ? {
          address: vaultApeAddressV1,
          name: 'stakedWantTokens',
          params: [vault.pid, account],
        }
      : {
          address: vaultApeAddressV2,
          name: 'balanceOf',
          params: [vault.pid, account],
        }
  })

  const rawStakedBalances = await multicall(chainId, [...vaultApeV1ABI, ...vaultApeV2ABI], calls)
  const parsedStakedBalances = rawStakedBalances.map((stakedBalance) => {
    return new BigNumber(stakedBalance[0]._hex).toJSON()
  })
  const parsePendingBalances = rawStakedBalances.map((stakedBalance, index) => {
    return filteredVaults[index].version === 'V1' ? '0' : new BigNumber(stakedBalance[1]._hex).toJSON()
  })
  return { stakedBalances: parsedStakedBalances, pendingRewards: parsePendingBalances }
}
