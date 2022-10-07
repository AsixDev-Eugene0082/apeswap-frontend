import { useCallback } from 'react'
import track from 'utils/track'
import { listNfa } from 'utils/callHelpers'
import { useAuction } from './useContract'

const useListNfa = () => {
  const auctionContract = useAuction()

  const handleListNfa = useCallback(
    async (id, auctionLength, timeToExtend, minimumExtendTime, minimumBid) => {
      try {
        const txHash = await listNfa(auctionContract, id, auctionLength, timeToExtend, minimumExtendTime, minimumBid)
        track({
          event: 'nfa',
          chain: 56,
          data: {
            cat: 'add-auction',
            id,
            auctionLength,
            extendTime: timeToExtend,
            minimumBid,
          },
        })
        console.info(txHash)
      } catch (e) {
        console.warn(e)
      }
    },
    [auctionContract],
  )

  return { onListNfa: handleListNfa }
}

export default useListNfa
