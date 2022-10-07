import React, { useState } from 'react'
import { AutoRenewIcon } from '@apeswapfinance/uikit'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useToast } from 'state/hooks'
import { updateUserAllowance } from 'state/bills'
import { getEtherscanLink } from 'utils'
import { useAppDispatch } from 'state'
import { useTranslation } from 'contexts/Localization'
import useApproveBill from '../../hooks/useApproveBill'
import { BillActionsProps } from './types'
import { Button } from '@ape.swap/uikit'
import { ApprovalState, useApproveCallbackFromZap } from 'hooks/useApproveCallback'
import { BuyButton } from './styles'
import BigNumber from 'bignumber.js'

const BillActions: React.FC<BillActionsProps> = ({
  bill,
  zap,
  currencyB,
  handleBuy,
  billValue,
  value,
  safeAvailable,
  balance,
  pendingTrx,
}) => {
  const { lpToken, contractAddress, index } = bill
  const [approval, approveCallback] = useApproveCallbackFromZap(zap)
  const showApproveZapFlow = approval === ApprovalState.NOT_APPROVED || approval === ApprovalState.PENDING
  const showApproveBillFlow = !new BigNumber(bill?.userData?.allowance).gt(0)
  const { chainId, account } = useActiveWeb3React()
  const { onApprove } = useApproveBill(lpToken.address[chainId], contractAddress[chainId])
  const dispatch = useAppDispatch()
  const [pendingApprove, setPendingApprove] = useState(false)
  const { toastSuccess, toastError } = useToast()
  const { t } = useTranslation()

  const handleApprove = async () => {
    setPendingApprove(true)
    await onApprove()
      .then((resp) => {
        const trxHash = resp.transactionHash
        toastSuccess(t('Approve Successful'), {
          text: t('View Transaction'),
          url: getEtherscanLink(trxHash, 'transaction', chainId),
        })
      })
      .catch((e) => {
        console.error(e)
        toastError(e?.data?.message || t('Error: Please try again.'))
        setPendingApprove(false)
      })
    dispatch(updateUserAllowance(chainId, index, account))
    setPendingApprove(false)
  }

  return (
    <>
      {!currencyB && showApproveZapFlow ? (
        <Button
          onClick={approveCallback}
          disabled={approval !== ApprovalState.NOT_APPROVED}
          load={approval === ApprovalState.PENDING}
          fullWidth
        >
          {approval === ApprovalState.PENDING
            ? `${t('Enabling')} ${zap?.currencyIn?.currency?.symbol}`
            : `${t('Enable')} ${zap?.currencyIn?.currency?.symbol}`}
        </Button>
      ) : currencyB && showApproveBillFlow ? (
        <Button
          onClick={handleApprove}
          endIcon={pendingApprove && <AutoRenewIcon spin color="currentColor" />}
          disabled={pendingApprove}
          fullWidth
        >
          {t('Enable')}
        </Button>
      ) : (
        <BuyButton
          onClick={handleBuy}
          endIcon={pendingTrx && <AutoRenewIcon spin color="currentColor" />}
          disabled={
            billValue === 'NaN' ||
            parseFloat(billValue) < 0.01 ||
            parseFloat(billValue) > parseFloat(safeAvailable) ||
            parseFloat(balance) < parseFloat(value) ||
            pendingApprove ||
            pendingTrx
          }
        >
          {t('Buy')}
        </BuyButton>
      )}
    </>
  )
}

export default React.memo(BillActions)
