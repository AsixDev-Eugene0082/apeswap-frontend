/** @jsxImportSource theme-ui */
import { Flex, Text } from '@ape.swap/uikit'
import { Currency, Price } from '@ape.swap/sdk'
import { useTranslation } from 'contexts/Localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import React, { useState } from 'react'
import { Field } from 'state/orders/actions'
import TradePrice from '../TradePrice'

const OrderTradeInfo: React.FC<{
  executionPrice: Price
  orderMarketStatus: number
  realPriceValue: string
  currencies: {
    INPUT?: Currency
    OUTPUT?: Currency
  }
}> = ({ executionPrice, currencies, orderMarketStatus, realPriceValue }) => {
  const { chainId } = useActiveWeb3React()
  const [showInverted, setShowInverted] = useState<boolean>(false)
  const { t } = useTranslation()

  return (
    <Flex
      sx={{
        flexDirection: 'column',
        borderRadius: '10px',
        background: 'white3',
        padding: '10px',
        mt: '10px',
        width: '100%',
      }}
    >
      <Flex sx={{ alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <Text size="12px" weight={500}>
          {' '}
          {t('Current Price')}
        </Text>
        <span sx={{ cursor: 'pointer', fontWeight: 600 }}>
          <TradePrice price={executionPrice} showInverted={showInverted} setShowInverted={setShowInverted} />
        </span>
      </Flex>
      <Flex sx={{ alignItems: 'center', justifyContent: 'space-between', width: '100%', mt: '5px' }}>
        <Text size="12px" weight={500}>
          {t('Target Order Price')}
        </Text>
        <Text size="12px" weight={600}>
          {realPriceValue}
        </Text>
      </Flex>
      <Flex sx={{ alignItems: 'center', justifyContent: 'space-between', width: '100%', mt: '5px' }}>
        <Text size="12px" weight={500}>
          {t('Required %symbol1%/%symbol2% change', {
            symbol1: currencies[Field.INPUT]?.getSymbol(chainId) ?? '',
            symbol2: currencies[Field.OUTPUT]?.getSymbol(chainId) ?? '',
          })}
        </Text>
        <Text size="12px" weight={600}>
          {orderMarketStatus?.toFixed(2)}%
        </Text>
      </Flex>
    </Flex>
  )
}

export default React.memo(OrderTradeInfo)
