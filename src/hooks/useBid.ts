import { useCallback } from 'react'
import { bid } from 'utils/callHelpers'
import track from 'utils/track'
import { useAuction } from './useContract'

const useBid = () => {
  const auctionContract = useAuction()

  const handleBid = useCallback(
    async (amount, id, auctionId) => {
      try {
        const txHash = await bid(auctionContract, amount, id)
        track({
          event: 'nfa',
          chain: 56,
          data: {
            id,
            auctionId,
            cat: 'bid',
            amount,
          },
        })
        console.info(txHash)
      } catch (e) {
        console.warn(e)
      }
    },
    [auctionContract],
  )

  return { onBid: handleBid }
}

export default useBid
