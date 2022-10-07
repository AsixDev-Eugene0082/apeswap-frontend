import { SmartRouter } from '@ape.swap/sdk'
import { createReducer } from '@reduxjs/toolkit'
import { RouterTypes } from 'config/constants'
import {
  Field,
  replaceSwapState,
  selectCurrency,
  setBestRoute,
  setRecipient,
  setSwapDelay,
  SwapDelay,
  switchCurrencies,
  typeInput,
  RouterTypeParams,
} from './actions'

export interface SwapState {
  readonly independentField: Field
  readonly typedValue: string
  readonly [Field.INPUT]: {
    readonly currencyId: string | undefined
  }
  readonly [Field.OUTPUT]: {
    readonly currencyId: string | undefined
  }
  // the typed recipient address or ENS name, or null if swap should go to sender
  readonly recipient: string | null
  readonly swapDelay: SwapDelay
  readonly bestRoute: RouterTypeParams
}

const initialState: SwapState = {
  independentField: Field.INPUT,
  typedValue: '',
  [Field.INPUT]: {
    currencyId: '',
  },
  [Field.OUTPUT]: {
    currencyId: '',
  },
  recipient: null,
  swapDelay: SwapDelay.INIT,
  bestRoute: { routerType: RouterTypes.APE, smartRouter: SmartRouter.APE },
}

export default createReducer<SwapState>(initialState, (builder) =>
  builder
    .addCase(
      replaceSwapState,
      (
        state,
        { payload: { typedValue, recipient, field, inputCurrencyId, outputCurrencyId, swapDelay, bestRoute } },
      ) => {
        return {
          [Field.INPUT]: {
            currencyId: inputCurrencyId,
          },
          [Field.OUTPUT]: {
            currencyId: outputCurrencyId,
          },
          independentField: field,
          typedValue,
          recipient,
          swapDelay,
          bestRoute,
        }
      },
    )
    .addCase(selectCurrency, (state, { payload: { currencyId, field } }) => {
      const otherField = field === Field.INPUT ? Field.OUTPUT : Field.INPUT
      if (currencyId === state[otherField].currencyId) {
        // the case where we have to swap the order
        return {
          ...state,
          independentField: state.independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT,
          [field]: { currencyId },
          [otherField]: { currencyId: state[field].currencyId },
        }
      }
      // the normal case
      return {
        ...state,
        [field]: { currencyId },
      }
    })
    .addCase(switchCurrencies, (state) => {
      return {
        ...state,
        independentField: state.independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT,
        [Field.INPUT]: { currencyId: state[Field.OUTPUT].currencyId },
        [Field.OUTPUT]: { currencyId: state[Field.INPUT].currencyId },
      }
    })
    .addCase(typeInput, (state, { payload: { field, typedValue } }) => {
      return {
        ...state,
        independentField: field,
        typedValue,
      }
    })
    .addCase(setRecipient, (state, { payload: { recipient } }) => {
      state.recipient = recipient
    })
    .addCase(setSwapDelay, (state, { payload: { swapDelay } }) => {
      state.swapDelay = swapDelay
    })
    .addCase(setBestRoute, (state, { payload: { bestRoute } }) => {
      state.bestRoute = bestRoute
    }),
)
