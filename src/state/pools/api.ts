import { apeswapListUrl } from 'hooks/api'
import axiosRetry from 'axios-retry'
import axios from 'axios'

let tries = 0
let cachePools = []

const fetchPoolConfig = async () => {
  try {
    if (tries === 0) {
      axiosRetry(axios, {
        retries: 5,
        retryCondition: () => true,
      })
      tries++
      const response = await axios.get(`${apeswapListUrl}/pools.json`)
      const poolConfigResp = await response.data
      if (poolConfigResp.statusCode === 500) {
        return null
      }
      cachePools = poolConfigResp
      return poolConfigResp
    }
    return cachePools
  } catch (error) {
    tries = 0
    return null
  }
}

export default fetchPoolConfig
