import axios from 'axios'
import axiosRetry from 'axios-retry'
import { initialStatsData } from './mappings'

const baseUrl = {
  local: 'http://localhost:3333/stats',
  prod: 'https://apeswap.api.pacoca.io/stats',
}

const statsApi = axios.create({ baseURL: baseUrl.prod })

axiosRetry(statsApi, {
  retries: 5,
  retryCondition: () => true,
  retryDelay: (retryCount) => {
    console.warn(`Unable to fetch, retrying request... retry attempt: ${retryCount}`)
    return retryCount * 1000
  },
})

const cachedStats = {}

export const fetchStatsData = async (params: string) => {
  try {
    if (cachedStats[params]) return cachedStats[params]

    const response = await statsApi.get(`/${params}`)
    const statsResponse = response.data

    if (statsResponse.statusCode === 500) {
      return initialStatsData
    }

    cachedStats[params] = statsResponse

    return statsResponse
  } catch (error) {
    console.error('Unable to fetch data from API. Are you sure the URL is correct?')

    return initialStatsData
  }
}
