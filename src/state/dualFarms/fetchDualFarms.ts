import erc20 from 'config/abi/erc20.json'
import miniApeV2 from 'config/abi/miniApeV2.json'
import BigNumber from 'bignumber.js'
import { DualFarm, FarmLpAprsType, TokenPrices } from 'state/types'
import { chunk } from 'lodash'
import multicall from 'utils/multicall'
import fetchDualFarmCalls from './fetchDualFarmCalls'
import cleanDualFarmData from './cleanDualFarmData'

const fetchDualFarms = async (
  chainId: number,
  tokenPrices: TokenPrices[],
  bananaPrice: BigNumber,
  farmLpAprs: FarmLpAprsType,
  dualFarms: DualFarm[],
) => {
  const farmIds = []
  const farmCalls = dualFarms.flatMap((farm) => {
    farmIds.push(farm.pid)
    return fetchDualFarmCalls(farm, chainId)
  })
  const vals = await multicall(chainId, [...miniApeV2, ...erc20], farmCalls)
  const chunkSize = farmCalls.length / dualFarms.length
  const chunkedFarms = chunk(vals, chunkSize)
  return cleanDualFarmData(farmIds, chunkedFarms, tokenPrices, bananaPrice, farmLpAprs, chainId, dualFarms)
}

export default fetchDualFarms
