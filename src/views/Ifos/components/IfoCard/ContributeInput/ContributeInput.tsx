/** @jsxImportSource theme-ui */
import React, { useState } from 'react'
import { getFullDisplayBalance } from 'utils/formatBalance'
import { useTranslation } from 'contexts/Localization'
import BigNumber from 'bignumber.js'
import { ContributeButton } from './styles'
import useIAODeposit from '../../../hooks/useIAODeposit'
import TokenInput from './TokenInput'
import { Flex, Text, useModal } from '@ape.swap/uikit'
import { Box } from 'theme-ui'
import { useHistory } from 'react-router-dom'
import MoonPayModal from '../../../../Topup/MoonpayModal'

interface Props {
  currency: string
  contract: any
  notLp?: boolean
  currencyAddress: string
  disabled?: boolean
  tokenBalance: BigNumber
}

const ContributeInputComponent: React.FC<Props> = ({ currency, contract, currencyAddress, disabled, tokenBalance }) => {
  const [value, setValue] = useState('')
  const balance = getFullDisplayBalance(tokenBalance)
  const { t } = useTranslation()
  const history = useHistory()
  const [onPresentModal] = useModal(<MoonPayModal />)

  const { pendingTx, handleDeposit, isAmountValid } = useIAODeposit(contract, currencyAddress, tokenBalance)

  const useMax = () => {
    const bnbReduction = new BigNumber(0.01)
    const bigBalance = new BigNumber(balance)
    setValue(
      currency === 'BNB'
        ? (bigBalance > bnbReduction ? bigBalance.minus(bnbReduction).toFixed() : 0).toString()
        : balance,
    )
  }

  const openLiquidity = () => (currency === 'GNANA' ? history.push({ search: '?modal=gnana' }) : onPresentModal())

  return (
    <Flex sx={{ alignItems: 'flex-end' }}>
      <TokenInput
        value={value}
        onSelectMax={useMax}
        onChange={(e) => setValue(e.currentTarget.value)}
        max={parseFloat(balance).toFixed(2)}
        symbol={currency}
      />
      <Flex sx={{ flexWrap: 'wrap', justifyContent: 'flex-end', minWidth: '130px' }}>
        <Box sx={{ textAlign: 'end', width: '100%' }}>
          <Text
            size="12px"
            weight={500}
            sx={{ '&:hover': { textDecoration: 'underline', cursor: 'pointer' } }}
            onClick={openLiquidity}
          >
            {t('GET')} {currency?.toUpperCase()}
          </Text>
        </Box>
        <Box>
          <ContributeButton
            disabled={disabled || pendingTx || !isAmountValid(value)}
            onClick={() => handleDeposit(value, currency)}
          >
            {t('CONTRIBUTE')}
          </ContributeButton>
        </Box>
      </Flex>
    </Flex>
  )
}

export default ContributeInputComponent
