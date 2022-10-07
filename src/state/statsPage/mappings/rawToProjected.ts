import { ApiResponse } from '../types'

export interface ProjectedData {
  type: 'banana farms' | 'jungle farms' | 'pools' | 'lending' | 'maximizers' | 'total'
  amountStaked: number
  projectedEarnings: {
    daily: number
    weekly: number
    monthly: number
    yearly: number
  }
  roi?: {
    daily: number
    weekly: number
    monthly: number
    yearly: number
  }
}

export function rawToProjected({ userStats, bananaPrice, analytics }: ApiResponse) {
  const projectedProducts: ProjectedData[] = []

  userStats.forEach((chainInfo) => {
    if (chainInfo.farms.length > 0) {
      chainInfo.farms.forEach((farm) => {
        const farmApy = 'earnedBalance' in farm ? parseFloat(farm.bananaApr).toFixed(2) : farm.earnApr.toFixed(2)
        const stakedValue = +farm.stakedBalance * farm.stakedToken.price

        const daily = calculateUsdEarned({ numberOfDays: 1, farmApy, stakedValue, tokenPrice: bananaPrice })
        const weekly = calculateUsdEarned({ numberOfDays: 7, farmApy, stakedValue, tokenPrice: bananaPrice })
        const monthly = calculateUsdEarned({ numberOfDays: 30, farmApy, stakedValue, tokenPrice: bananaPrice })
        const yearly = calculateUsdEarned({ numberOfDays: 365, farmApy, stakedValue, tokenPrice: bananaPrice })

        const projectedProduct = projectedProducts.find((product) => product.type === 'banana farms')

        if (projectedProduct) {
          projectedProduct.projectedEarnings.daily += daily
          projectedProduct.projectedEarnings.weekly += weekly
          projectedProduct.projectedEarnings.monthly += monthly
          projectedProduct.projectedEarnings.yearly += yearly
        } else {
          projectedProducts.push({
            type: 'banana farms',
            projectedEarnings: { daily, weekly, monthly, yearly },
            amountStaked: +analytics.tvl.farms.value,
          })
        }
      })
    }

    if (chainInfo.pools.length > 0) {
      chainInfo.pools.forEach((pool) => {
        const stakedValue = +pool.stakedBalance * pool.stakedToken.price

        const daily = calculateUsdEarned({
          numberOfDays: 1,
          farmApy: pool.apr,
          stakedValue,
          tokenPrice: pool.earnToken.price,
        })
        const weekly = calculateUsdEarned({
          numberOfDays: 7,
          farmApy: pool.apr,
          stakedValue,
          tokenPrice: pool.earnToken.price,
        })
        const monthly = calculateUsdEarned({
          numberOfDays: 30,
          farmApy: pool.apr,
          stakedValue,
          tokenPrice: pool.earnToken.price,
        })
        const yearly = calculateUsdEarned({
          numberOfDays: 365,
          farmApy: pool.apr,
          stakedValue,
          tokenPrice: pool.earnToken.price,
        })

        const projectedProduct = projectedProducts.find((product) => product.type === 'pools')

        if (projectedProduct) {
          projectedProduct.projectedEarnings.daily += daily
          projectedProduct.projectedEarnings.weekly += weekly
          projectedProduct.projectedEarnings.monthly += monthly
          projectedProduct.projectedEarnings.yearly += yearly
        } else {
          projectedProducts.push({
            type: 'pools',
            projectedEarnings: { daily, weekly, monthly, yearly },
            amountStaked: +analytics.tvl.pools.value,
          })
        }
      })
    }

    if (chainInfo.jungleFarms.length > 0) {
      chainInfo.jungleFarms.forEach((farm) => {
        const stakedValue = +farm.stakedBalance * farm.stakedToken.price

        const daily = calculateUsdEarned({
          numberOfDays: 1,
          farmApy: farm.apr,
          stakedValue,
          tokenPrice: farm.earnToken.price,
        })
        const weekly = calculateUsdEarned({
          numberOfDays: 7,
          farmApy: farm.apr,
          stakedValue,
          tokenPrice: farm.earnToken.price,
        })
        const monthly = calculateUsdEarned({
          numberOfDays: 30,
          farmApy: farm.apr,
          stakedValue,
          tokenPrice: farm.earnToken.price,
        })
        const yearly = calculateUsdEarned({
          numberOfDays: 365,
          farmApy: farm.apr,
          stakedValue,
          tokenPrice: farm.earnToken.price,
        })

        const projectedProduct = projectedProducts.find((product) => product.type === 'jungle farms')

        if (projectedProduct) {
          projectedProduct.projectedEarnings.daily += daily
          projectedProduct.projectedEarnings.weekly += weekly
          projectedProduct.projectedEarnings.monthly += monthly
          projectedProduct.projectedEarnings.yearly += yearly
        } else {
          projectedProducts.push({
            type: 'jungle farms',
            projectedEarnings: { daily, weekly, monthly, yearly },
            amountStaked: +analytics.tvl.jungleFarms.value,
          })
        }
      })
    }

    if (chainInfo.lending.markets.length > 0) {
      chainInfo.lending.markets.forEach((market) => {
        const stakedValue = market.supplyBalance * market.token.price

        const daily = calculateUsdEarned({
          numberOfDays: 1,
          farmApy: market.supplyApy,
          stakedValue,
          tokenPrice: bananaPrice,
        })
        const weekly = calculateUsdEarned({
          numberOfDays: 7,
          farmApy: market.supplyApy,
          stakedValue,
          tokenPrice: bananaPrice,
        })
        const monthly = calculateUsdEarned({
          numberOfDays: 30,
          farmApy: market.supplyApy,
          stakedValue,
          tokenPrice: bananaPrice,
        })
        const yearly = calculateUsdEarned({
          numberOfDays: 365,
          farmApy: market.supplyApy,
          stakedValue,
          tokenPrice: bananaPrice,
        })

        const projectedProduct = projectedProducts.find((product) => product.type === 'lending')

        if (projectedProduct) {
          projectedProduct.projectedEarnings.daily += daily
          projectedProduct.projectedEarnings.weekly += weekly
          projectedProduct.projectedEarnings.monthly += monthly
          projectedProduct.projectedEarnings.yearly += yearly
        } else {
          projectedProducts.push({
            type: 'lending',
            projectedEarnings: { daily, weekly, monthly, yearly },
            amountStaked: +analytics.tvl.lending.value,
          })
        }
      })
    }

    if (chainInfo.maximizers.length > 0) {
      chainInfo.maximizers.forEach((vault) => {
        const stakedValue = +vault.stakedBalance * vault.stakedToken.price

        const daily = calculateUsdEarned({
          numberOfDays: 1,
          farmApy: vault.apy.yearly,
          stakedValue,
          tokenPrice: bananaPrice,
        })
        const weekly = calculateUsdEarned({
          numberOfDays: 7,
          farmApy: vault.apy.yearly,
          stakedValue,
          tokenPrice: bananaPrice,
        })
        const monthly = calculateUsdEarned({
          numberOfDays: 30,
          farmApy: vault.apy.yearly,
          stakedValue,
          tokenPrice: bananaPrice,
        })
        const yearly = calculateUsdEarned({
          numberOfDays: 365,
          farmApy: vault.apy.yearly,
          stakedValue,
          tokenPrice: bananaPrice,
        })

        const projectedProduct = projectedProducts.find((product) => product.type === 'maximizers')

        if (projectedProduct) {
          projectedProduct.projectedEarnings.daily += daily
          projectedProduct.projectedEarnings.weekly += weekly
          projectedProduct.projectedEarnings.monthly += monthly
          projectedProduct.projectedEarnings.yearly += yearly
        } else {
          projectedProducts.push({
            type: 'maximizers',
            projectedEarnings: { daily, weekly, monthly, yearly },
            amountStaked: +analytics.tvl.maximizers.value,
          })
        }
      })
    }
  })

  projectedProducts.push({
    type: 'total',
    amountStaked: +analytics.tvl.total,
    projectedEarnings: projectedProducts.reduce(
      (acc, curr) => ({
        daily: acc.daily + curr.projectedEarnings.daily,
        weekly: acc.weekly + curr.projectedEarnings.weekly,
        monthly: acc.monthly + curr.projectedEarnings.monthly,
        yearly: acc.yearly + curr.projectedEarnings.yearly,
      }),
      {
        daily: 0,
        weekly: 0,
        monthly: 0,
        yearly: 0,
      },
    ),
  })

  return projectedProducts.map((product) => ({
    ...product,
    roi: {
      daily: calculateRoi({
        amountEarned: product.amountStaked + product.projectedEarnings.daily,
        amountInvested: product.amountStaked,
      }),
      weekly: calculateRoi({
        amountEarned: product.amountStaked + product.projectedEarnings.weekly,
        amountInvested: product.amountStaked,
      }),
      monthly: calculateRoi({
        amountEarned: product.amountStaked + product.projectedEarnings.monthly,
        amountInvested: product.amountStaked,
      }),
      yearly: calculateRoi({
        amountEarned: product.amountStaked + product.projectedEarnings.yearly,
        amountInvested: product.amountStaked,
      }),
    },
  }))
}

export function calculateRoi({ amountEarned, amountInvested }) {
  const percentage = (amountEarned / amountInvested - 1) * 100
  return percentage
}

function calculateUsdEarned({ numberOfDays, farmApy, stakedValue, tokenPrice }) {
  if (farmApy < 1e-5) return 0

  const timesCompounded = 365
  const daysAsDecimalOfYear = numberOfDays / timesCompounded
  const apyAsDecimal = farmApy / 100

  const initialAmount = stakedValue / tokenPrice

  const finalAmount = initialAmount * (1 + apyAsDecimal / timesCompounded) ** (timesCompounded * daysAsDecimalOfYear)

  return (finalAmount - initialAmount) * tokenPrice
}
