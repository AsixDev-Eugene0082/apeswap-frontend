/** @jsxImportSource theme-ui */
import React, { useState } from 'react'
import { Button } from '@ape.swap/uikit'
import { Skeleton } from '@apeswapfinance/uikit'
import { useSousApprove } from 'hooks/useApprove'
import { useERC20 } from 'hooks/useContract'
import { useAppDispatch } from 'state'
import { updateUserAllowance } from 'state/pools'
import { getEtherscanLink } from 'utils'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useToast } from 'state/hooks'
import { useTranslation } from 'contexts/Localization'
import { poolStyles } from '../styles'

interface ApprovalActionProps {
  stakingTokenContractAddress: string
  sousId: number
  isLoading?: boolean
}

const ApprovalAction: React.FC<ApprovalActionProps> = ({ stakingTokenContractAddress, sousId, isLoading = false }) => {
  const { chainId, account } = useActiveWeb3React()
  const stakingTokenContract = useERC20(stakingTokenContractAddress)
  const [pendingTrx, setPendingTrx] = useState(false)
  const dispatch = useAppDispatch()
  const { onApprove } = useSousApprove(stakingTokenContract, sousId)
  const { toastSuccess } = useToast()
  const { t } = useTranslation()

  return (
    <>
      {isLoading ? (
        <Skeleton width="100%" height="52px" />
      ) : (
        <Button
          sx={{ minWidth: '227px', width: '227px', textAlign: 'center', ...poolStyles.styledBtn }}
          className="noClick"
          disabled={pendingTrx}
          onClick={async () => {
            setPendingTrx(true)
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
                setPendingTrx(false)
              })
            dispatch(updateUserAllowance(chainId, sousId, account))

            setPendingTrx(false)
          }}
          load={pendingTrx}
        >
          {t('ENABLE')}
        </Button>
      )}
    </>
  )
}

export default React.memo(ApprovalAction)
