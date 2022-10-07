import jungleChefABI from 'config/abi/jungleChef.json'
import bananaABI from 'config/abi/banana.json'
import { JungleFarm, TokenPrices } from 'state/types'
import { chunk } from 'lodash'
import multicall from 'utils/multicall'
import fetchJungleFarmCalls from './fetchJungleFarmCalls'
import cleanJungleFarmData from './cleanJungleFarmData'

const fetchJungleFarms = async (chainId: number, tokenPrices: TokenPrices[], jungleFarmsConfig: JungleFarm[]) => {
  const farmIds = []
  const farmCalls = jungleFarmsConfig.flatMap((farm) => {
    farmIds.push(farm.jungleId)
    return fetchJungleFarmCalls(farm, chainId)
  })

  const vals = await multicall(chainId, [...jungleChefABI, ...bananaABI], farmCalls)
  const chunkSize = vals.length / jungleFarmsConfig.length
  const chunkedFarms = chunk(vals, chunkSize)

  return cleanJungleFarmData(farmIds, chunkedFarms, tokenPrices, chainId, jungleFarmsConfig)
}

export default fetchJungleFarms
