/** @jsxImportSource theme-ui */
import React from 'react'
import { Button, Text } from '@ape.swap/uikit'
import { Flex } from 'theme-ui'
import { Input as NumericalInput } from 'components/CurrencyInputPanel/NumericalInput'
import { RowBetween } from '../layout/Row'
import styles from './styles'

interface CurrencyInputPanelProps {
  dollarValue: string
  tokenValue: string
  onUserInput: (value: string) => void
  onMax: () => void
  removeLiquidity?: boolean
}

const CurrencyInputPanelRoi = ({
  dollarValue,
  tokenValue,
  onUserInput,
  onMax,
  removeLiquidity,
}: CurrencyInputPanelProps) => {
  return (
    <Flex sx={styles.container}>
      <Flex sx={{ position: 'relative' }}>
        <Button onClick={onMax} variant="primary" style={styles.maxButton}>
          MAX
        </Button>
      </Flex>
      <Flex sx={styles.inputSection as any}>
        <RowBetween>
          <NumericalInput
            id="roi-token-amount-input"
            removeLiquidity={removeLiquidity}
            value={tokenValue}
            align="right"
            width="full"
            onUserInput={onUserInput}
            autoFocus
          />
        </RowBetween>
        <Text weight="light" variant="sm">
          {dollarValue ? `~ $${dollarValue}` : ' -'}
        </Text>
      </Flex>
    </Flex>
  )
}

export default React.memo(CurrencyInputPanelRoi)
