import { useCallback } from 'react'
import { useBillNftContract } from 'hooks/useContract'
import { userTransferBillNft } from 'utils/callHelpers'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import track from 'utils/track'
import { useBillType } from './useBillType'

// Transfer a bill
const useTransferBill = (billNftAddress: string, billId: string, toAddress: string) => {
  const { account, chainId } = useActiveWeb3React()
  const billNftContract = useBillNftContract(billNftAddress)
  const billType: string = useBillType(billNftAddress)
  const handleTransfer = useCallback(async () => {
    try {
      const tx = await userTransferBillNft(billNftContract, billId, account, toAddress)
      track({
        event: billType,
        chain: chainId,
        data: {
          cat: 'transfer',
          id: billId,
          from: account,
          to: toAddress,
        },
      })
      return tx
    } catch (e) {
      console.error(e)
      return null
    }
  }, [billId, toAddress, chainId, billNftContract, account, billType])
  return { onTransfer: handleTransfer }
}

export default useTransferBill
