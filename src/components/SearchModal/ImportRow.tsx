/** @jsxImportSource theme-ui */
import React, { CSSProperties } from 'react'
import { Token } from '@ape.swap/sdk'
import { Button, Text, CheckmarkCircleIcon, Flex } from '@ape.swap/uikit'
import CurrencyLogo from 'components/Logo/CurrencyLogo'
import { EXTENDED_LIST_DETAILS } from 'config/constants/lists'
import { ListLogo } from 'components/Logo'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useCombinedInactiveList } from 'state/lists/hooks'
import styled from 'styled-components'
import { useIsUserAddedToken, useIsTokenActive } from 'hooks/Tokens'
import { useTranslation } from 'contexts/Localization'
import { RowFixed } from '../layout/Row'

const TokenSection = styled.div<{ dim?: boolean }>`
  padding: 4px 5px;
  height: 150px;
  display: grid;
  grid-template-columns: auto minmax(auto, 1fr) auto;
  grid-gap: 16px;
  align-items: center;
  margin: 5px 0px;

  opacity: ${({ dim }) => (dim ? '0.4' : '1')};
`

const CheckIcon = styled(CheckmarkCircleIcon)`
  height: 16px;
  width: 16px;
  margin-right: 6px;
  stroke: ${({ theme }) => theme.colors.success};
`

const NameOverflow = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 140px;
  font-size: 12px;
`

export default function ImportRow({
  token,
  style,
  dim,
  showImportView,
  setImportToken,
}: {
  token: Token
  style?: CSSProperties
  dim?: boolean
  showImportView: () => void
  setImportToken: (token: Token) => void
}) {
  // globals
  const { chainId } = useActiveWeb3React()

  // check if token comes from list
  const inactiveTokenList = useCombinedInactiveList()
  const list = chainId && inactiveTokenList?.[chainId]?.[token.address]?.list

  // Extended doesn't need to be defined for each list
  const extendedLogo = EXTENDED_LIST_DETAILS[list?.name]?.logo
  const extendedName = EXTENDED_LIST_DETAILS[list?.name]?.name

  // check if already active on list or local storage tokens
  const isAdded = useIsUserAddedToken(token)
  const isActive = useIsTokenActive(token)
  const { t } = useTranslation()

  return (
    <TokenSection style={style}>
      <CurrencyLogo currency={token} size="24px" style={{ opacity: dim ? '0.6' : '1' }} />
      <Flex sx={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
        <Flex sx={{ alignItems: 'center' }}>
          <Text>{token.symbol}</Text>
          <Text color="textDisabled" ml="8px">
            <NameOverflow title={extendedName || token.name}>{extendedName || token.name}</NameOverflow>
          </Text>
        </Flex>
        {list && (list.logoURI || extendedLogo) && (
          <Flex sx={{ alignItems: 'center' }}>
            <Text size="8px" mr="10px" color="textDisabled" sx={{ lineHeight: '0px' }}>
              via {extendedName || list.name}
            </Text>
            <ListLogo logoURI={extendedLogo || list.logoURI} size="12px" style={{ borderRadius: '6px' }} />
          </Flex>
        )}
      </Flex>
      {!isActive && !isAdded ? (
        <Button
          size="sm"
          onClick={() => {
            if (setImportToken) {
              setImportToken(token)
            }
            showImportView()
          }}
        >
          {t('Import')}
        </Button>
      ) : (
        <RowFixed style={{ minWidth: 'fit-content' }}>
          <CheckIcon />
          <Text color="success">{t('Active')}</Text>
        </RowFixed>
      )}
    </TokenSection>
  )
}
