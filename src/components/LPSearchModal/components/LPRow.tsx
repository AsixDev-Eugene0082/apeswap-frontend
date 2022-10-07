/** @jsxImportSource theme-ui */
import React, { CSSProperties } from 'react'
import { Flex, Text } from '@ape.swap/uikit'
import { ParsedFarm } from 'state/zap/reducer'
import { styles } from '../styles'
import { CurrencyAmount, Token } from '@ape.swap/sdk'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useCurrencyBalance } from 'state/wallet/hooks'
import { Spinner } from 'theme-ui'
import styled from '@emotion/styled'
import { PairState, usePair } from 'hooks/usePairs'
import ServiceTokenDisplay from 'components/ServiceTokenDisplay'
import { wrappedToNative } from 'utils'

const StyledBalanceText = styled(Text)`
  white-space: nowrap;
  overflow: hidden;
  max-width: 5rem;
  text-overflow: ellipsis;
  weight: 400;
  font-size: 14px;
  line-height: 35px;
  margin-right: 5px;
`

export function Balance({ balance }: { balance: CurrencyAmount }) {
  return <StyledBalanceText title={balance?.toExact()}>{balance?.toSignificant(6)}</StyledBalanceText>
}

interface LPRowProps {
  tokens?: { currencyA: Token; currencyB: Token }
  onLpSelect?: (farm: ParsedFarm) => void
  style: CSSProperties
}

const LPRow: React.FC<LPRowProps> = ({ tokens, onLpSelect, style }) => {
  const { chainId, account } = useActiveWeb3React()
  const { currencyA, currencyB } = tokens
  const [pairState, pair] = usePair(currencyA, currencyB)
  const balance = useCurrencyBalance(account ?? undefined, pair?.liquidityToken)
  const key = pair?.liquidityToken.address
  if (pairState === PairState.INVALID) return null
  return (
    <Flex sx={styles.LpRowContainer} onClick={onLpSelect} style={style} key={`lp-item-${key}`}>
      <Flex sx={{ alignItems: 'center' }}>
        <ServiceTokenDisplay token1={currencyA.getSymbol(chainId)} token2={currencyB.getSymbol(chainId)} noEarnToken />
        <Text weight={700} sx={{ lineHeight: '22px', marginLeft: '5px' }}>
          {wrappedToNative(currencyA.getSymbol(chainId))}-{wrappedToNative(currencyB.getSymbol(chainId))}
        </Text>
      </Flex>
      {balance ? <Balance balance={balance} /> : account ? <Spinner width="20px" height="20px" /> : null}
    </Flex>
  )
}

export default React.memo(LPRow)
