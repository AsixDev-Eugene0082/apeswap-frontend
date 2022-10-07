import { BigNumber } from '@ethersproject/bignumber'
import { getAddress } from '@ethersproject/address'
import { ChainId } from '@ape.swap/sdk'
import { BLOCK_EXPLORER } from 'config/constants/chains'
import { Contract } from '@ethersproject/contracts'
import { AddressZero } from '@ethersproject/constants'
import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers'
import { abi as IUniswapV2Router02ABI } from '@uniswap/v2-periphery/build/IUniswapV2Router02.json'
import apeRouterManagerABI from 'config/abi/apeRouterManager.json'
import {
  JSBI,
  Percent,
  Token,
  CurrencyAmount,
  Currency,
  ETHER,
  BONUS_ROUTER_ADDRESS,
  SMART_ROUTER_ADDRESS,
  SmartRouter,
} from '@ape.swap/sdk'
import { parseAddress, parseSmartAddress } from 'hooks/useAddress'
import { RouterTypes } from 'config/constants'

export { default as formatAddress } from './formatAddress'

// returns the checksummed address if the address is valid, otherwise returns false
// returns the checksummed address if the address is valid, otherwise returns false
export function isAddress(value: any): string | false {
  try {
    return getAddress(value)
  } catch {
    return false
  }
}

export function getEtherscanLink(
  data: string | number,
  type: 'transaction' | 'token' | 'address' | 'block' | 'countdown',
  chainId: number,
): string {
  switch (type) {
    case 'transaction': {
      return `${BLOCK_EXPLORER[chainId]}/tx/${data}`
    }
    case 'token': {
      return `${BLOCK_EXPLORER[chainId]}/token/${data}`
    }
    case 'block': {
      return `${BLOCK_EXPLORER[chainId]}/block/${data}`
    }
    case 'countdown': {
      return `${BLOCK_EXPLORER[chainId]}/block/countdown/${data}`
    }
    default: {
      return `${BLOCK_EXPLORER[chainId]}/address/${data}`
    }
  }
}

// add 10%
export function calculateGasMargin(value: BigNumber): BigNumber {
  return value.mul(BigNumber.from(10000).add(BigNumber.from(1000))).div(BigNumber.from(10000))
}

// converts a basis points value to a sdk percent
export function basisPointsToPercent(num: number): Percent {
  return new Percent(JSBI.BigInt(num), JSBI.BigInt(10000))
}

export function calculateSlippageAmount(value: CurrencyAmount, slippage: number): [JSBI, JSBI] {
  if (slippage < 0 || slippage > 10000) {
    throw Error(`Unexpected slippage value: ${slippage}`)
  }
  return [
    JSBI.divide(JSBI.multiply(value.raw, JSBI.BigInt(10000 - slippage)), JSBI.BigInt(10000)),
    JSBI.divide(JSBI.multiply(value.raw, JSBI.BigInt(10000 + slippage)), JSBI.BigInt(10000)),
  ]
}

// account is not optional
export function getSigner(library: Web3Provider, account: string): JsonRpcSigner {
  return library.getSigner(account).connectUnchecked()
}

// account is optional
export function getProviderOrSigner(library: Web3Provider, account?: string): Web3Provider | JsonRpcSigner {
  return account ? getSigner(library, account) : library
}

// account is optional
export function getContract(address: string, ABI: any, library: Web3Provider, account?: string): Contract {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }
  return new Contract(address, ABI, getProviderOrSigner(library, account) as any)
}

// COMEBACK TO CHECK
// account is optional
export function getRouterContract(
  _: number,
  library: Web3Provider,
  account?: string,
  routerType?: RouterTypes,
  smartRouter?: SmartRouter,
  executedSwap = true, // To be able to correctly differentiate between a executed swap vs a bonus check we need this flag
): Contract {
  if (routerType === RouterTypes.BONUS && executedSwap) {
    return getContract(
      parseAddress(BONUS_ROUTER_ADDRESS, library.network?.chainId || 56),
      apeRouterManagerABI,
      library,
      account,
    )
  }
  return getContract(
    parseSmartAddress(SMART_ROUTER_ADDRESS, library.network?.chainId || 56, smartRouter || SmartRouter.APE),
    IUniswapV2Router02ABI,
    library,
    account,
  )
}

export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}

export function isTokenOnList(defaultTokens, currency?: Currency): boolean {
  if (currency === ETHER) return true
  return Boolean(currency instanceof Token && defaultTokens[currency.chainId]?.[currency.address])
}

export function wrappedToNative(symbol: string) {
  if (!symbol) return

  if (symbol.includes('WBNB')) return symbol.replace('WBNB', 'BNB')

  if (symbol.includes('WETH')) return symbol.replace('WETH', 'ETH')

  if (symbol.includes('WMATIC')) return symbol.replace('WMATIC', 'MATIC')

  if (symbol.includes('eLunr')) return symbol.replace('eLunr', 'LUNR')

  if (symbol.includes('BTCB')) return symbol.replace('BTCB', 'BTC')

  return symbol
}

export const getLargestNumber = (numsArray: Array<number>) => {
  return numsArray.reduce((prevNum, curNum) => {
    return (curNum > prevNum ? curNum : prevNum) || 0
  })
}

// Show circular modals only in BNB chain
export const showCircular = (chainId: number, history, modalUrl: string) => {
  if (chainId === ChainId.BSC) history.push({ search: modalUrl })
}

// Set circular modalss routes to show only in BNB chain
export const circularRoute = (chainId: number, location, modalUrl: string) => {
  return chainId === ChainId.BSC && location.search.includes(modalUrl)
}
