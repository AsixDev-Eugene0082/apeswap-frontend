import useActiveWeb3React from 'hooks/useActiveWeb3React'
import multicall from 'lib/state/multicall'
import { SkipFirst } from 'types/tuple'
import useBlockNumber from './useBlockNumber'

export type { CallStateResult } from '@uniswap/redux-multicall' // re-export for convenience
export { NEVER_RELOAD } from '@uniswap/redux-multicall' // re-export for convenience

// Create wrappers for hooks so consumers don't need to get latest block themselves

type SkipFirstTwoParams<T extends (...args: any) => any> = SkipFirst<Parameters<T>, 2>

export function useMultipleContractSingleData(
  ...args: SkipFirstTwoParams<typeof multicall.hooks.useMultipleContractSingleData>
) {
  const { chainId, currentBlock } = useCallContext()
  return multicall.hooks.useMultipleContractSingleData(chainId, currentBlock, ...args)
}

export function useSingleCallResult(...args: SkipFirstTwoParams<typeof multicall.hooks.useSingleCallResult>) {
  const { chainId, currentBlock } = useCallContext()
  return multicall.hooks.useSingleCallResult(chainId, currentBlock, ...args)
}

export function useSingleContractMultipleData(
  ...args: SkipFirstTwoParams<typeof multicall.hooks.useSingleContractMultipleData>
) {
  const { chainId, currentBlock } = useCallContext()
  return multicall.hooks.useSingleContractMultipleData(chainId, currentBlock, ...args)
}

export function useSingleContractWithCallData(
  ...args: SkipFirstTwoParams<typeof multicall.hooks.useSingleContractWithCallData>
) {
  const { chainId, currentBlock } = useCallContext()
  return multicall.hooks.useSingleContractWithCallData(chainId, currentBlock, ...args)
}

function useCallContext() {
  const { chainId } = useActiveWeb3React()
  const currentBlock = useBlockNumber()
  return { chainId, currentBlock }
}
