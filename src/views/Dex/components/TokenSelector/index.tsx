/** @jsxImportSource theme-ui */
import { Flex, Svg, Text, useModal } from '@ape.swap/uikit'
import { Currency } from '@ape.swap/sdk'
import { Skeleton } from '@apeswapfinance/uikit'
import { CurrencyLogo, DoubleCurrencyLogo } from 'components/Logo'
import CurrencySearchModal from 'components/SearchModal/CurrencySearchModal'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import React, { useCallback } from 'react'
import { styles } from './styles'

const TokenSelector: React.FC<{
  currency: Currency
  otherCurrency: Currency
  onCurrencySelect: (field: any, currency: Currency, typedValue?: string) => void
  field: any
  typedValue?: string
  showCommonBases?: boolean
  disableTokenSelect?: boolean
  isRemoveLiquidity?: boolean
  isZapInput?: boolean
}> = ({
  currency,
  onCurrencySelect,
  otherCurrency,
  isRemoveLiquidity,
  disableTokenSelect,
  typedValue,
  field,
  showCommonBases = false,
  isZapInput,
}) => {
  const { chainId } = useActiveWeb3React()

  const handleDynamicCurrencySelect = useCallback(
    (selectedCurrency: Currency) => {
      onCurrencySelect(field, selectedCurrency, typedValue)
    },
    [field, typedValue, onCurrencySelect],
  )

  const [onPresentCurrencyModal] = useModal(
    <CurrencySearchModal
      onCurrencySelect={handleDynamicCurrencySelect}
      selectedCurrency={currency}
      otherSelectedCurrency={otherCurrency}
      showCommonBases={showCommonBases}
      isZapInput={isZapInput}
    />,
  )

  return disableTokenSelect ? (
    <Flex
      sx={{
        ...styles.primaryFlex,
        cursor: 'default',
        '&:active': { transform: 'none' },
        ':hover': { background: 'white4' },
      }}
    >
      {currency ? (
        <CurrencyLogo currency={currency} size="30px" />
      ) : (
        <Skeleton width="30px" height="30px" animation="waves" variant="circle" />
      )}
      <Text sx={{ ...styles.tokenText }}>{currency?.getSymbol(chainId)}</Text>
    </Flex>
  ) : isRemoveLiquidity ? (
    <Flex
      sx={{
        ...styles.primaryFlex,
        cursor: 'default',
        '&:active': { transform: 'none' },
        ':hover': { background: 'white4' },
      }}
    >
      <DoubleCurrencyLogo currency0={currency} currency1={otherCurrency} size={30} />
      <Text sx={styles.tokenText}>
        {currency?.getSymbol(chainId)} - {otherCurrency?.getSymbol(chainId)}
      </Text>
    </Flex>
  ) : (
    <Flex sx={{ ...styles.primaryFlex }} onClick={onPresentCurrencyModal}>
      {currency ? (
        <CurrencyLogo currency={currency} size="30px" />
      ) : (
        <Skeleton width="30px" height="30px" animation="waves" variant="circle" />
      )}
      <Text sx={{ ...styles.tokenText }}>{currency?.getSymbol(chainId)}</Text>
      <Svg icon="caret" />
    </Flex>
  )
}

export default React.memo(TokenSelector)
