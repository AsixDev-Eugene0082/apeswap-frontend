import { apeswapListUrl } from 'hooks/api'
import axiosRetry from 'axios-retry'
import axios from 'axios'

let tries = 0
let cacheDualFarms = []

const fetchDualFarmConfig = async () => {
  try {
    if (tries === 0) {
      axiosRetry(axios, {
        retries: 5,
        retryCondition: () => true,
      })
      tries++
      const response = await axios.get(`${apeswapListUrl}/dualFarms.json`)
      const dualFarmConfigResp = await response.data
      if (dualFarmConfigResp.statusCode === 500) {
        return null
      }
      cacheDualFarms = dualFarmConfigResp
      return dualFarmConfigResp
    }
    return cacheDualFarms
  } catch (error) {
    tries = 0
    return null
  }
}

export default fetchDualFarmConfig
