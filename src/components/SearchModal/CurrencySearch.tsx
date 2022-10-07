/** @jsxImportSource theme-ui */
/* eslint-disable no-restricted-syntax */
import React, { KeyboardEvent, useCallback, useMemo, useRef, useState } from 'react'
import { Currency, ETHER, Token } from '@ape.swap/sdk'
import { Text, Flex, Input } from '@ape.swap/uikit'
import { FixedSizeList } from 'react-window'
import styled from '@emotion/styled'
import useDebounce from 'hooks/useDebounce'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { TagInfo, useAllLists, useInactiveListUrls, WrappedTokenInfo } from 'state/lists/hooks'
import { useTranslation } from 'contexts/Localization'
import { useAllTokens, useToken, useIsUserAddedToken } from '../../hooks/Tokens'
import { isAddress } from '../../utils'
import Column from '../layout/Column'
import CommonBases from './CommonBases'
import CurrencyList from './CurrencyList'
import { createFilterToken, useSortedTokensByQuery } from './filtering'
import useTokenComparator from './sorting'
import ImportRow from './ImportRow'
import { useZapInputList } from '../../state/zap/hooks'

interface CurrencySearchProps {
  selectedCurrency?: Currency | null
  onCurrencySelect: (currency: Currency) => void
  otherSelectedCurrency?: Currency | null
  showCommonBases?: boolean
  showImportView: () => void
  setImportToken: (token: Token) => void
  isZapInput?: boolean
}

function useSearchInactiveTokenLists(search: string | undefined, minResults = 10): WrappedTokenInfo[] {
  const lists = useAllLists()
  const inactiveUrls = useInactiveListUrls()
  const { chainId } = useActiveWeb3React()
  const activeTokens = useAllTokens()
  return useMemo(() => {
    if (!search || search.trim().length === 0) return []
    const filterToken = createFilterToken(search)
    const exactMatches: WrappedTokenInfo[] = []
    const rest: WrappedTokenInfo[] = []
    const addressSet: { [address: string]: true } = {}
    const trimmedSearchQuery = search.toLowerCase().trim()
    for (const url of inactiveUrls) {
      const list = lists[url].current
      // eslint-disable-next-line no-continue
      if (!list) continue
      for (const tokenInfo of list.tokens) {
        if (
          tokenInfo.chainId === chainId &&
          !(tokenInfo.address in activeTokens) &&
          !addressSet[tokenInfo.address] &&
          filterToken(tokenInfo)
        ) {
          const tags: TagInfo[] =
            tokenInfo.tags
              ?.map((tagId) => {
                if (!list.tags?.[tagId]) return undefined
                return { ...list.tags[tagId], id: tagId }
              })
              ?.filter((x): x is TagInfo => Boolean(x)) ?? []
          const wrapped: WrappedTokenInfo = new WrappedTokenInfo(tokenInfo, tags)
          addressSet[wrapped.address] = true
          if (
            tokenInfo.name?.toLowerCase() === trimmedSearchQuery ||
            tokenInfo.symbol?.toLowerCase() === trimmedSearchQuery
          ) {
            exactMatches.push(wrapped)
          } else {
            rest.push(wrapped)
          }
        }
      }
    }
    return [...exactMatches, ...rest].slice(0, minResults)
  }, [activeTokens, chainId, inactiveUrls, lists, minResults, search])
}

