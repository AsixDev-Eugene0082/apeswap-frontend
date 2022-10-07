import { apiBaseUrl } from 'hooks/api'
import axiosRetry from 'axios-retry'
import axios from 'axios'

const getBillNftData = async (billNftId: string, billNftAddress: string, chainId: number) => {
  try {
    axiosRetry(axios, {
      retries: 5,
      retryCondition: () => true,
    })
    const response = await axios.get(`${apiBaseUrl}/bills/${chainId}/${billNftAddress}/${billNftId}`)
    const billNftDataResp = await response.data
    if (billNftDataResp.statusCode === 500) {
      return null
    }
    return billNftDataResp
  } catch (error) {
    return null
  }
}
/**
 * @deprecated API doesn't support it any more and its not used
 */
export const getNewBillNftData = async (billNftId: string, transactionHash: string, chainId: number) => {
  try {
    axiosRetry(axios, {
      retries: 5,
      retryCondition: () => true,
    })
    const response = await axios.get(`${apiBaseUrl}/bills/${chainId}/${billNftId}/${transactionHash}`)
    const billNftDataResp = await response.data
    if (billNftDataResp.statusCode === 500) {
      return null
    }
    return billNftDataResp
  } catch (error) {
    return null
  }
}

export default getBillNftData
