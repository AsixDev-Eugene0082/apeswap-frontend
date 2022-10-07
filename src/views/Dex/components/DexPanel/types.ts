import { Currency, Pair, SmartRouter } from '@ape.swap/sdk'
import { Field } from 'state/swap/actions'
import { Field as MintField } from 'state/mint/actions'
import { Field as BurnField } from 'state/burn/actions'

export interface DexPanelProps {
  value: string
  currency: Currency
  otherCurrency: Currency
  panelText: string
  // Using any for field type to use the same functions for both swap and liqudity
  onCurrencySelect: (field: any, currency: Currency, typedValue?: string) => void
  onUserInput: (field: any, val: string) => void
  handleMaxInput?: (field: any) => void
  setTradeValueUsd?: (val: number) => void
  fieldType?: Field | MintField | BurnField
  smartRouter?: SmartRouter
  showCommonBases?: boolean
  lpPair?: Pair
  disabled?: boolean
  ordersDisabled?: boolean
  independentField?: Field
  disableTokenSelect?: boolean
  isZapInput?: boolean
}