function CurrencySearch({
  selectedCurrency,
  onCurrencySelect,
  otherSelectedCurrency,
  showCommonBases,
  showImportView,
  setImportToken,
  isZapInput,
}: CurrencySearchProps) {
  const { chainId } = useActiveWeb3React()

  // refs for fixed size lists
  const fixedList = useRef<FixedSizeList>()

  const [searchQuery, setSearchQuery] = useState<string>('')
  const debouncedQuery = useDebounce(searchQuery, 200)

  const [invertSearchOrder] = useState<boolean>(false)

  const allTokens = useAllTokens()

  const rawZapInputList = useZapInputList()

  const zapInputList = useMemo(() => {
    const addresses = []
    if (rawZapInputList) {
      const listByChain = rawZapInputList[chainId]
      for (const res of Object.values(listByChain)) {
        if (res.address[chainId]) {
          addresses.push(res.address[chainId].toLowerCase())
        }
      }
    }
    const filteredZapInputTokens = Object.entries(allTokens).filter((token) =>
      addresses.includes(token[0].toLowerCase()),
    )
    return Object.fromEntries(filteredZapInputTokens)
  }, [allTokens, chainId, rawZapInputList])

  // if they input an address, use it
  const searchToken = useToken(debouncedQuery)
  const searchTokenIsAdded = useIsUserAddedToken(searchToken)
  const { t } = useTranslation()

  const showETH: boolean = useMemo(() => {
    const s = debouncedQuery.toLowerCase().trim()
    return s.includes('') || s.includes('e') || s.includes('et') || s.includes('eth')
  }, [debouncedQuery])

  const filteredTokens: Token[] = useMemo(() => {
    const filterToken = createFilterToken(debouncedQuery)
    if (isZapInput) return Object.values(zapInputList).filter(filterToken)
    return Object.values(allTokens).filter(filterToken)
  }, [allTokens, debouncedQuery, isZapInput, zapInputList])

  const filteredQueryTokens = useSortedTokensByQuery(filteredTokens, debouncedQuery)

  const tokenComparator = useTokenComparator(invertSearchOrder)

  const filteredSortedTokens: Token[] = useMemo(() => {
    return [...filteredQueryTokens].sort(tokenComparator)
  }, [filteredQueryTokens, tokenComparator])

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      onCurrencySelect(currency)
    },
    [onCurrencySelect],
  )

  const handleInput = useCallback((event) => {
    const input = event.target.value
    const checksummedInput = isAddress(input)
    setSearchQuery(checksummedInput || input)
    fixedList.current?.scrollTo(0)
  }, [])

  const handleEnter = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        const s = debouncedQuery.toLowerCase().trim()
        if (s === 'eth') {
          handleCurrencySelect(ETHER)
        } else if (filteredSortedTokens.length > 0) {
          if (
            filteredSortedTokens[0].symbol?.toLowerCase() === debouncedQuery.trim().toLowerCase() ||
            filteredSortedTokens.length === 1
          ) {
            handleCurrencySelect(filteredSortedTokens[0])
          }
        }
      }
    },
    [filteredSortedTokens, handleCurrencySelect, debouncedQuery],
  )

  // if no results on main list, show option to expand into inactive
  const filteredInactiveTokens = useSearchInactiveTokenLists(debouncedQuery)
  const hasFilteredInactiveTokens = Boolean(filteredInactiveTokens?.length)

  const getCurrencyListRows = useCallback(() => {
    if (searchToken && !searchTokenIsAdded && !hasFilteredInactiveTokens) {
      return (
        <Column style={{ padding: '20px 0', height: '100%' }}>
          <ImportRow token={searchToken} showImportView={showImportView} setImportToken={setImportToken} />
        </Column>
      )
    }

    return filteredSortedTokens?.length > 0 || (filteredInactiveTokens?.length > 0 && !isZapInput) ? (
      <CurrencyList
        height={335}
        showETH={showETH}
        currencies={filteredSortedTokens}
        breakIndex={
          Boolean(filteredInactiveTokens?.length) && filteredSortedTokens ? filteredSortedTokens.length : undefined
        }
        onCurrencySelect={handleCurrencySelect}
        otherCurrency={otherSelectedCurrency}
        selectedCurrency={selectedCurrency}
        inactiveCurrencies={filteredInactiveTokens}
        fixedListRef={fixedList}
        showImportView={showImportView}
        setImportToken={setImportToken}
        isZapInput={isZapInput}
      />
    ) : (
      <Column style={{ padding: '20px', height: '100%' }}>
        <Text color="gray" textAlign="center" mb="20px">
          {t('No results found')}
        </Text>
      </Column>
    )
  }, [
    filteredInactiveTokens,
    filteredSortedTokens,
    handleCurrencySelect,
    hasFilteredInactiveTokens,
    otherSelectedCurrency,
    searchToken,
    searchTokenIsAdded,
    selectedCurrency,
    setImportToken,
    showETH,
    showImportView,
    t,
    isZapInput,
  ])

  return (
    <Flex sx={{ flexDirection: 'column' }}>
      <Flex sx={{ position: 'relative', margin: '10px 0px 15px 0px' }}>
        <StyledInput
          id="token-search-input"
          placeholder={t('Name or Address')}
          autoComplete="off"
          value={searchQuery}
          onChange={handleInput}
          onKeyDown={handleEnter}
          icon="search"
          autoFocus
        />
      </Flex>
      {showCommonBases && (
        <CommonBases chainId={chainId} onSelect={handleCurrencySelect} selectedCurrency={selectedCurrency} />
      )}
      {getCurrencyListRows()}
    </Flex>
  )
}

const StyledInput = styled(Input)`
  width: 420px;
  max-width: 100% !important;
  height: 40px;
  border-radius: 10px;
  border: none;
  background-color: ${({ theme }) => theme.colors.white3};
  color: ${({ theme }) => theme.colors.text};
  placeholder-color: ${({ theme }) => theme.colors.gray};
  ::placeholder {
    color: ${(props) => props.theme.colors.text};
  }
  :focus {
    box-shadow: none !important;
  }
`

export default CurrencySearch
