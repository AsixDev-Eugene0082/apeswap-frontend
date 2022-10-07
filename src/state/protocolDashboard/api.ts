import { apiBaseUrl } from 'hooks/api'
import axiosRetry from 'axios-retry'
import axios from 'axios'

const getTreasuryBreakdown = async () => {
  try {
    axiosRetry(axios, {
      retries: 5,
      retryCondition: () => true,
    })
    const response = await axios.get(`${apiBaseUrl}/dashboard/treasury`)
    const data = await response.data
    if (data.statusCode === 500) {
      return null
    }
    return data
  } catch (error) {
    return null
  }
}

export const getTreasuryAssetOverview = async () => {
  try {
    axiosRetry(axios, {
      retries: 5,
      retryCondition: () => true,
    })
    const response = await axios.get(`${apiBaseUrl}/dashboard/treasury/asset-overview`)
    const data = await response.data
    if (data.statusCode === 500) {
      return null
    }
    return data
  } catch (error) {
    return null
  }
}

export const getTreasuryHistory = async () => {
  try {
    axiosRetry(axios, {
      retries: 5,
      retryCondition: () => true,
    })
    const response = await axios.get(`${apiBaseUrl}/dashboard/treasury/history`)
    const data = await response.data
    if (data.statusCode === 500) {
      return null
    }
    return data
  } catch (error) {
    return null
  }
}

export const getOverviewTvl = async () => {
  try {
    axiosRetry(axios, {
      retries: 5,
      retryCondition: () => true,
    })
    const response = await axios.get(`${apiBaseUrl}/dashboard/overview/tvl`)
    const data = await response.data
    if (data.statusCode === 500) {
      return null
    }
    return data
  } catch (error) {
    return null
  }
}

export const getOverviewVolume = async () => {
  try {
    axiosRetry(axios, {
      retries: 5,
      retryCondition: () => true,
    })
    const response = await axios.get(`${apiBaseUrl}/dashboard/overview/volume`)
    const data = await response.data
    if (data.statusCode === 500) {
      return null
    }
    return data
  } catch (error) {
    return null
  }
}

export const getOverviewProtocolMetrics = async () => {
  try {
    axiosRetry(axios, {
      retries: 5,
      retryCondition: () => true,
    })
    const response = await axios.get(`${apiBaseUrl}/dashboard/overview/protocol-metrics`)
    const data = await response.data
    if (data.statusCode === 500) {
      return null
    }
    return data
  } catch (error) {
    return null
  }
}

export const getOverviewMcapTvlRatio = async () => {
  try {
    axiosRetry(axios, {
      retries: 5,
      retryCondition: () => true,
    })
    const response = await axios.get(`${apiBaseUrl}/dashboard/overview/mcap-tvl-ratio`)
    const data = await response.data
    if (data.statusCode === 500) {
      return null
    }
    return data
  } catch (error) {
    return null
  }
}

export const getOverviewBananaDistribution = async () => {
  try {
    axiosRetry(axios, {
      retries: 5,
      retryCondition: () => true,
    })
    const response = await axios.get(`${apiBaseUrl}/dashboard/overview/banana-distribution`)
    const data = await response.data
    if (data.statusCode === 500) {
      return null
    }
    return data
  } catch (error) {
    return null
  }
}

export default getTreasuryBreakdown
