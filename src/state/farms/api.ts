import { apeswapListUrl } from 'hooks/api'
import axiosRetry from 'axios-retry'
import axios from 'axios'

let tries = 0
let cacheFarms = []

const fetchFarmConfig = async () => {
  try {
    if (tries === 0) {
      axiosRetry(axios, {
        retries: 5,
        retryCondition: () => true,
      })
      tries++
      const response = await axios.get(`${apeswapListUrl}/farms.json`)
      const farmConfigResp = await response.data
      if (farmConfigResp.statusCode === 500) {
        return null
      }
      cacheFarms = farmConfigResp
      return farmConfigResp
    }
    return cacheFarms
  } catch (error) {
    tries = 0
    return null
  }
}

export default fetchFarmConfig
