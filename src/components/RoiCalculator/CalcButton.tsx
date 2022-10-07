/** @jsxImportSource theme-ui */
import React from 'react'
import { DualFarm, Farm } from 'state/types'
import { CalculateIcon } from '@apeswapfinance/uikit'
import { IconButton, useModal } from '@ape.swap/uikit'
import RoiCalculatorModal from './RoiCalculatorModal'
import styles from './styles'

export interface CalcButtonProps {
  label?: string
  rewardTokenName?: string
  rewardTokenPrice?: number
  apr?: number
  lpApr?: number
  apy?: number
  lpAddress?: string
  tokenAddress?: string
  quoteTokenAddress?: string
  isLp?: boolean
  farm?: Farm
  liquidityUrl?: string
  lpPrice?: number
  dualFarm?: DualFarm
}

const CalcButton: React.FC<CalcButtonProps> = (props) => {
  const { apr } = props
  const [onPresentCalcModal] = useModal(<RoiCalculatorModal {...props} />)

  return (
    <IconButton variant="transparent" onClick={onPresentCalcModal} disabled={!apr} sx={styles.apyButton}>
      <CalculateIcon color="yellow" ml="3px" />
    </IconButton>
  )
}

export default React.memo(CalcButton)
