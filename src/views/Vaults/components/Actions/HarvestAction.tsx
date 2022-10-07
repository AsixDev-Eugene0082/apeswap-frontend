import React, { useState } from 'react'
import useIsMobile from 'hooks/useIsMobile'
import { useToast } from 'state/hooks'
import { getEtherscanLink, showCircular } from 'utils'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import ListViewContent from 'components/ListViewContent'
import { fetchVaultUserDataAsync } from 'state/vaults'
import useHarvestMaximizer from 'views/Vaults/hooks/useHarvestMaximizer'
import { useAppDispatch } from 'state'
import { StyledButton } from '../styles'
import { ActionContainer } from './styles'
import { useIsModalShown } from 'state/user/hooks'
import { useHistory } from 'react-router-dom'

interface HarvestActionsProps {
  pid: number
  userEarnings: number
  earnTokenSymbol: string
  disabled: boolean
}

const HarvestAction: React.FC<HarvestActionsProps> = ({ pid, earnTokenSymbol, disabled, userEarnings }) => {
  const { account, chainId } = useActiveWeb3React()
  const dispatch = useAppDispatch()
  const [pendingTrx, setPendingTrx] = useState(false)
  const { onHarvest } = useHarvestMaximizer(pid)
  const { toastSuccess } = useToast()
  const isMobile = useIsMobile()
  const history = useHistory()

  const { showGeneralHarvestModal } = useIsModalShown()
  const displayGHCircular = () => showGeneralHarvestModal && showCircular(chainId, history, '?modal=circular-gh')

  const handleHarvest = async () => {
    setPendingTrx(true)
    await onHarvest()
      .then((resp) => {
        const trxHash = resp.transactionHash
        toastSuccess('Harvest Successful', {
          text: 'View Transaction',
          url: getEtherscanLink(trxHash, 'transaction', chainId),
        })
        if (trxHash) displayGHCircular()
      })
      .catch((e) => {
        console.error(e)
        setPendingTrx(false)
      })
    dispatch(fetchVaultUserDataAsync(account, chainId))
    setPendingTrx(false)
  }

  return (
    <ActionContainer>
      {isMobile && (
        <ListViewContent
          title={`Earned ${earnTokenSymbol}`}
          value={userEarnings?.toFixed(4)}
          width={100}
          height={50}
          ml={10}
        />
      )}
      <StyledButton disabled={disabled || pendingTrx} onClick={handleHarvest} load={pendingTrx}>
        HARVEST
      </StyledButton>
      {!isMobile && (
        <ListViewContent
          title={`Earned ${earnTokenSymbol}`}
          value={userEarnings?.toFixed(4)}
          width={150}
          height={50}
          ml={10}
        />
      )}
    </ActionContainer>
  )
}

export default React.memo(HarvestAction)
