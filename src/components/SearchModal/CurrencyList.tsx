/** @jsxImportSource theme-ui */
import React, { CSSProperties, MutableRefObject, useCallback, useMemo } from 'react'
import { Currency, CurrencyAmount, currencyEquals, ETHER, Token } from '@ape.swap/sdk'
import { Text, Flex, MetamaskIcon } from '@ape.swap/uikit'
import styled from 'styled-components'
import { Spinner } from 'theme-ui'
import { FixedSizeList } from 'react-window'
import { wrappedCurrency } from 'utils/wrappedCurrency'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useTranslation } from 'contexts/Localization'
import { registerToken } from 'utils/wallet'
import { useCombinedActiveList, WrappedTokenInfo } from '../../state/lists/hooks'
import { useCurrencyBalance } from '../../state/wallet/hooks'
import { useIsUserAddedToken } from '../../hooks/Tokens'
import { CurrencyLogo } from '../Logo'
import { isTokenOnList } from '../../utils'
import ImportRow from './ImportRow'

function currencyKey(currency: Currency): string {
  return currency instanceof Token ? currency.address : currency === ETHER ? 'ETHER' : ''
}

const StyledBalanceText = styled(Text)`
  white-space: nowrap;
  overflow: hidden;
  max-width: 5rem;
  text-overflow: ellipsis;
  weight: 400;
  font-size: 14px;
`

const FixedContentRow = styled.div`
  padding: 4px 20px;
  height: 56px;
  display: grid;
  grid-gap: 16px;
  align-items: center;
`

const CustomFixedList = styled(FixedSizeList)`
  border-radius: 10px 0px 0px 10px;
`

function Balance({ balance }: { balance: CurrencyAmount }) {
  return <StyledBalanceText title={balance?.toExact()}>{balance?.toSignificant(4)}</StyledBalanceText>
}

function CurrencyRow({
  currency,
  onSelect,
  isSelected,
  otherSelected,
  style,
}: {
  currency: Currency
  onSelect: () => void
  isSelected: boolean
  otherSelected: boolean
  style: CSSProperties
}) {
  const { account, chainId } = useActiveWeb3React()
  const { t } = useTranslation()
  const key = currencyKey(currency)
  const selectedTokenList = useCombinedActiveList()
  const isOnSelectedList = isTokenOnList(selectedTokenList, currency)
  const customAdded = useIsUserAddedToken(currency)
  const balance = useCurrencyBalance(account ?? undefined, currency)
  const addToMetaMask = useCallback(
    () =>
      registerToken(
        currency instanceof Token ? currency?.address : '',
        currency?.symbol,
        currency?.decimals,
        currency instanceof WrappedTokenInfo ? currency?.tokenInfo.logoURI : '',
      ).then(() => ''),
    [currency],
  )

  // only show add or remove buttons if not on selected list
  return (
    <Flex
      style={style}
      sx={{
        width: '100%',
        background: 'white3',
        height: '50px',
        cursor: !isSelected && !otherSelected && 'pointer',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '4px 10px 4px 7px',
        opacity: isSelected || otherSelected ? 0.5 : 1,
        ':hover': {
          background: !isSelected && !otherSelected && 'white4',
        },
      }}
      key={`token-item-${key}`}
      className={`token-item-${key}`}
      // if isActive enable click
      onClick={() => (isSelected ? null : onSelect())}
    >
      <Flex sx={{ alignItems: 'center' }}>
        <CurrencyLogo currency={currency} size="30px" style={{ borderRadius: '15px' }} />
        <Flex sx={{ flexDirection: 'column', ml: '10px', alignItems: 'space-between' }}>
          <Flex sx={{ alignItems: 'center' }}>
            <Text title={currency.getName(chainId)} weight={700} sx={{ lineHeight: '22px' }}>
              {currency.getSymbol(chainId)}
            </Text>
            <MetamaskIcon width="13px" ml="7px" mb="1px" onClick={addToMetaMask} />
          </Flex>
          <Text size="12px" weight={300} sx={{ lineHeight: '16px' }}>
            {!isOnSelectedList && customAdded && t('Added by user •')} {currency.getName(chainId)}
          </Text>
        </Flex>
      </Flex>
      <Flex sx={{ justifySelf: 'flex-end' }}>
        {balance ? <Balance balance={balance} /> : account ? <Spinner width="20px" height="20px" /> : null}
      </Flex>
    </Flex>
  )
}

