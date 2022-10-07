import { apeswapListUrl } from 'hooks/api'
import axiosRetry from 'axios-retry'
import axios from 'axios'

let tries = 0
let cacheVaults = []

const fetchVaultConfig = async () => {
  try {
    if (tries === 0) {
      axiosRetry(axios, {
        retries: 5,
        retryCondition: () => true,
      })
      const response = await axios.get(`${apeswapListUrl}/vaults.json`)
      tries++
      const vaultConfigResp = await response.data
      if (vaultConfigResp.statusCode === 500) {
        return null
      }
      cacheVaults = vaultConfigResp
      return vaultConfigResp
    }
    return cacheVaults
  } catch (error) {
    tries = 0
    return null
  }
}

export default fetchVaultConfig
