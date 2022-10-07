import { apeswapListUrl } from 'hooks/api'
import axiosRetry from 'axios-retry'
import axios from 'axios'

let tries = 0
let cacheJungleFarms = []

const fetchJungleFarmConfig = async () => {
  try {
    if (tries === 0) {
      axiosRetry(axios, {
        retries: 5,
        retryCondition: () => true,
      })
      tries++
      const response = await axios.get(`${apeswapListUrl}/jungleFarms.json`)
      const jungleFarmConfigResp = await response.data
      if (jungleFarmConfigResp.statusCode === 500) {
        return null
      }
      cacheJungleFarms = jungleFarmConfigResp
      return jungleFarmConfigResp
    }
    return cacheJungleFarms
  } catch (error) {
    tries = 0
    return null
  }
}

export default fetchJungleFarmConfig
