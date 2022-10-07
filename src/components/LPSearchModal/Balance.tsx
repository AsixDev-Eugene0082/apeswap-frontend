import React from 'react'
import { Flex, Text } from '@ape.swap/uikit'
import useActiveWeb3React from '../../hooks/useActiveWeb3React'
import { getBalanceNumber } from 'utils/formatBalance'
import BigNumber from 'bignumber.js'
import { Spinner } from 'theme-ui'
import styled from 'styled-components'

interface BalanceProps {
  balance?: string
}

const Balance: React.FC<BalanceProps> = ({ balance }) => {
  const { account } = useActiveWeb3React()

  return (
    <Flex sx={{ alignItems: 'center' }}>
      {balance ? (
        <StyledBalanceText>
          {balance === '0' ? '0' : getBalanceNumber(new BigNumber(balance), 18).toFixed(6)}
        </StyledBalanceText>
      ) : account ? (
        <Spinner width="20px" height="20px" />
      ) : (
        0
      )}
    </Flex>
  )
}

export default Balance

export const StyledBalanceText = styled(Text)`
  white-space: nowrap;
  overflow: hidden;
  max-width: 5rem;
  text-overflow: ellipsis;
  weight: 400;
  font-size: 14px;
`
