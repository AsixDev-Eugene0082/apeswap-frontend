import { useCallback } from 'react'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { userClaimBill } from 'utils/callHelpers'
import { useBillContract } from 'hooks/useContract'
import track from 'utils/track'
import { useBillType } from './useBillType'

// Claim a Bill
const useClaimBill = (billAddress: string, billIds: string[]) => {
  const { chainId } = useActiveWeb3React()
  const billContract = useBillContract(billAddress)
  const billType: string = useBillType(billAddress)
  const handleClaimBill = useCallback(async () => {
    const tx = await userClaimBill(billContract, billIds)
    track({
      event: billType,
      chain: chainId,
      data: {
        cat: 'claim',
        address: billContract.address,
        id: billIds,
      },
    })
    return tx
  }, [billContract, billIds, chainId, billType])

  return { onClaimBill: handleClaimBill, billType }
}

export default useClaimBill
