/** @jsxImportSource theme-ui */
import { Flex, Text } from '@ape.swap/uikit'
import { CurrencyAmount, Pair, Percent, TokenAmount } from '@ape.swap/sdk'
import { CurrencyLogo } from 'components/Logo'
import { useTranslation } from 'contexts/Localization'
import useTotalSupply from 'hooks/useTotalSupply'
import React from 'react'
import { Field } from 'state/burn/actions'
import { styles } from './styles'

const PoolInfo: React.FC<{
  pair: Pair
  parsedAmounts: {
    LIQUIDITY_PERCENT: Percent
    LIQUIDITY?: TokenAmount
    CURRENCY_A?: CurrencyAmount
    CURRENCY_B?: CurrencyAmount
  }
  chainId?: number
}> = ({ pair, parsedAmounts, chainId }) => {
  const { t } = useTranslation()
  const totalPoolTokens = useTotalSupply(pair?.liquidityToken)
  const lpAmount = parsedAmounts[Field.LIQUIDITY]?.divide(totalPoolTokens || '0')?.multiply('100')
  return (
    <Flex sx={{ ...styles.poolInfoContainer }}>
      <Flex sx={{ justifyContent: 'space-between' }}>
        <Text size="12px" weight="light">
          {t('LPs To Remove')}
        </Text>
        <Text size="12px" weight={700}>
          {parsedAmounts[Field.LIQUIDITY]?.toSignificant(6) || '-'}
        </Text>
      </Flex>
      <Flex sx={{ justifyContent: 'space-between' }}>
        <Text size="12px" weight="light">
          {t('Share of Pool')}
        </Text>
        <Text size="12px" weight={700}>
          {lpAmount ? `${lpAmount.toSignificant(2)}%` : '-'}
        </Text>
      </Flex>
      <Flex sx={{ justifyContent: 'space-between' }}>
        <Text size="12px" weight="light">
          {t('Pooled %currency%', {
            currency: pair?.token0?.getSymbol(chainId) || '-',
          })}
        </Text>
        <Flex sx={{ alignItems: 'center' }}>
          <Text size="12px" weight={700} mr="5px">
            {parsedAmounts[Field.CURRENCY_A]?.toSignificant(6) || '-'}
          </Text>
          <CurrencyLogo currency={pair?.token0} size="18px" />
        </Flex>
      </Flex>
      <Flex sx={{ justifyContent: 'space-between' }}>
        <Text size="12px" weight="light">
          {t('Pooled %currency%', {
            currency: pair?.token1?.getSymbol(chainId) || '-',
          })}
        </Text>
        <Flex sx={{ alignItems: 'center' }}>
          <Text size="12px" weight={700} mr="5px">
            {parsedAmounts[Field.CURRENCY_B]?.toSignificant(6) || '-'}
          </Text>
          <CurrencyLogo currency={pair?.token1} size="18px" />
        </Flex>
      </Flex>
    </Flex>
  )
}

export default React.memo(PoolInfo)
