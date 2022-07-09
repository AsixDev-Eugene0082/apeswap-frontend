import { RouterTypes } from 'config/constants'
import { WALLCHAIN_PARAMS } from 'config/constants/chains'
import { Contract } from 'ethers'
import { SwapDelay, RouterTypeParams, DataResponse } from 'state/swap/actions'

const wallchainResponseIsValid = (
  dataResonse: DataResponse,
  value: string,
  account: string,
  contractAddress: string,
) => {
  if (!dataResonse.pathFound) {
    // Opportunity was not found -> response should be ignored -> valid.
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
  onBestRoute: (bestRoute: RouterTypeParams) => void,
  onSetSwapDelay: (swapDelay: SwapDelay) => void,
): Promise<any> {
  onSetSwapDelay(SwapDelay.LOADING_ROUTE)
  const encodedData = contract.interface.encodeFunctionData(methodName, args)
  // Allowing transactions to be checked even if no user is connected
  const activeAccount = account || '0x0000000000000000000000000000000000000000'

  // If the intiial call fails APE router will be the default router
  return fetch(`${WALLCHAIN_PARAMS[chainId].apiUrl}?key=${WALLCHAIN_PARAMS[chainId].apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      value,
      sender: activeAccount,
      data: encodedData,
      destination: contract.address,
    }),
  })
    .then((response) => {
      if (response.ok) {
        return response.json()
      }
      console.error('Wallchain Error', response.status, response.statusText)
      onBestRoute({ routerType: RouterTypes.APE })
      onSetSwapDelay(SwapDelay.VALID)
      return null
    })
    .then((responseJson) => {
      if (responseJson) {
        const dataResonse: DataResponse = responseJson
        if (wallchainResponseIsValid(dataResonse, value, activeAccount, contract.address)) {
          onBestRoute({ routerType: RouterTypes.BONUS, bonusRouter: dataResonse })
          onSetSwapDelay(SwapDelay.VALID)
        } else {
          onBestRoute({ routerType: RouterTypes.APE })
          onSetSwapDelay(SwapDelay.VALID)
        }
      }
      onSetSwapDelay(SwapDelay.VALID)
      return null
    })
    .catch((error) => {
      onBestRoute({ routerType: RouterTypes.APE })
      onSetSwapDelay(SwapDelay.VALID)
      console.error('Wallchain Error', error)
    })
}
