export interface ApiResponse {
  userStats: UserChainInfo[]
  userHoldings: {
    nfts: Nft[]
    banana: string // the number of BANANA this user has across all chains
  }
  bananaPrice: number
  analytics: {
    tvl: IReducedTVLInfo
    assets: {
      breakdown: IAssetBreakdown[]
      totalWalletHoldings: number
    }
  }
}

export interface IAssetBreakdown {
  address: string
  chain: number
  balance: string
  price: number
  amount: string
  symbol: string
}

export interface IReducedTVLInfo {
  pools: ITVLBreakdownInfo
  farms: ITVLBreakdownInfo
  jungleFarms: ITVLBreakdownInfo
  maximizers: ITVLBreakdownInfo
  lending: ITVLBreakdownInfo
  total: string
}

export interface ITVLBreakdownInfo {
  id: string
  name: string
  value: string
}

export interface UserChainInfo {
  chainId: number
  farms: Array<Farm | DualFarm>
  pools: Pool[]
  vaults: Vault[]
  maximizers: Vault[]
  jungleFarms: Pool[]
  lending: LendingInfo

  // Additional variables to be added post-beta launch
  bills?: Bill[]
  iaos?: Iao[]
}

export interface Farm {
  pid: number
  stakedToken: Token
  stakedBalance: string
  earnToken: Token
  earnedBalance: string
  bananaApr: string
}

export interface DualFarm {
  pid: number
  stakedToken: Token
  stakedBalance: string
  earnTokens: {
    token1: Token
    token2?: Token
  }
  earnedBalances: {
    balance1: string
    balance2?: string
  }
  earnApr: number
}

export interface Pool {
  sousId: number
  stakedToken: Token
  stakedBalance: string
  earnToken: Token
  apr: string
  earnedBalance: string
}

export interface Vault {
  id: number
  stakedToken: Token
  stakedBalance: string
  earnedBalance?: string
  apy: {
    daily: string
    yearly: string
  }
}

export interface LendingInfo {
  markets: Lending[]
  earnedBalance: number
}

export interface Lending {
  token: Token
  lendingMarketAddress: string
  supplyBalance: number
  borrowBalance: number
  supplyApy: number
  borrowApy: number
}

export interface Bill extends Vesting {
  billId: number // NFT ID
  purchaseToken: Token
  earnToken: Token
  totalPayout: number
  imageUrl: string
  type: 'Banana' | 'Jungle'
}

export interface Iao extends Vesting {
  id: number
  type: 'BNB' | 'GNANA'
  earnToken: Token
  totalOffering: number
}

export interface Nft {
  type: 'NFA' | 'NFB'
  id: number
  name: string | undefined
  rarityRank?: number
  rarityTier?: number
  imageUrl: string
}

export interface Token {
  name: string
  symbol: string
  address: string
  price: number
  isLp: boolean
  pairData?: {
    token0: Omit<Token, 'price'>
    token1: Omit<Token, 'price'>
  }
}

export interface Vesting {
  earnedBalance: number
  vestingBalance: number
  totalVestingTime: number
  vestingTimeRemaining: number
  pending: number
}

export interface Position {
  id: number | string
  stakedToken?: Token
  balance?: number
  value: number
  title: string
  rewardBalance?: number
  secondaryRewardBalance?: number
  secondaryRewardValue?: number
  rewardToken?: Token
  apr?: number
  supplyBalance?: number
  borrowBalance?: number
  supplyApy?: number
  borrowApy?: number
  pendingVesting?: number
  totalPayout?: number
  vestingTimeRemaining?: number
  tokens: {
    token1: string
    token2?: string
    token3?: string
    token4?: string
  }
  isLp?: boolean
  isAuto?: boolean
}

export type Chain = 56 | 137

export type ChainOption = 'all' | 'bnb' | 'polygon'
