import { wrappedToNative } from '.'
import { Bill, DualFarm, Farm, Iao, Lending, Pool, Position, Vault } from '../types'

const NFTY2_ADDRESS = '0x8623e66bea0dce41b6d47f9c44e806a115babae0'

export const farmToPosition = (farm: Farm | DualFarm): Position => {
  const isNFTY2 = farm.stakedToken.pairData?.token1.address.toLowerCase() === NFTY2_ADDRESS
  const isDualFarm = 'earnTokens' in farm
  const isDualEarnings = isDualFarm && farm.earnTokens.token2

  const tokens = {
    token1: wrappedToNative(farm.stakedToken.pairData?.token0.symbol),
    token2: wrappedToNative(isNFTY2 ? 'NFTY2' : farm.stakedToken.pairData?.token1.symbol),
    token3: isDualFarm ? wrappedToNative(farm.earnTokens.token1.symbol) : 'BANANA',
    token4: isDualEarnings ? wrappedToNative(isNFTY2 ? 'NFTY2' : farm.earnTokens.token2.symbol) : null,
  }

  return {
    id: farm.pid,
    title: isNFTY2 ? `${tokens.token1}-NFTY` : `${tokens.token1}-${tokens.token2}`,
    stakedToken: farm.stakedToken,
    balance: +farm.stakedBalance,
    value: +farm.stakedBalance * farm.stakedToken.price,
    rewardBalance: isDualFarm ? +farm.earnedBalances.balance1 : +farm.earnedBalance,
    secondaryRewardBalance: isDualEarnings ? +farm.earnedBalances.balance2 : null,
    secondaryRewardValue: isDualEarnings ? +farm.earnedBalances.balance2 * farm.earnTokens.token2.price : null,
    apr: isDualFarm ? +farm.earnApr.toFixed(2) : +(+farm.bananaApr).toFixed(2),
    tokens,
    isLp: true,
  }
}

export const poolToPosition = (pool: Pool): Position => {
  const isNFTY2 = pool.earnToken.address === NFTY2_ADDRESS

  const tokens = {
    token1: wrappedToNative(pool.stakedToken.symbol),
    token2: wrappedToNative(isNFTY2 ? 'NFTY2' : pool.earnToken.symbol),
  }

  return {
    id: pool.sousId,
    title: isNFTY2 ? 'NFTY' : tokens.token2,
    stakedToken: pool.stakedToken,
    balance: +pool.stakedBalance,
    value: +pool.stakedBalance * pool.stakedToken.price,
    rewardToken: pool.earnToken,
    rewardBalance: +pool.earnedBalance,
    apr: +parseFloat(pool.apr).toFixed(2),
    tokens,
  }
}

export const jungleToPosition = (jungleFarm: Pool): Position => {
  const tokens = {
    token1: wrappedToNative(jungleFarm.stakedToken.pairData?.token0.symbol),
    token2: wrappedToNative(jungleFarm.stakedToken.pairData?.token1.symbol),
    token3: wrappedToNative(jungleFarm.earnToken.symbol),
  }

  return {
    id: jungleFarm.sousId,
    title: `${tokens.token1}-${tokens.token2}`,
    stakedToken: jungleFarm.stakedToken,
    balance: +jungleFarm.stakedBalance,
    value: +jungleFarm.stakedBalance * jungleFarm.stakedToken.price,
    rewardBalance: +jungleFarm.earnedBalance,
    rewardToken: jungleFarm.earnToken,
    apr: +parseFloat(jungleFarm.apr).toFixed(2),
    tokens,
    isLp: true,
  }
}

export const lendingToPosition = (lending: Lending): Position => {
  const tokens = {
    token1: wrappedToNative(lending.token.symbol.toUpperCase()),
  }

  return {
    id: lending.token.symbol,
    title: tokens.token1,
    stakedToken: lending.token,
    supplyBalance: lending.supplyBalance,
    borrowBalance: lending.borrowBalance,
    value: lending.supplyBalance * lending.token.price,
    rewardBalance: 0,
    supplyApy: +lending.supplyApy.toFixed(2),
    borrowApy: +lending.borrowApy.toFixed(2),
    tokens,
  }
}

export const maximizerToPosition = (vault: Vault): Position => {
  let tokens

  if (vault.stakedToken.isLp)
    tokens = {
      token1: wrappedToNative(vault.stakedToken.pairData?.token0.symbol),
      token2: wrappedToNative(vault.stakedToken.pairData?.token1.symbol),
      token3: 'BANANA',
    }
  else tokens = { token1: 'BANANA', token2: 'BANANA' }

  return {
    id: vault.id,
    title: `${tokens.token1}-${tokens.token2}`,
    stakedToken: vault.stakedToken,
    balance: +vault.stakedBalance,
    value: +vault.stakedBalance * vault.stakedToken.price,
    rewardBalance: vault.stakedToken.isLp ? +vault.earnedBalance : 0,
    apr: +parseFloat(vault.apy.yearly).toFixed(2),
    tokens,
    isLp: vault.stakedToken.isLp,
    isAuto: !vault.stakedToken.isLp,
  }
}

export const billToPosition = (bill: Bill): Position => {
  const tokens = {
    token1: wrappedToNative(bill.purchaseToken.pairData.token0.symbol),
    token2: wrappedToNative(bill.purchaseToken.pairData.token1.symbol),
    token3: wrappedToNative(bill.earnToken.symbol),
  }

  return {
    id: bill.billId,
    title: `${tokens.token1}-${tokens.token2}`,
    stakedToken: bill.purchaseToken,
    rewardToken: bill.earnToken,
    rewardBalance: bill.earnedBalance,
    value: bill.vestingBalance,
    pendingVesting: bill.pending,
    totalPayout: bill.totalPayout,
    vestingTimeRemaining: bill.vestingTimeRemaining,
    tokens,
    isLp: true,
  }
}

export const iaoToPosition = (iao: Iao): Position => {
  const tokens = {
    token1: iao.type,
    token2: wrappedToNative(iao.earnToken.symbol),
  }

  return {
    id: iao.id,
    title: tokens.token2,
    rewardToken: iao.earnToken,
    rewardBalance: iao.earnedBalance,
    value: iao.vestingBalance,
    pendingVesting: iao.pending,
    totalPayout: iao.totalOffering,
    vestingTimeRemaining: iao.vestingTimeRemaining,
    tokens,
  }
}
