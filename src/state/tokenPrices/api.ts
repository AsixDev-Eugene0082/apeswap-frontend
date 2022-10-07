import { apeswapListUrl } from 'hooks/api'
import axiosRetry from 'axios-retry'
import axios from 'axios'

let tries = 0
let cacheTokens = []

const fetchTokenPriceConfig = async () => {
  try {
    if (tries === 0) {
      axiosRetry(axios, {
        retries: 5,
        retryCondition: () => true,
      })
      tries++
      const response = await axios.get(`${apeswapListUrl}/tokens.json`)
      const tokenPriceConfigResp = await response.data
      if (tokenPriceConfigResp.statusCode === 500) {
        return null
      }
      cacheTokens = tokenPriceConfigResp
      return tokenPriceConfigResp
    }
    return cacheTokens
  } catch (error) {
    return null
  }
}

export default fetchTokenPriceConfig
