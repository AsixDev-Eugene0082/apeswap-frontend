import { ChainOption } from '../types'

export * from './rawToPortfolio'
export * from './rawToProjected'

export function mapChain(option: ChainOption) {
  switch (option) {
    case 'bnb':
      return 56

    case 'polygon':
      return 137

    default:
      return null
  }
}

export const initialStatsData = {
  userHoldings: {
    nfts: [],
    banana: '0',
  },
  userStats: [],
  bananaPrice: 0,
  analytics: {
    tvl: {
      pools: {
        id: 'pools',
        name: 'Pools',
        value: '0',
      },
      farms: {
        id: 'farms',
        name: 'Farms',
        value: '0',
      },
      jungleFarms: {
        id: 'jungleFarms',
        name: 'Jungle Farms',
        value: '0',
      },
      maximizers: {
        id: 'maximizer',
        name: 'Maximizers',
        value: '0',
      },
      lending: {
        id: 'lending',
        name: 'Lending',
        value: '0',
      },
      total: '0',
    },
    assets: {
      breakdown: [],
      totalWalletHoldings: 0,
    },
  },
}
