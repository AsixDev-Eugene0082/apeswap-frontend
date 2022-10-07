import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useBills } from 'state/bills/hooks'

export const useBillType = (billAddress: string) => {
  const { chainId } = useActiveWeb3React()
  const bills = useBills()
  const selectedBill = bills.find((bill) => bill.contractAddress[chainId].toLowerCase() === billAddress.toLowerCase())
  return selectedBill?.billType === 'BANANA Bill' ? 'bill' : selectedBill?.billType
}

export const useBillTypes = (billAddresses: string[]) => {
  const { chainId } = useActiveWeb3React()
  const bills = useBills()
  return billAddresses.map((billAddress) => {
    const selectedBill = bills.find((bill) => bill.contractAddress[chainId].toLowerCase() === billAddress.toLowerCase())
    return selectedBill?.billType === 'BANANA Bill' ? 'bill' : selectedBill?.billType
  })
}
