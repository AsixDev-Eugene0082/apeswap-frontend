import { useCallback } from 'react'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { userBuyBill } from 'utils/callHelpers'
import { useBillContract } from 'hooks/useContract'
import track from 'utils/track'
import BigNumber from 'bignumber.js'
import { useBillType } from './useBillType'

const DEFAULT_SLIPPAGE = 102 // Maximum of 2% slippage when buying Bill
// Buy a Bill
const useBuyBill = (
  billAddress: string,
  amount: string,
  lpPrice: number,
  price: string,
  slippage = DEFAULT_SLIPPAGE,
) => {
  const { chainId, account } = useActiveWeb3React()
  const billContract = useBillContract(billAddress)
  const billType: string = useBillType(billAddress)
  const usdAmount: number = parseFloat(amount) * lpPrice
  const maxPrice = new BigNumber(price).times(slippage).div(100)
  const handleBuyBill = useCallback(async () => {
    const tx = await userBuyBill(billContract, account, amount, maxPrice.toFixed(0))
    track({
      event: billType,
      chain: chainId,
      data: {
        cat: 'buy',
        address: billContract.address,
        amount,
        usdAmount,
      },
    })
    return tx
  }, [billContract, amount, account, chainId, billType, usdAmount, maxPrice])

  return { onBuyBill: handleBuyBill }
}

export default useBuyBill
