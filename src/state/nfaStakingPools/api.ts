import { apeswapListUrl } from 'hooks/api'
import axiosRetry from 'axios-retry'
import axios from 'axios'

let tries = 0
let cacheNfaStakingPools = []

const fetchNfaStakingConfig = async () => {
  try {
    if (tries === 0) {
      axiosRetry(axios, {
        retries: 5,
        retryCondition: () => true,
      })
      tries++
      const response = await axios.get(`${apeswapListUrl}/nfaStakingPools.json`)
      const nfaStakingPoolsConfigResp = await response.data
      if (nfaStakingPoolsConfigResp.statusCode === 500) {
        return null
      }
      cacheNfaStakingPools = nfaStakingPoolsConfigResp
      return nfaStakingPoolsConfigResp
    }
    return cacheNfaStakingPools
  } catch (error) {
    tries = 0
    return null
  }
}

export default fetchNfaStakingConfig
