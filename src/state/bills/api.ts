import { apeswapListUrl } from 'hooks/api'
import axiosRetry from 'axios-retry'
import axios from 'axios'

let tries = 0
let cacheBills = []

const fetchBillsConfig = async () => {
  try {
    if (tries === 0) {
      axiosRetry(axios, {
        retries: 5,
        retryCondition: () => true,
      })
      const response = await axios.get(`${apeswapListUrl}/bills.json`)
      const billConfigResp = await response.data
      if (billConfigResp.statusCode === 500) {
        return null
      }
      tries++
      cacheBills = billConfigResp
      return billConfigResp
    }
    return cacheBills
  } catch (error) {
    tries = 0
    return null
  }
}

export default fetchBillsConfig
