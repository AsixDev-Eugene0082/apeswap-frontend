import getTimePeriods from 'utils/getTimePeriods'
import { ApiResponse } from '../types'
import { wrappedToNative } from './rawToPortfolio'

export interface NftInfo {
  type: 'NFA' | 'NFB' | 'Bill'
  id: number
  name: string
  imageUrl: string
  rarityRank?: number
  rarityTier?: number
  billType?: 'Banana' | 'Jungle'
  billValue?: number
  timeRemaining?: string
  tokens?: {
    token1: string
    token2: string
    token3: string
  }
}

export function rawToNfts({ userHoldings, userStats }: ApiResponse) {
  const nfts: NftInfo[] = [...userHoldings.nfts]

  userStats.forEach((chain) => {
    chain.bills?.forEach((bill) => {
      const timeUntilEnd = bill.vestingTimeRemaining > 0 ? getTimePeriods(bill.vestingTimeRemaining, true) : null

      const tokens = {
        token1: wrappedToNative(bill.purchaseToken.pairData.token0.symbol),
        token2: wrappedToNative(bill.purchaseToken.pairData.token1.symbol),
        token3: wrappedToNative(bill.earnToken.symbol),
      }

      nfts.push({
        name: `${tokens.token1}-${tokens.token2}`,
        id: bill.billId,
        imageUrl: bill.imageUrl,
        type: 'Bill',
        billType: bill.type,
        billValue: bill.totalPayout,
        timeRemaining: timeUntilEnd
          ? `${timeUntilEnd.days}d ${timeUntilEnd.hours}h ${timeUntilEnd.minutes}m`
          : 'FULLY VESTED',
        tokens,
      })
    })
  })

  return nfts
}
