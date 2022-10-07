import { BigNumber } from '@ethersproject/bignumber'
import { Contract } from '@ethersproject/contracts'
import {
  JSBI,
  Percent,
  Router,
  BonusRouter,
  SwapParameters,
  Trade,
  TradeType,
  SMART_ROUTER_ADDRESS,
} from '@ape.swap/sdk'
import { useMemo } from 'react'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import truncateHash from 'utils/truncateHash'
import { useTranslation } from 'contexts/Localization'
import { RouterTypeParams } from 'state/swap/actions'
import { BIPS_BASE, INITIAL_ALLOWED_SLIPPAGE, RouterTypes } from '../config/constants'
import { useTransactionAdder } from '../state/transactions/hooks'
import { calculateGasMargin, getRouterContract, isAddress } from '../utils'
import isZero from '../utils/isZero'
import useTransactionDeadline from './useTransactionDeadline'
import useENS from './ENS/useENS'
import { parseSmartAddress } from './useAddress'

export enum SwapCallbackState {
  INVALID,
  LOADING,
  VALID,
}

export enum SwapDelayState {
  INVALID,
  INPUT_DELAY,
  LOADING_ROUTE,
  VALID,
}

export interface SwapCall {
  contract: Contract
  parameters: SwapParameters
}

export interface SuccessfulCall {
  call: SwapCall
  gasEstimate: BigNumber
}

export interface FailedCall {
  call: SwapCall
  error: Error
}

export type EstimatedSwapCall = SuccessfulCall | FailedCall

/**
 * Returns the swap calls that can be used to make the trade
 * @param trade trade to execute
 * @param allowedSlippage user allowed slippage
 * @param recipientAddressOrName
 * @param bestRoute The best route that will be used to facilitate the trade
 * @param executedSwap To be able to correctly differentiate between a executed swap vs a bonus check we need this flag
 */
export function useSwapCallArguments(
  trade: Trade | undefined, // trade to execute, required
  allowedSlippage: number = INITIAL_ALLOWED_SLIPPAGE, // in bips
  recipientAddressOrName: string | null, // the ENS name or address of the recipient of the trade, or null if swap should be returned to sender
  bestRoute?: RouterTypeParams, // The best route that will be used to facilitate the trade
  executedSwap = true, // To be able to correctly differentiate between a executed swap vs a bonus check we need this flag
): SwapCall[] {
  const { account, chainId, library } = useActiveWeb3React()
  // Allowing transactions to be encoded even if no user is connected
  const activeAccount = account || '0x0000000000000000000000000000000000000000'
  const { address: recipientAddress } = useENS(recipientAddressOrName)
  const recipient = recipientAddressOrName === null ? activeAccount : recipientAddress
  const deadline = useTransactionDeadline()

  return useMemo(() => {
    if (!trade || !recipient || !library || !chainId || !activeAccount || !deadline) return []

    const contract: Contract | null = getRouterContract(
      chainId,
      library,
      activeAccount,
      bestRoute?.routerType,
      bestRoute?.smartRouter,
      executedSwap,
    )
    if (!contract) {
      return []
    }

    const swapMethods = []

    if (bestRoute?.routerType === RouterTypes.BONUS && executedSwap) {
      swapMethods.push(
        BonusRouter.swapCallParameters(trade, {
          allowedSlippage: new Percent(JSBI.BigInt(allowedSlippage), BIPS_BASE),
          recipient,
          deadline: deadline.toNumber(),
          router: parseSmartAddress(SMART_ROUTER_ADDRESS, chainId, bestRoute.smartRouter),
          masterInput: bestRoute?.bonusRouter.transactionArgs.masterInput,
        }),
      )
      if (trade.tradeType === TradeType.EXACT_INPUT) {
        swapMethods.push(
          BonusRouter.swapCallParameters(trade, {
            allowedSlippage: new Percent(JSBI.BigInt(allowedSlippage), BIPS_BASE),
            recipient,
            deadline: deadline.toNumber(),
            router: parseSmartAddress(SMART_ROUTER_ADDRESS, chainId, bestRoute.smartRouter),
            masterInput: bestRoute?.bonusRouter.transactionArgs.masterInput,
          }),
        )
      }
    } else {
      swapMethods.push(
        Router.swapCallParameters(trade, {
          feeOnTransfer: false,
          allowedSlippage: new Percent(JSBI.BigInt(allowedSlippage), BIPS_BASE),
          recipient,
          deadline: deadline.toNumber(),
        }),
      )
      if (trade.tradeType === TradeType.EXACT_INPUT) {
        swapMethods.push(
          Router.swapCallParameters(trade, {
            feeOnTransfer: true,
            allowedSlippage: new Percent(JSBI.BigInt(allowedSlippage), BIPS_BASE),
            recipient,
            deadline: deadline.toNumber(),
          }),
        )
      }
    }

    return swapMethods.map((parameters) => ({ parameters, contract }))
  }, [activeAccount, allowedSlippage, chainId, deadline, library, recipient, bestRoute, trade, executedSwap])
}

