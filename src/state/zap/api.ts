import { apeswapListUrl } from 'hooks/api'
import axiosRetry from 'axios-retry'
import axios from 'axios'

let tries = 0
let cacheList = []

const fetchZapInputTokens = async () => {
  try {
    if (tries === 0) {
      axiosRetry(axios, {
        retries: 5,
        retryCondition: () => true,
      })
      tries++
      const response = await axios.get(`${apeswapListUrl}/zapInputTokens.json`)
      const zaplistResp = await response.data
      if (zaplistResp.statusCode === 500) {
        return null
      }
      cacheList = zaplistResp
      return zaplistResp
    }
    return cacheList
  } catch (error) {
    tries = 0
    return null
  }
}

export default fetchZapInputTokens
