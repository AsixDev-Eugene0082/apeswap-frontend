import { Currency, CurrencyAmount, Percent, Price, TokenAmount } from '@ape.swap/sdk'

export interface AddLiquidityActionsProps {
  currencies: { CURRENCY_A?: Currency; CURRENCY_B?: Currency }
  parsedAmounts: { CURRENCY_A?: CurrencyAmount; CURRENCY_B?: CurrencyAmount }
  error: string
  noLiquidity: boolean
  tradeValueUsd: number
  price: Price
  poolTokenPercentage: Percent
  liquidityMinted: TokenAmount
}
