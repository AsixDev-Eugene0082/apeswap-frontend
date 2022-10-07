import { Token, TokenAmount } from '@ape.swap/sdk'
import { useMemo } from 'react'
import { useSingleCallResult } from 'lib/hooks/multicall'

import { useTokenContract } from './useContract'

function useTokenAllowance(token?: Token, owner?: string, spender?: string): TokenAmount | undefined {
  const contract = useTokenContract(token?.address, false)

  const inputs = useMemo(() => [owner, spender], [owner, spender])
  const allowance = useSingleCallResult(contract, 'allowance', inputs).result

  return useMemo(
    () => (token && allowance ? new TokenAmount(token, allowance.toString()) : undefined),
    [token, allowance],
  )
}

export default useTokenAllowance
