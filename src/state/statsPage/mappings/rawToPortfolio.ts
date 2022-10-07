import { ApiResponse, Chain, Position } from '../types'
import {
  billToPosition,
  farmToPosition,
  iaoToPosition,
  jungleToPosition,
  lendingToPosition,
  maximizerToPosition,
  poolToPosition,
} from './rawToPosition'

export interface PortfolioData {
  type: ProductType
  chainData: Partial<{
    [key in Chain]: Position[]
  }>
  totalValue: number
  totalEarnings: number
}

export type ProductType = 'farms' | 'pools' | 'vaults' | 'jungleFarms' | 'lending' | 'maximizers' | 'bills' | 'iaos'

export function rawToPortfolio({ userStats, bananaPrice }: ApiResponse) {
  const products: PortfolioData[] = []

  userStats.forEach((chainInfo) => {
    if (chainInfo.farms.length > 0) {
      chainInfo.farms.forEach((farm) => {
        const product = products.find((p) => p.type === 'farms')

        const positionData = farmToPosition(farm)

        const positionEarnings = positionData.secondaryRewardBalance
          ? positionData.rewardBalance * bananaPrice + positionData.secondaryRewardValue
          : positionData.rewardBalance * bananaPrice

        if (product) {
          product.chainData[chainInfo.chainId]
            ? product.chainData[chainInfo.chainId].push(positionData)
            : (product.chainData[chainInfo.chainId] = [positionData])

          product.totalValue += positionData.value
          product.totalEarnings += positionEarnings
        } else
          products.push({
            type: 'farms',
            chainData: { [chainInfo.chainId]: [positionData] },
            totalValue: positionData.value,
            totalEarnings: positionEarnings,
          })
      })
    }

    if (chainInfo.pools.length > 0) {
      chainInfo.pools.forEach((pool) => {
        const product = products.find((p) => p.type === 'pools')

        const positionData = poolToPosition(pool)
        const positionEarnings = positionData.rewardBalance * positionData.rewardToken.price

        if (product) {
          product.chainData[chainInfo.chainId]
            ? product.chainData[chainInfo.chainId].push(positionData)
            : (product.chainData[chainInfo.chainId] = [positionData])

          product.totalValue += positionData.value
          product.totalEarnings += positionEarnings
        } else
          products.push({
            type: 'pools',
            chainData: {
              [chainInfo.chainId]: [positionData],
            },
            totalValue: positionData.value,
            totalEarnings: positionEarnings,
          })
      })
    }

    if (chainInfo.jungleFarms.length > 0) {
      chainInfo.jungleFarms.forEach((farm) => {
        const product = products.find((p) => p.type === 'jungleFarms')

        const positionData = jungleToPosition(farm)
        const positionEarnings = positionData.rewardBalance * positionData.rewardToken.price

        if (product) {
          product.chainData[chainInfo.chainId]
            ? product.chainData[chainInfo.chainId].push(positionData)
            : (product.chainData[chainInfo.chainId] = [positionData])

          product.totalValue += positionData.value
          product.totalEarnings += positionEarnings
        } else
          products.push({
            type: 'jungleFarms',
            chainData: {
              [chainInfo.chainId]: [positionData],
            },
            totalValue: positionData.value,
            totalEarnings: positionEarnings,
          })
      })
    }

    if (chainInfo.lending.markets.length > 0) {
      chainInfo.lending.markets.forEach((lending) => {
        const product = products.find((p) => p.type === 'lending')

        const positionData = lendingToPosition(lending)

        if (product) {
          product.chainData[chainInfo.chainId]
            ? product.chainData[chainInfo.chainId].push(positionData)
            : (product.chainData[chainInfo.chainId] = [positionData])

          product.totalValue += positionData.value
        } else
          products.push({
            type: 'lending',
            chainData: {
              [chainInfo.chainId]: [positionData],
            },
            totalValue: positionData.value,
            totalEarnings: chainInfo.lending.earnedBalance * bananaPrice,
          })
      })
    }

    if (chainInfo.maximizers.length > 0) {
      chainInfo.maximizers.forEach((vault) => {
        const product = products.find((p) => p.type === 'maximizers')

        const positionData = maximizerToPosition(vault)
        const positionEarnings = positionData.rewardBalance * bananaPrice

        if (product) {
          product.chainData[chainInfo.chainId]
            ? product.chainData[chainInfo.chainId].push(positionData)
            : (product.chainData[chainInfo.chainId] = [positionData])

          product.totalValue += positionData.value
          product.totalEarnings += positionEarnings
        } else
          products.push({
            type: 'maximizers',
            chainData: {
              [chainInfo.chainId]: [positionData],
            },
            totalValue: positionData.value,
            totalEarnings: positionData.rewardBalance * bananaPrice,
          })
      })
    }

    if (chainInfo.bills?.length > 0) {
      chainInfo.bills.forEach((bill) => {
        const product = products.find((p) => p.type === 'bills')

        const positionData = billToPosition(bill)
        const positionEarnings = positionData.rewardBalance * positionData.rewardToken.price

        if (product) {
          product.chainData[chainInfo.chainId]
            ? product.chainData[chainInfo.chainId].push(positionData)
            : (product.chainData[chainInfo.chainId] = [positionData])

          product.totalValue += positionData.value
          product.totalEarnings += positionEarnings
        } else
          products.push({
            type: 'bills',
            chainData: {
              [chainInfo.chainId]: [positionData],
            },
            totalValue: positionData.value,
            totalEarnings: positionEarnings,
          })
      })
    }

    if (chainInfo.iaos?.length > 0) {
      chainInfo.iaos.forEach((iao) => {
        const product = products.find((p) => p.type === 'iaos')

        const positionData = iaoToPosition(iao)
        const positionEarnings = positionData.rewardBalance * positionData.rewardToken.price

        if (product) {
          product.chainData[chainInfo.chainId]
            ? product.chainData[chainInfo.chainId].push(positionData)
            : (product.chainData[chainInfo.chainId] = [positionData])

          product.totalValue += positionData.value
          product.totalEarnings += positionEarnings
        } else
          products.push({
            type: 'iaos',
            chainData: {
              [chainInfo.chainId]: [positionData],
            },
            totalValue: positionData.value,
            totalEarnings: positionEarnings,
          })
      })
    }
  })

  return products
}

export function wrappedToNative(symbol: string) {
  if (symbol.includes('WBNB')) return symbol.replace('WBNB', 'BNB')

  if (symbol.includes('WETH')) return symbol.replace('WETH', 'ETH')

  if (symbol.includes('WMATIC')) return symbol.replace('WMATIC', 'MATIC')

  if (symbol.includes('eLunr')) return symbol.replace('eLunr', 'LUNR')

  if (symbol.includes('BTCB')) return symbol.replace('BTCB', 'BTC')

  return symbol
}
