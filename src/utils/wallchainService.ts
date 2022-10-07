import { SmartRouter } from '@ape.swap/sdk'
import { RouterTypes } from 'config/constants'
import { BONUS_CUTOFF_AMOUNT, WALLCHAIN_PARAMS } from 'config/constants/chains'
import { Contract } from 'ethers'
import { SwapDelay, RouterTypeParams, DataResponse } from 'state/swap/actions'

const wallchainResponseIsValid = (
  dataResonse: DataResponse,
  value: string,
  account: string,
  contractAddress: string,
  chainId: number,
) => {
  if (!dataResonse.pathFound) {
    // Opportunity was not found -> response should be ignored -> valid.
    return false
  }
  if (BONUS_CUTOFF_AMOUNT[chainId] > dataResonse?.summary.searchSummary.expectedUsdProfit * 0.3) {
    return false
  }
  return (
    dataResonse.transactionArgs.destination.toLowerCase() === contractAddress.toLowerCase() &&
    dataResonse.transactionArgs.value.toLowerCase() === value.toLowerCase() &&
    dataResonse.transactionArgs.sender.toLowerCase() === account.toLowerCase()
  )
}

/**
 * Call Wallchain API to analyze the expected opportunity.
 * @param methodName function to execute in transaction
 * @param args arguments for the function
 * @param value value parameter for the transaction
 * @param chainId chainId of the blockchain
 * @param account account address from sender
 * @param contract ApeSwap Router contract
 * @param smartRouter The type of router the trade will go through
 * @param routerType The router that the trade will go through
 * @param onBestRoute Callback function to set the best route
 * @param onSetSwapDelay Callback function to set the swap delay state
 */
export default function callWallchainAPI(
  methodName: string,
  args: (string | string[])[],
  value: string,
  chainId: number,
  account: string,
  contract: Contract,
  smartRouter: SmartRouter,
  routerType: RouterTypes,
  onBestRoute: (bestRoute: RouterTypeParams) => void,
  onSetSwapDelay: (swapDelay: SwapDelay) => void,
): Promise<any> {
  onSetSwapDelay(SwapDelay.FETCHING_BONUS)
  const encodedData = contract.interface.encodeFunctionData(methodName, args)
  // Allowing transactions to be checked even if no user is connected
  const activeAccount = account || '0x0000000000000000000000000000000000000000'

  // If the intiial call fails APE router will be the default router
  return fetch(
    `${WALLCHAIN_PARAMS[chainId][smartRouter].apiUrl}?key=${WALLCHAIN_PARAMS[chainId][smartRouter].apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        value,
        sender: activeAccount,
        data: encodedData,
        destination: contract.address,
      }),
    },
  )
    .then((response) => {
      if (response.ok) {
        return response.json()
      }
      console.error('Wallchain Error', response.status, response.statusText)
      onBestRoute({ routerType, smartRouter })
      onSetSwapDelay(SwapDelay.SWAP_REFRESH)
      return null
    })
    .then((responseJson) => {
      if (responseJson) {
        const dataResonse: DataResponse = responseJson
        if (wallchainResponseIsValid(dataResonse, value, activeAccount, contract.address, chainId)) {
          onBestRoute({ routerType: RouterTypes.BONUS, smartRouter, bonusRouter: dataResonse })
          onSetSwapDelay(SwapDelay.SWAP_REFRESH)
        } else {
          onBestRoute({ routerType, smartRouter })
          onSetSwapDelay(SwapDelay.SWAP_REFRESH)
        }
      }
      onSetSwapDelay(SwapDelay.SWAP_REFRESH)
      return null
    })
    .catch((error) => {
      onBestRoute({ routerType, smartRouter })
      onSetSwapDelay(SwapDelay.SWAP_REFRESH)
      console.error('Wallchain Error', error)
    })
}
