import React from 'react'
import styled from 'styled-components'
import { CalculateIcon, useModal } from '@apeswapfinance/uikit'
import ApyCalculatorModal from './ApyCalculatorModal'
import { JungleFarm } from '../../state/types'

export interface ApyButtonProps {
  lpLabel?: string
  rewardTokenName?: string
  rewardTokenPrice?: number
  apy?: number
  addLiquidityUrl?: string
  jungleFarm?: JungleFarm
}

const StyledCalculateIcon = styled(CalculateIcon)`
  width: 13px;
  height: 13px;

  ${({ theme }) => theme.mediaQueries.xs} {
    width: 15px;
    height: 15px;
  }
`

const ApyButton: React.FC<ApyButtonProps> = ({ rewardTokenPrice, apy, rewardTokenName, jungleFarm }) => {
  const [onPresentApyModal] = useModal(
    <ApyCalculatorModal
      rewardTokenName={rewardTokenName}
      rewardTokenPrice={rewardTokenPrice}
      apy={apy}
      jungleFarm={jungleFarm}
    />,
  )

  return (
    <>
      <StyledCalculateIcon onClick={onPresentApyModal} color="yellow" ml="3px" style={{ cursor: 'pointer' }} />
    </>
  )
}

export default ApyButton
