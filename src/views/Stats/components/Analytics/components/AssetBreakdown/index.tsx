import React from 'react'
import { BNB, Flex, POLYGON, Text } from '@apeswapfinance/uikit'

import { useStats } from 'state/statsPage/hooks'
import { wrappedToNative } from 'state/statsPage/mappings'

import useIsMobile from 'hooks/useIsMobile'
import { useTranslation } from 'contexts/Localization'

import CardValue from '../../../CardValue'
import ServiceTokenDisplay from 'components/ServiceTokenDisplay'
import { NoContentPlaceholder } from 'views/Stats/components/NoContentPlaceholder'

import { Container } from './styles'

interface AssetProps {
  chain: number
  amount: number
  price: number
  balance: number
  symbol: string
}

const Asset = React.memo(function Asset({ amount, price, symbol, balance, chain }: AssetProps) {
  const isMobile = useIsMobile()
  const { t } = useTranslation()

  return (
    <Container>
      <Flex alignItems="center">
        <ServiceTokenDisplay
          token1={symbol.includes('-') ? wrappedToNative(symbol.split('-')[0]) : wrappedToNative(symbol)}
          token2={symbol.includes('-') ? wrappedToNative(symbol.split('-')[1]) : null}
          stakeLp={symbol.includes('-') ? true : null}
          noEarnToken={symbol.includes('-') ? true : null}
        />
        <div style={{ margin: '6px -2px 0 -8px', alignSelf: 'start' }}>
          {chain === 56 ? <BNB width={13} /> : <POLYGON width={13} />}
        </div>
        <div style={{ marginLeft: '10px' }}>
          <Text fontSize={isMobile ? '14px' : '16px'} fontWeight={700}>
            {symbol}
          </Text>
          <CardValue
            fontSize={isMobile ? '10px' : '12px'}
            fontWeight={300}
            value={price}
            decimals={2}
            prefix={`${t('Asset Price')}: $`}
          />
        </div>
      </Flex>
      <Flex flexDirection="column" style={{ textAlign: 'end' }}>
        <CardValue fontSize={isMobile ? '14px' : '16px'} fontWeight={700} value={balance} decimals={2} prefix="$" />
        <CardValue fontSize={isMobile ? '10px' : '12px'} fontWeight={300} value={amount} decimals={2} suffix={symbol} />
      </Flex>
    </Container>
  )
})

const AssetBreakdown = () => {
  const {
    stats: {
      analytics: { assets },
    },
  } = useStats()

  return (
    <>
      {assets?.breakdown.length ? (
        assets.breakdown
          .sort((a, b) => +b.balance - +a.balance)
          .map(({ address, amount, symbol, price, balance, chain }) => (
            <Asset
              key={`${chain}:${address}`}
              chain={chain}
              amount={Number(amount)}
              symbol={symbol}
              price={price}
              balance={Number(balance)}
            />
          ))
      ) : (
        <NoContentPlaceholder mt="32px" />
      )}
    </>
  )
}

export default AssetBreakdown
