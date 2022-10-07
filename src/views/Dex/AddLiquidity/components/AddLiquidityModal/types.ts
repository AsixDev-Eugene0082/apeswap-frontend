import { Currency, CurrencyAmount, Percent, Price, TokenAmount } from '@ape.swap/sdk'

export interface AddLiquidityModalProps {
  currencies: { CURRENCY_A?: Currency; CURRENCY_B?: Currency }
  liquidityMinted: TokenAmount
  noLiquidity: boolean
  title: string
  price: Price
  poolTokenPercentage: Percent
  txHash: string
  attemptingTxn: boolean
  parsedAmounts: { CURRENCY_A?: CurrencyAmount; CURRENCY_B?: CurrencyAmount }
  onDismiss: () => void
  onAdd: () => void
}
