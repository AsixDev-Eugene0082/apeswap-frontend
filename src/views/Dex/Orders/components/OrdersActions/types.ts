import { Percent, Trade } from '@ape.swap/sdk'
import { RouterTypes } from 'config/constants'
import { WrapType } from 'hooks/useWrapCallback'

export interface OrdersActionProps {
  trade: Trade
  swapInputError: string
  isExpertMode: boolean
  showWrap: boolean
  wrapType: WrapType
  priceImpactWithoutFee: Percent
  swapCallbackError: string
  userHasSpecifiedInputOutput: boolean
  disabled?: boolean
  routerType: RouterTypes
  onWrap: () => void
  handleSwap: () => void
  onPresentConfirmModal: () => void
  setSwapState: React.Dispatch<
    React.SetStateAction<{
      tradeToConfirm: Trade | undefined
      attemptingTxn: boolean
      swapErrorMessage: string | undefined
      txHash: string | undefined
    }>
  >
}
