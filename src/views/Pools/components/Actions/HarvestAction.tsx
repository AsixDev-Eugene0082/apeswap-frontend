/** @jsxImportSource theme-ui */
import React, { useState } from 'react'
import { Button } from '@ape.swap/uikit'
import { useHistory } from 'react-router-dom'
import { useSousHarvest } from 'hooks/useHarvest'
import useIsMobile from 'hooks/useIsMobile'
import { useToast } from 'state/hooks'
import { getEtherscanLink, showCircular } from 'utils'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useSousStake } from 'hooks/useStake'
import { fetchPoolsUserDataAsync, updateUserPendingReward } from 'state/pools'
import { useCurrency } from 'hooks/Tokens'
import { useBananaAddress } from 'hooks/useAddress'
import { useIsModalShown } from 'state/user/hooks'

import ListViewContent from 'components/ListViewContent'
import { useTranslation } from 'contexts/Localization'
import { useAppDispatch } from 'state'
import { ActionContainer } from './styles'
import { poolStyles } from '../styles'

interface HarvestActionsProps {
  sousId: number
  userEarnings: number
  earnTokenSymbol: string
  disabled: boolean
}

const HarvestAction: React.FC<HarvestActionsProps> = ({ sousId, earnTokenSymbol, disabled, userEarnings }) => {
  const { account, chainId } = useActiveWeb3React()
  const dispatch = useAppDispatch()
  const [pendingTrx, setPendingTrx] = useState(false)
  const [pendingApeHarderTrx, setPendingApeHarderTrx] = useState(false)
  const { onHarvest } = useSousHarvest(sousId)
  const { onStake } = useSousStake(sousId)
  const bananaToken = useCurrency(useBananaAddress())
  const { showPoolHarvestModal } = useIsModalShown()
  const history = useHistory()

  const { toastSuccess } = useToast()
  const isMobile = useIsMobile()
  const { t } = useTranslation()

  const harvestBanana = earnTokenSymbol === bananaToken.symbol
  const displayPHCircular = () =>
    showPoolHarvestModal && harvestBanana && showCircular(chainId, history, '?modal=circular-ph')

  const handleHarvest = async () => {
    setPendingTrx(true)
    await onHarvest()
      .then((resp) => {
        const trxHash = resp.transactionHash
        toastSuccess(t('Harvest Successful'), {
          text: t('View Transaction'),
          url: getEtherscanLink(trxHash, 'transaction', chainId),
        })
        if (trxHash) displayPHCircular()
      })
      .catch((e) => {
        console.error(e)
        setPendingTrx(false)
      })
    dispatch(updateUserPendingReward(chainId, sousId, account))
    setPendingTrx(false)
  }

  const handleApeHarder = async () => {
    setPendingApeHarderTrx(true)
    await onStake(userEarnings.toString())
      .then((resp) => {
        const trxHash = resp.transactionHash
        toastSuccess(t('Ape Harder Successful'), {
          text: t('View Transaction'),
          url: getEtherscanLink(trxHash, 'transaction', chainId),
        })
      })
      .catch((e) => {
        console.error(e)
        setPendingApeHarderTrx(false)
      })
    dispatch(fetchPoolsUserDataAsync(chainId, account))
    setPendingApeHarderTrx(false)
  }

  return (
    <ActionContainer>
      {isMobile && (
        <ListViewContent
          title={`${t('Earned')} ${earnTokenSymbol}`}
          value={userEarnings?.toFixed(4)}
          width={100}
          height={50}
          ml={10}
        />
      )}
      {sousId === 0 && (
        <Button
          disabled={disabled || pendingApeHarderTrx}
          onClick={handleApeHarder}
          load={pendingApeHarderTrx}
          mr={isMobile ? '0px' : '10px'}
          sx={{ minWidth: isMobile && '100px', width: isMobile && '115px', padding: '0px', ...poolStyles.styledBtn }}
        >
          {t('APE HARDER')}
        </Button>
      )}
      <Button
        disabled={disabled || pendingTrx}
        onClick={handleHarvest}
        load={pendingTrx}
        sx={{
          minWidth: isMobile && sousId === 0 && '100px',
          width: isMobile && sousId === 0 && '100px',
          ...poolStyles.styledBtn,
        }}
      >
        {t('HARVEST')}
      </Button>
      {!isMobile && (
        <ListViewContent
          title={`${t('Earned')} ${earnTokenSymbol}`}
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
