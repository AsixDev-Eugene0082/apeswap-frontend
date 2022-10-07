export interface OverviewTvlInterface {
  farms: number
  jungle: number
  lending: number
  maximizers: number
  pools: number
}

export interface OverviewVolumeInterface {
  description: string
  history: { amount: number; time: number }[]
}

export interface OverviewProtocolMetricsInterface {
  description: 'Banana Holders' | 'Market Cap' | 'Banana Burned' | 'POL'
  amount: number
  history: { amount: number; time: number }[]
}

export interface OverviewBananaDistributionInterface {
  total: number
  distribution: { description: string; amount: number }[]
}

export interface TreasuryAssetOverviewInterface {
  amount: number
  location: 'Operational Funds' | 'POL'
  price: number
  symbol: string
  value: number
}

export interface TreasuryHistoryInterface {
  timestamp: number
  polValue: number
  apePolValue: number
  partnerPolValue: number
  oppFundValue: number
}

export interface ProtocolToken {
  symbol: string
  address: string
  amount: number
  chainId: number
  location: 'Operational Funds' | 'POL'
  value: number
}

export interface TreasuryBreakdownInterface {
  lpTokens: {
    address: string
    type: 'apeswap' | 'partner'
    amount: number
    chainId: number
    location: 'Operational Funds' | 'POL'
    token0: ProtocolToken
    token1: ProtocolToken
    value: number
  }[]
  tokens: ProtocolToken[]
  value: number
  valueOperational: number
  valuePol: number
}

export interface OverviewMcapTvlRatioInterface {
  timestamp: number
  ratio: number
}

export interface ProtocolDashboardState {
  overviewTvl: OverviewTvlInterface
  overviewVolume: OverviewVolumeInterface[]
  overviewProtocolMetrics: OverviewProtocolMetricsInterface[]
  overviewBananaDistribution: OverviewBananaDistributionInterface[]
  overviewMcapTvlRatio: OverviewMcapTvlRatioInterface[]
  treasuryAssetOverview: TreasuryAssetOverviewInterface[]
  treasuryHistory: TreasuryHistoryInterface[]
  treasuryBreakdown: TreasuryBreakdownInterface
}