// returns a function that will execute a swap, if the parameters are all valid
// and the user has approved the slippage adjusted input amount for the trade
export function useSwapCallback(
  trade: Trade | undefined, // trade to execute, required
  allowedSlippage: number = INITIAL_ALLOWED_SLIPPAGE, // in bips
  recipientAddressOrName: string | null, // the ENS name or address of the recipient of the trade, or null if swap should be returned to sender
  bestRoute?: RouterTypeParams, // The best route that will be used to facilitate the trade
): { state: SwapCallbackState; callback: null | (() => Promise<string>); error: string | null } {
  const { account, chainId, library } = useActiveWeb3React()

  const swapCalls = useSwapCallArguments(trade, allowedSlippage, recipientAddressOrName, bestRoute)

  const addTransaction = useTransactionAdder()

  const { address: recipientAddress } = useENS(recipientAddressOrName)
  const recipient = recipientAddressOrName === null ? account : recipientAddress

  const { t } = useTranslation()

  return useMemo(() => {
    if (!trade || !library || !account || !chainId) {
      return { state: SwapCallbackState.INVALID, callback: null, error: t('Missing dependencies') }
    }
    if (!recipient) {
      if (recipientAddressOrName !== null) {
        return { state: SwapCallbackState.INVALID, callback: null, error: t('Invalid recipient') }
      }
      return { state: SwapCallbackState.LOADING, callback: null, error: null }
    }

    return {
      state: SwapCallbackState.VALID,
      callback: async function onSwap(): Promise<string> {
        const estimatedCalls: EstimatedSwapCall[] = await Promise.all(
          swapCalls.map((call) => {
            const {
              parameters: { methodName, args, value },
              contract,
            } = call
            const options = !value || isZero(value) ? {} : { value }
            return contract.estimateGas[methodName](...args, options)
              .then((gasEstimate) => {
                return {
                  call,
                  gasEstimate:
                    bestRoute?.routerType === RouterTypes.BONUS ? gasEstimate.mul(BigNumber.from('3')) : gasEstimate,
                }
              })
              .catch((gasError) => {
                console.error('Gas estimate failed, trying eth_call to extract error', call)
                return contract.callStatic[methodName](...args, options)
                  .then((result) => {
                    console.error('Unexpected successful call after failed estimate gas', call, gasError, result)
                    return { call, error: new Error(t('Unexpected issue with estimating the gas. Please try again.')) }
                  })
                  .catch((callError) => {
                    console.error('Call threw error', call, callError)
                    const reason: string = callError.reason || callError.data?.message || callError.message
                    const errorMessage = t(
                      `The transaction cannot succeed due to error: ${
                        `${reason}. This is probably an issue with one of the tokens you are swapping` ??
                        'Unknown error, check the logs'
                      }.`,
                    )
                    return { call, error: new Error(errorMessage) }
                  })
              })
          }),
        )

        // a successful estimation is a bignumber gas estimate and the next call is also a bignumber gas estimate
        const successfulEstimation = estimatedCalls.find(
          (el, ix, list): el is SuccessfulCall =>
            'gasEstimate' in el && (ix === list.length - 1 || 'gasEstimate' in list[ix + 1]),
        )

        if (!successfulEstimation) {
          const errorCalls = estimatedCalls.filter((call): call is FailedCall => 'error' in call)
          if (errorCalls.length > 0) throw errorCalls[errorCalls.length - 1].error
          throw new Error(t('Unexpected error. Please contact support: none of the calls threw an error'))
        }

        const {
          call: {
            contract,
            parameters: { methodName, args, value },
          },
          gasEstimate,
        } = successfulEstimation

        return contract[methodName](...args, {
          gasLimit: calculateGasMargin(gasEstimate),
          ...(value && !isZero(value) ? { value, from: account } : { from: account }),
        })
          .then((response: any) => {
            const inputSymbol = trade.inputAmount.currency.getSymbol(chainId)
            const outputSymbol = trade.outputAmount.currency.getSymbol(chainId)
            const inputAmount = trade.inputAmount.toSignificant(5)
            const outputAmount = trade.outputAmount.toSignificant(5)

            const base = `Swap ${inputAmount} ${inputSymbol} for ${outputAmount} ${outputSymbol}`
            const withRecipient =
              recipient === account
                ? base
                : `${base} to ${
                    recipientAddressOrName && isAddress(recipientAddressOrName)
                      ? truncateHash(recipientAddressOrName)
                      : recipientAddressOrName
                  }`

            addTransaction(response, {
              summary: withRecipient,
            })

            return response.hash
          })
          .catch((error: any) => {
            // if the user rejected the tx, pass this along
            if (error?.code === 4001) {
              throw new Error(t('Transaction rejected.'))
            } else {
              // otherwise, the error was unexpected and we need to convey that
              console.error(`Swap failed`, error, methodName, args, value)
              throw new Error(t(`Swap failed: %message%`, { message: error.message }))
            }
          })
      },
      error: null,
    }
  }, [trade, library, account, chainId, recipient, bestRoute, recipientAddressOrName, swapCalls, addTransaction, t])
}
