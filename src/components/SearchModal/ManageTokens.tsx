/** @jsxImportSource theme-ui */
import React, { useRef, RefObject, useCallback, useState, useMemo } from 'react'
import { Token } from '@ape.swap/sdk'
import { Text, Button, CloseIcon, LinkExternal, Link, Flex, Input } from '@ape.swap/uikit'
import { RowBetween, RowFixed } from 'components/layout/Row'
import { useToken } from 'hooks/Tokens'
import styled from '@emotion/styled'
import { useRemoveUserAddedToken } from 'state/user/hooks'
import useUserAddedTokens from 'state/user/hooks/useUserAddedTokens'
import { CurrencyLogo } from 'components/Logo'
import { getEtherscanLink, isAddress } from 'utils'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useTranslation } from 'contexts/Localization'
import ImportRow from './ImportRow'
import { CurrencyModalView } from './types'

const Wrapper = styled.div`
  width: 100%;
  height: calc(100% - 60px);
  position: relative;
  padding-bottom: 60px;
`
const Footer = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const StyledInput = styled(Input)`
  width: 420px;
  max-width: 100% !important;
  border: none;
`

export default function ManageTokens({
  setModalView,
  setImportToken,
}: {
  setModalView: (view: CurrencyModalView) => void
  setImportToken: (token: Token) => void
}) {
  const { chainId } = useActiveWeb3React()

  const [searchQuery, setSearchQuery] = useState<string>('')

  // manage focus on modal show
  const inputRef = useRef<HTMLInputElement>()
  const handleInput = useCallback((event) => {
    const input = event.target.value
    const checksummedInput = isAddress(input)
    setSearchQuery(checksummedInput || input)
  }, [])

  // if they input an address, use it
  const searchToken = useToken(searchQuery)

  // all tokens for local list
  const userAddedTokens: Token[] = useUserAddedTokens()
  const removeToken = useRemoveUserAddedToken()

  const handleRemoveAll = useCallback(() => {
    if (chainId && userAddedTokens) {
      userAddedTokens.map((token) => {
        return removeToken(chainId, token.address)
      })
    }
  }, [removeToken, userAddedTokens, chainId])

  const tokenList = useMemo(() => {
    return (
      chainId &&
      userAddedTokens.map((token) => (
        <RowBetween key={token.address} width="100%" sx={{ margin: '20px 0px' }}>
          <RowFixed>
            <CurrencyLogo currency={token} size="20px" />
            <Link external href={getEtherscanLink(token.address, 'address', chainId)} color="gray" ml="10px">
              {token.symbol}
            </Link>
          </RowFixed>
          <RowFixed>
            <CloseIcon onClick={() => removeToken(chainId, token.address)} mr="5px" sx={{ cursor: 'pointer' }} />
            <LinkExternal href={getEtherscanLink(token.address, 'address', chainId)} />
          </RowFixed>
        </RowBetween>
      ))
    )
  }, [userAddedTokens, chainId, removeToken])

  const isAddressValid = searchQuery === '' || isAddress(searchQuery)

  const { t } = useTranslation()

  return (
    <Wrapper>
      <Flex sx={{ position: 'relative', width: '100%', marginBottom: '20px' }}>
        <StyledInput
          id="token-search-input"
          placeholder="0x0000"
          value={searchQuery}
          autoComplete="off"
          ref={inputRef as RefObject<HTMLInputElement>}
          onChange={handleInput}
          icon="search"
        />
      </Flex>
      {!isAddressValid && <Text color="error">Enter valid token address</Text>}
      {searchToken && (
        <ImportRow
          token={searchToken}
          showImportView={() => setModalView(CurrencyModalView.importToken)}
          setImportToken={setImportToken}
          style={{ height: 'fit-content' }}
        />
      )}
      {tokenList}
      <Footer>
        <Text bold textAlign="center">
          {userAddedTokens?.length} {userAddedTokens.length === 1 ? t('Custom Token') : t('Custom Tokens')}
        </Text>
        {userAddedTokens.length > 0 && (
          <Button onClick={handleRemoveAll} size="sm">
            {t('Clear all')}
          </Button>
        )}
      </Footer>
    </Wrapper>
  )
}
