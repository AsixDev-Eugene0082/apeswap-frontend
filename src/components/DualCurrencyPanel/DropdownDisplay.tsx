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
  font-size: 12px;
  line-height: 30px;
`

export function Balance({ balance }: { balance: CurrencyAmount }) {
  const bal = parseFloat(balance.toExact())
  return (
    <StyledBalanceText title={balance?.toExact()}>{bal > 0.0001 ? balance?.toSignificant(4) : '0'}</StyledBalanceText>
  )
}

const DropdownDisplay: React.FC<{ inputCurrencies: Currency[]; active? }> = ({ inputCurrencies, active }) => {
  const { account, chainId } = useActiveWeb3React()
  const [, pair] = usePair(inputCurrencies[0], inputCurrencies[1])
  const balance = useCurrencyBalance(account ?? undefined, pair ? pair?.liquidityToken : inputCurrencies[0])

  return (
    <Flex sx={{ alignItems: 'center', width: active ? '100%' : '170px' }}>
      <Flex sx={{ minWidth: inputCurrencies[1] ? '30px' : '35px', marginRight: '5px', alignItems: 'center' }}>
        {!inputCurrencies[1] && !active && (
          <Box sx={{ marginRight: '5px' }}>
            <Svg icon="ZapIcon" color={'gray'} width="8px" />
          </Box>
        )}
        <ServiceTokenDisplay
          token1={inputCurrencies[0]?.getSymbol(chainId)}
          token2={inputCurrencies[1]?.getSymbol(chainId)}
          noEarnToken={!!inputCurrencies[1]}
          size={active ? 28 : 20}
        />
      </Flex>
      <Flex sx={{ alignItems: 'center', justifyContent: 'space-between', width: active ? null : '100%' }}>
        <Text sx={styles.tokenText}>
          {inputCurrencies[1]
            ? `${wrappedToNative(inputCurrencies[0]?.getSymbol(chainId))}-${wrappedToNative(
                inputCurrencies[1]?.getSymbol(chainId),
              )}`
            : inputCurrencies[0]?.getSymbol(chainId)}
        </Text>
        <Text>
          {!active ? (
            balance ? (
              <Balance balance={balance} />
            ) : account ? (
              <Spinner width="20px" height="20px" />
            ) : null
          ) : null}
        </Text>
      </Flex>
    </Flex>
  )
}

export default React.memo(DropdownDisplay)
