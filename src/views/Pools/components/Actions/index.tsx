import React from 'react'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import BigNumber from 'bignumber.js'
import { CenterContainer } from './styles'
import ApprovalAction from './ApprovalAction'
import StakeAction from './StakeActions'
import UnlockButton from '../../../../components/UnlockButton'

// Changed props to type string because BigNumbers cause re-renders

interface CardActionProps {
  allowance: string
  stakingTokenBalance: string
  stakedTokenSymbol: string
  stakedBalance: string
  stakeTokenValueUsd: number
  stakeTokenAddress: string
  sousId: number
  earnTokenSymbol: string
}

const Actions: React.FC<CardActionProps> = ({
  allowance,
  stakingTokenBalance,
  stakedTokenSymbol,
  stakedBalance,
  stakeTokenValueUsd,
  stakeTokenAddress,
  sousId,
  earnTokenSymbol,
}) => {
  const { account } = useActiveWeb3React()
  const actionToRender = () => {
    if (!account) {
      return (
        <CenterContainer>
          <UnlockButton table />
        </CenterContainer>
      )
    }
    if (!new BigNumber(allowance)?.gt(0)) {
      return (
        <CenterContainer>
          <ApprovalAction stakingTokenContractAddress={stakeTokenAddress} sousId={sousId} />
        </CenterContainer>
      )
    }
    return (
      <StakeAction
        stakedBalance={stakedBalance}
        stakedTokenSymbol={stakedTokenSymbol}
        stakingTokenBalance={stakingTokenBalance}
        stakeTokenValueUsd={stakeTokenValueUsd}
        sousId={sousId}
        earnTokenSymbol={earnTokenSymbol}
      />
    )
  }
  return actionToRender()
}

export default React.memo(Actions)
