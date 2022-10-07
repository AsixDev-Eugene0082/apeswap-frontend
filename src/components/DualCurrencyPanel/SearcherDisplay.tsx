/** @jsxImportSource theme-ui */
import React from 'react'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { usePair } from 'hooks/usePairs'
import { useCurrencyBalance } from 'state/wallet/hooks'
import { Flex, Svg, Text } from '@ape.swap/uikit'
import ServiceTokenDisplay from 'components/ServiceTokenDisplay'
import { styles } from './styles'
import { wrappedToNative } from 'utils'
import { Box, Spinner } from 'theme-ui'
import { Currency, CurrencyAmount } from '@ape.swap/sdk'
import styled from '@emotion/styled'

const StyledBalanceText = styled(Text)`
  white-space: nowrap;
  overflow: hidden;
  max-width: 10px;
  text-overflow: ellipsis;
  weight: 400;
  font-size: 14px;
  line-height: 30px;
`

export function Balance({ balance }: { balance: CurrencyAmount }) {
  return <StyledBalanceText title={balance?.toExact()}>{balance?.toSignificant(5)}</StyledBalanceText>
}

const SearcherDisplay: React.FC<{ item: { currencyA: Currency; currencyB: Currency } }> = ({ item }) => {
  const { account, chainId } = useActiveWeb3React()
  const { currencyA, currencyB } = item
  const [, pair] = usePair(currencyA, currencyB)
  const balance = useCurrencyBalance(account ?? undefined, pair ? pair?.liquidityToken : currencyA)

  return (
    <Flex
      sx={{
        alignItems: 'center',
        width: '100%',
        padding: '10px',
        cursor: 'pointer',
        background: 'white3',
        ':hover': {
          background: 'white4',
        },
      }}
    >
      <Flex sx={{ minWidth: '50px', alignItems: 'center' }}>
        {!currencyB && (
          <Box sx={{ marginRight: '10px' }}>
            <Svg icon="ZapIcon" color={'gray'} width="8px" />
          </Box>
        )}
        <ServiceTokenDisplay
          token1={currencyA?.getSymbol(chainId)}
          token2={currencyB?.getSymbol(chainId)}
          noEarnToken={!!currencyB}
          size={30}
        />
      </Flex>
      <Flex sx={{ alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <Flex sx={{ marginLeft: '10px', flexDirection: 'column' }}>
          <Text sx={styles.symbolText}>
            {currencyB
              ? `${wrappedToNative(currencyA?.getSymbol(chainId))}-${wrappedToNative(currencyB?.getSymbol(chainId))}`
              : currencyA?.getSymbol(chainId)}
          </Text>
          <Text size="12px" weight={300} sx={{ lineHeight: '16px' }}>
            {pair ? pair?.liquidityToken?.getName(chainId) : currencyA?.getName(chainId)}
          </Text>
        </Flex>
        <Text>{balance ? <Balance balance={balance} /> : account ? <Spinner width="20px" height="20px" /> : null}</Text>
      </Flex>
    </Flex>
  )
}

export default React.memo(SearcherDisplay)
