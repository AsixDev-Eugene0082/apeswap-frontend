/** @jsxImportSource theme-ui */
import { Flex, Text } from '@ape.swap/uikit'
import { Currency, Percent, Price, TokenAmount } from '@ape.swap/sdk'
import { DoubleCurrencyLogo } from 'components/Logo'
import { ONE_BIPS } from 'config/constants'
import { useTranslation } from 'contexts/Localization'
import React from 'react'
import { Field } from 'state/mint/actions'
import { dexStyles } from 'views/Dex/styles'
import { styles } from './styles'

const PoolInfo: React.FC<{
  currencies: { [field in Field]?: Currency }
  noLiquidity?: boolean
  poolTokenPercentage?: Percent
  price?: Price
  chainId?: number
  liquidityMinted?: TokenAmount
}> = ({ currencies, noLiquidity, poolTokenPercentage, price, chainId, liquidityMinted }) => {
  const { t } = useTranslation()
  return (
    <Flex sx={{ ...styles.poolInfoContainer }}>
      <Flex sx={{ justifyContent: 'space-between', margin: '4px 0px' }}>
        <Text size="12px" weight="light" sx={dexStyles.textWrap}>
          {`${currencies[Field.CURRENCY_A]?.getSymbol(chainId) || ''} - 
            ${currencies[Field.CURRENCY_B]?.getSymbol(chainId) || ''} LP`}
        </Text>
        <Flex sx={{ alignItems: 'center', justifyContent: 'center' }}>
          <Text size="12px" weight={700} mr="5px" sx={dexStyles.textWrap}>
            {liquidityMinted?.toSignificant(6)}
          </Text>
          <DoubleCurrencyLogo
            currency0={currencies[Field.CURRENCY_A]}
            currency1={currencies[Field.CURRENCY_B]}
            size={16}
          />
        </Flex>
      </Flex>
      <Flex sx={{ justifyContent: 'space-between', margin: '4px 0px' }}>
        <Text size="12px" weight="light" sx={dexStyles.textWrap}>
          {t('Share of Pool')}
        </Text>
        <Text size="12px" weight={700} sx={dexStyles.textWrap}>
          {noLiquidity && price
            ? '100'
            : (poolTokenPercentage?.lessThan(ONE_BIPS) ? '<0.01' : poolTokenPercentage?.toFixed(2)) ?? '0'}
          %
        </Text>
      </Flex>
      <Flex sx={{ justifyContent: 'space-between', margin: '4px 0px' }}>
        <Text size="12px" weight="light" sx={dexStyles.textWrap}>
          {t('%currencyA% per %currencyB%', {
            currencyA: currencies[Field.CURRENCY_A]?.getSymbol(chainId) || '',
            currencyB: currencies[Field.CURRENCY_B]?.getSymbol(chainId) || '',
          })}
        </Text>
        <Text size="12px" weight={700} sx={dexStyles.textWrap}>
          {price?.invert()?.toSignificant(6) ?? '-'}
        </Text>
      </Flex>
      <Flex sx={{ justifyContent: 'space-between', margin: '4px 0px' }}>
        <Text size="12px" weight="light" sx={dexStyles.textWrap}>
          {t('%currencyB% per %currencyA%', {
            currencyB: currencies[Field.CURRENCY_B]?.getSymbol(chainId) || '',
            currencyA: currencies[Field.CURRENCY_A]?.getSymbol(chainId) || '',
          })}
        </Text>
        <Text size="12px" weight={700} sx={dexStyles.textWrap}>
          {price?.toSignificant(6) ?? '-'}
        </Text>
      </Flex>
    </Flex>
  )
}

export default React.memo(PoolInfo)
