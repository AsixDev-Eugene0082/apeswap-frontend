import { useCallback } from 'react'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import billAbi from 'config/abi/bill.json'
import { userClaimBill } from 'utils/callHelpers'
import { getContract } from 'utils'
import { Bill } from 'config/abi/types'
import track from 'utils/track'
import { useBillTypes } from './useBillType'

// Claim a Bill
const useClaimBill = (billMap: { billAddress: string; billIds: string[] }[]) => {
  const { account, library, chainId } = useActiveWeb3React()
  const billAddresses = billMap.map((b) => {
    return b.billAddress
  })
  const billTypes: string[] = useBillTypes(billAddresses)
  const handleClaimBill = useCallback(async () => {
    const billTrxs = billMap.map(async (bm, i) => {
      const billContract = getContract(bm.billAddress, billAbi, library, account) as Bill
      track({
        event: billTypes[i],
        chain: chainId,
        data: {
          cat: 'claimAll',
          address: bm.billAddress,
          billIds: bm.billIds,
          bills: billMap,
        },
      })
      return userClaimBill(billContract, bm.billIds)
    })
    return Promise.all(billTrxs)
  }, [billMap, billTypes, library, chainId, account])

  return { onClaimBill: handleClaimBill }
}

export default useClaimBill
