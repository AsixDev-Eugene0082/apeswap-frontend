/** @jsxImportSource theme-ui */
import React from 'react'
import { ChainId, Currency, currencyEquals, ETHER, Token } from '@ape.swap/sdk'
import { Flex, Text } from '@ape.swap/uikit'
import { useTranslation } from 'contexts/Localization'
import { SUGGESTED_BASES } from '../../config/constants'
import { CurrencyLogo } from '../Logo'

const style = {
  wrapper: {
    background: 'white3',
    borderRadius: '10px',
    padding: '5px 10px',
    width: 'fit-content',
    height: 'fit-content',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '2.5px 5px 2.5px 0px',
    cursor: 'pointer',
    ':hover': {
      background: 'white4',
    },
  },
}

export default function CommonBases({
  chainId,
  onSelect,
  selectedCurrency,
}: {
  chainId?: ChainId
  selectedCurrency?: Currency | null
  onSelect: (currency: Currency) => void
}) {
  const { t } = useTranslation()
  return (
    <Flex sx={{ flexDirection: 'column', marginBottom: '15px' }}>
      <Text size="11px" weight={700} ml="2px">
        {t('Common bases')}
      </Text>
      <Flex sx={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        <Flex
          onClick={() => {
            if (!selectedCurrency || !currencyEquals(selectedCurrency, ETHER)) {
              onSelect(ETHER)
            }
          }}
          sx={style.wrapper}
          disable={selectedCurrency === ETHER}
        >
          <CurrencyLogo currency={ETHER} style={{ marginRight: 8 }} />
          <Text> {Currency.getNativeCurrencySymbol(chainId)}</Text>
        </Flex>
        {(chainId ? SUGGESTED_BASES[chainId] : []).map((token: Token) => {
          const selected = selectedCurrency instanceof Token && selectedCurrency.address === token.address
          return (
            <Flex
              sx={style.wrapper}
              onClick={() => !selected && onSelect(token)}
              disable={selected}
              key={token.address}
            >
              <CurrencyLogo currency={token} style={{ marginRight: 8 }} />
              <Text>{token.symbol}</Text>
            </Flex>
          )
        })}
      </Flex>
    </Flex>
  )
}
