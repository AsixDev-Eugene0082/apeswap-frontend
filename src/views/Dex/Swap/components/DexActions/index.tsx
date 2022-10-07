/** @jsxImportSource theme-ui */
import { Button, Flex, Text } from '@ape.swap/uikit'
import UnlockButton from 'components/UnlockButton'
import { RouterTypes } from 'config/constants'
import { useTranslation } from 'contexts/Localization'
import { useCurrency } from 'hooks/Tokens'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useBananaAddress } from 'hooks/useAddress'
import { ApprovalState, useApproveCallbackFromTrade } from 'hooks/useApproveCallback'
import { WrapType } from 'hooks/useWrapCallback'
import React from 'react'
import { useHistory } from 'react-router-dom'
import { useIsModalShown, useUserSlippageTolerance } from 'state/user/hooks'
import { showCircular } from 'utils'
import { warningSeverity } from 'utils/prices'
import { styles } from './styles'
import { DexActionProps } from './types'

const DexActions: React.FC<DexActionProps> = ({
  trade,
  swapInputError,
  isExpertMode,
  showWrap,
  wrapType,
  priceImpactWithoutFee,
  swapCallbackError,
  userHasSpecifiedInputOutput,
  routerType,
  smartRouter,
  disabled,
  wrapInputError,
  onWrap,
  handleSwap,
  onPresentConfirmModal,
  setSwapState,
  inputCurrency,
}) => {
  const { t } = useTranslation()
  const { account, chainId } = useActiveWeb3React()
  const history = useHistory()
  const { showSellModal } = useIsModalShown()
  const bananaToken = useCurrency(useBananaAddress())

  const sellingBanana = inputCurrency === bananaToken
  const displaySellCircular = () => showSellModal && showCircular(chainId, history, '?modal=circular-sell')

  // get custom setting values for user
  const [allowedSlippage] = useUserSlippageTolerance()

  // check whether the user has approved the router on the input token
  const [approval, approveCallback] = useApproveCallbackFromTrade(
    trade,
    allowedSlippage,
    false,
    routerType,
    smartRouter,
  )

  // warnings on slippage
  const priceImpactSeverity = warningSeverity(priceImpactWithoutFee)

  // show approve flow when: no error on inputs, not approved or pending, or approved in current session
  // never show if price impact is above threshold in non expert mode
  const showApproveFlow =
    !swapInputError &&
    (approval === ApprovalState.NOT_APPROVED || approval === ApprovalState.PENDING) &&
    !(priceImpactSeverity > 3 && !isExpertMode)

  const renderAction = () => {
    if (!account) {
      return <UnlockButton fullWidth />
    }
    if (showWrap) {
      return (
        <Button fullWidth onClick={onWrap} disabled={Boolean(wrapInputError)}>
          {wrapType === WrapType.WRAP ? t('Wrap') : t('Unwrap')}
        </Button>
      )
    }
    if (!trade?.route && userHasSpecifiedInputOutput && !disabled) {
      return (
        <Text margin="10px 0px" sx={{ width: '100%', textAlign: 'center' }}>
          {t('Insufficient liquidity for this trade')}
        </Text>
      )
    }
    if (showApproveFlow) {
      return (
        <Button
          fullWidth
          onClick={approveCallback}
          disabled={approval !== ApprovalState.NOT_APPROVED || disabled}
          load={approval === ApprovalState.PENDING}
        >
          {approval === ApprovalState.PENDING
            ? t('Approving')
            : t('Approve %route% Router', {
                route:
                  routerType === RouterTypes.BONUS
                    ? RouterTypes.BONUS
                    : routerType === RouterTypes.SMART
                    ? RouterTypes.SMART
                    : 'APESWAP',
              })}
        </Button>
      )
    }
    return (
      <Button
        fullWidth
        onClick={() => {
          if (isExpertMode) {
            handleSwap()
          } else {
            setSwapState({
              tradeToConfirm: trade,
              attemptingTxn: false,
              swapErrorMessage: undefined,
              txHash: undefined,
            })
            if (sellingBanana) displaySellCircular()
            onPresentConfirmModal()
          }
        }}
        id="swap-button"
        disabled={!!swapInputError || (priceImpactSeverity > 3 && !isExpertMode) || !!swapCallbackError || disabled}
      >
        {swapInputError ||
          (priceImpactSeverity > 3 && !isExpertMode
            ? t('Price Impact Too High')
            : priceImpactSeverity > 2
            ? t('Swap Anyway')
            : t('Swap'))}
      </Button>
    )
  }

  return <Flex sx={{ ...styles.dexActionsContainer }}>{renderAction()}</Flex>
}

export default React.memo(DexActions)
