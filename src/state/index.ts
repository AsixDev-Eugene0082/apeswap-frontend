import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query/react'
import { load, save } from 'redux-localstorage-simple'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import reducer from './reducer'
import updateVersion from './global/actions'

const PERSISTED_KEYS: string[] = ['user', 'transactions', 'lists']

const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware({ thunk: true }).concat(save({ states: PERSISTED_KEYS, debounce: 1000 })),
  ],
  preloadedState: load({ states: PERSISTED_KEYS }),
})

store.dispatch(updateVersion())

setupListeners(store.dispatch)

export type AppState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch()
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector

export default store
