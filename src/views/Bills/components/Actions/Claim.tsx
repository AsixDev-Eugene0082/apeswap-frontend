import React, { useState } from 'react'
import useClaimBill from 'views/Bills/hooks/useClaimBill'
import { AutoRenewIcon } from '@apeswapfinance/uikit'
import { useModal } from '@ape.swap/uikit'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useToast } from 'state/hooks'
import { getEtherscanLink } from 'utils'
import { useAppDispatch } from 'state'
import { fetchBillsUserDataAsync, fetchUserOwnedBillsDataAsync } from 'state/bills'
import { useTranslation } from 'contexts/Localization'
import { ClaimProps } from './types'
import { useIsModalShown } from 'state/user/hooks'
import { StyledButton } from '../styles'
import { MODAL_TYPE } from 'config/constants'
import CircularModal from 'components/CircularModal'

const Claim: React.FC<ClaimProps> = ({ billAddress, billIds, buttonSize, pendingRewards }) => {
  const { onClaimBill, billType } = useClaimBill(billAddress, billIds)
  const { chainId, account } = useActiveWeb3React()
  const dispatch = useAppDispatch()
  const [pendingTrx, setPendingTrx] = useState(false)
  const { toastSuccess } = useToast()
  const { t } = useTranslation()
  const [onPresentGHModal] = useModal(<CircularModal actionType={MODAL_TYPE.GENERAL_HARVEST} />, true, true, 'ghModal')
  const { showGeneralHarvestModal } = useIsModalShown()

  const displayGHCircular = () => showGeneralHarvestModal && onPresentGHModal()
  const bananaBill = billType === 'bill'

  const handleClaim = async () => {
    setPendingTrx(true)
    await onClaimBill()
      .then((resp) => {
        const trxHash = resp.transactionHash
        toastSuccess(t('Claim Successful'), {
          text: t('View Transaction'),
          url: getEtherscanLink(trxHash, 'transaction', chainId),
        })
        if (bananaBill) displayGHCircular()
      })
      .catch((e) => {
        console.error(e)
        setPendingTrx(false)
      })
    dispatch(fetchUserOwnedBillsDataAsync(chainId, account))
    dispatch(fetchBillsUserDataAsync(chainId, account))
    setPendingTrx(false)
  }
  return (
    <StyledButton
      onClick={handleClaim}
      endIcon={pendingTrx && <AutoRenewIcon spin color="currentColor" />}
      disabled={pendingTrx || parseFloat(pendingRewards) === 0}
      buttonSize={buttonSize}
    >
      {t('CLAIM')}
    </StyledButton>
  )
}

export default React.memo(Claim)