export default function CurrencyList({
  height,
  currencies,
  selectedCurrency,
  inactiveCurrencies,
  onCurrencySelect,
  otherCurrency,
  fixedListRef,
  showETH,
  showImportView,
  setImportToken,
  breakIndex,
  isZapInput,
}: {
  height: number
  currencies: Currency[]
  inactiveCurrencies: Currency[]
  selectedCurrency?: Currency | null
  onCurrencySelect: (currency: Currency) => void
  otherCurrency?: Currency | null
  fixedListRef?: MutableRefObject<FixedSizeList | undefined>
  showETH: boolean
  showImportView: () => void
  setImportToken: (token: Token) => void
  breakIndex: number | undefined
  isZapInput?: boolean
}) {
  const { chainId } = useActiveWeb3React()

  const { t } = useTranslation()

  const resetBreakIndex = showETH ? (breakIndex && breakIndex + 1) ?? undefined : breakIndex

  const itemData: (Currency | undefined)[] = useMemo(() => {
    let formatted: (Currency | undefined)[] = isZapInput
      ? showETH
        ? [Currency.ETHER, ...currencies]
        : currencies
      : showETH
      ? [Currency.ETHER, ...currencies, ...inactiveCurrencies]
      : [...currencies, ...inactiveCurrencies]
    if (resetBreakIndex !== undefined) {
      formatted = [
        ...formatted.slice(0, resetBreakIndex),
        undefined,
        ...formatted.slice(resetBreakIndex, formatted.length),
      ]
    }
    return formatted
  }, [resetBreakIndex, currencies, inactiveCurrencies, showETH, isZapInput])

  const Row = useCallback(
    ({ data, index, style }) => {
      const currency: Currency = data[index]
      const isSelected = Boolean(selectedCurrency && currencyEquals(selectedCurrency, currency))
      const otherSelected = Boolean(otherCurrency && currencyEquals(otherCurrency, currency))
      const handleSelect = () => onCurrencySelect(currency)

      const token = wrappedCurrency(currency, chainId)

      const showImport = index > currencies.length

      if (index === resetBreakIndex || !data) {
        if (isZapInput) return <></>
        return (
          <FixedContentRow style={style} sx={{ alignItems: 'center', justifyContent: 'center' }}>
            <Text size="14px">{t('Expanded results from inactive Token Lists')}</Text>
          </FixedContentRow>
        )
      }

      // show when token is !isActive
      if (showImport && token) {
        return (
          <ImportRow style={style} token={token} showImportView={showImportView} setImportToken={setImportToken} dim />
        )
      }
      return (
        // Show when token isActive
        // show all tokens and tokens that are active
        <CurrencyRow
          style={style}
          currency={currency}
          isSelected={isSelected}
          onSelect={handleSelect}
          otherSelected={otherSelected}
        />
      )
    },
    [
      resetBreakIndex,
      chainId,
      onCurrencySelect,
      otherCurrency,
      selectedCurrency,
      setImportToken,
      showImportView,
      currencies.length,
      t,
      isZapInput,
    ],
  )

  const itemKey = useCallback((index: number, data: any) => currencyKey(data[index]), [])

  return (
    <CustomFixedList
      height={height}
      width="100%"
      ref={fixedListRef as any}
      itemData={itemData}
      itemCount={itemData.length}
      itemSize={56}
      itemKey={itemKey}
    >
      {Row}
    </CustomFixedList>
  )
}
