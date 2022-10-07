import { createAction } from '@reduxjs/toolkit'

export enum Field {
  INPUT = 'INPUT',
  OUTPUT = 'OUTPUT',
}

export const selectCurrency = createAction<{ field: Field; currencyId: string }>('orders/selectCurrency')
export const switchCurrencies = createAction<void>('orders/switchCurrencies')
export const typeInput = createAction<{ field: Field; typedValue: string }>('orders/typeInput')
export const replaceSwapState = createAction<{
  field: Field
  typedValue: string
  inputCurrencyId?: string
  outputCurrencyId?: string
  recipient: string | null
}>('orders/replaceSwapState')
export const setRecipient = createAction<{ recipient: string | null }>('orders/setRecipient')
