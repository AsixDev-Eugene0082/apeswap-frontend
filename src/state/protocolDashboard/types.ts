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
  oppFundValue: number
}

interface TreasuryBreakdownInterface {}

export interface ProtocolDashboardState {
  overviewTvl: OverviewTvlInterface
  overviewVolume: OverviewVolumeInterface[]
  overviewProtocolMetrics: OverviewProtocolMetricsInterface[]
  overviewBananaDistribution: OverviewBananaDistributionInterface[]
  treasuryAssetOverview: TreasuryAssetOverviewInterface[]
  treasuryHistory: TreasuryHistoryInterface[]
  treasuryBreakdown: any
}
