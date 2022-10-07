import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useAllHarvest } from 'hooks/useHarvest'
import { AutoRenewIcon, Button } from '@apeswapfinance/uikit'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { updateFarmUserEarnings } from 'state/farms'
import { useAppDispatch } from 'state'
import { useTranslation } from 'contexts/Localization'
import { useIsModalShown } from 'state/user/hooks'
import { useToast } from 'state/hooks'
import { getEtherscanLink, showCircular } from 'utils'
import { ActionContainer } from './styles'

interface HarvestActionsProps {
  pids: number[]
  disabled: boolean
}

const HarvestAllAction: React.FC<HarvestActionsProps> = ({ pids, disabled }) => {
  const { account, chainId } = useActiveWeb3React()
  const dispatch = useAppDispatch()
  const [pendingTrx, setPendingTrx] = useState(false)
  const { onReward } = useAllHarvest(pids, chainId)
  const { t } = useTranslation()
  const history = useHistory()
  const { toastSuccess } = useToast()

  const { showGeneralHarvestModal } = useIsModalShown()
  const displayGHCircular = () => showGeneralHarvestModal && showCircular(chainId, history, '?modal=circular-gh')

  return (
    <ActionContainer>
      <Button
        size="mds"
        className="noClick"
        disabled={disabled || pendingTrx}
        onClick={async () => {
          setPendingTrx(true)
          await onReward()
            .then((resp) => {
              resp.map((trx) => {
                const trxHash = trx.transactionHash
                if (trxHash) displayGHCircular()
                return toastSuccess(t('Claim Successful'), {
                  text: t('View Transaction'),
                  url: getEtherscanLink(trxHash, 'transaction', chainId),
                })
              })
            })
            .catch((e) => {
              console.error(e)
              setPendingTrx(false)
            })
          pids.map((pid) => {
            return dispatch(updateFarmUserEarnings(chainId, pid, account))
          })
          setPendingTrx(false)
        }}
        endIcon={pendingTrx && <AutoRenewIcon spin color="currentColor" />}
      >
        {t('HARVEST ALL')} ({pids.length})
      </Button>
    </ActionContainer>
  )
}

export default React.memo(HarvestAllAction)
