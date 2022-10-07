/** @jsxImportSource theme-ui */
import React, { memo, useCallback, useMemo, useState, useEffect } from 'react'
import { Button, Text, CheckmarkIcon, CogIcon, Card, Flex, Input } from '@ape.swap/uikit'
import { useSelector } from 'react-redux'
import styled from '@emotion/styled'
import { Switch } from 'theme-ui'
import { TokenList } from '@uniswap/token-lists'
import { EXTENDED_LIST_DETAILS, UNSUPPORTED_LIST_URLS } from 'config/constants/lists'
import { useTranslation } from 'contexts/Localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'

import useFetchListCallback from '../../hooks/useFetchListCallback'
import { AppState, useAppDispatch } from '../../state'
import { disableList, enableList } from '../../state/lists/actions'
import { useIsListActive, useAllLists, useActiveListUrls } from '../../state/lists/hooks'

import uriToHttp from '../../utils/uriToHttp'
import Column, { AutoColumn } from '../layout/Column'
import { ListLogo } from '../Logo'
import Row, { RowFixed, RowBetween } from '../layout/Row'
import { CurrencyModalView } from './types'

const Wrapper = styled(Column)`
  width: 100%;
  height: 100%;
`

const RowWrapper = styled(Row)<{ active: boolean }>`
  background-color: ${({ active, theme }) => (active ? `${theme.colors.success}19` : 'transparent')};
  border: solid 1px;
  border-color: ${({ active, theme }) => (active ? theme.colors.success : theme.colors.white2)};
  transition: 200ms;
  align-items: center;
  padding: 1rem;
  border-radius: 20px;
`

const StyledInput = styled(Input)`
  width: 420px;
  max-width: 100% !important;
  border: none;
`

function listUrlRowHTMLId(listUrl: string) {
  return `list-row-${listUrl.replace(/\./g, '-')}`
}

const ListRow = memo(function ListRow({
  listUrl,
  setListUrl,
  setModalView,
  setImportList,
}: {
  listUrl: string
  setListUrl: (url: string) => void
  setModalView: (view: CurrencyModalView) => void
  setImportList: (list: TokenList) => void
}) {
  const { chainId } = useActiveWeb3React()
  const listsByUrl = useSelector<AppState, AppState['lists']['byUrl']>((state) => state.lists.byUrl)
  const dispatch = useAppDispatch()
  const { current: list } = listsByUrl[listUrl]
  // Extended doesn't need to be defined for each list
  const extendedLogo = EXTENDED_LIST_DETAILS[list?.name]?.logo
  const extendedName = EXTENDED_LIST_DETAILS[list?.name]?.name
  const extendedWarning = EXTENDED_LIST_DETAILS[list?.name]?.warning
  const extendedChainId = EXTENDED_LIST_DETAILS[list?.name]?.chainId

  const isActive = useIsListActive(listUrl)

  const { t } = useTranslation()

  // TODO: allow users to update list versions and remove unwanted list
  // const handleAcceptListUpdate = useCallback(() => {
  //   if (!pending) return
  //   dispatch(acceptListUpdate(listUrl))
  // }, [dispatch, listUrl, pending])

  // const handleRemoveList = useCallback(() => {
  //   // eslint-disable-next-line no-alert
  //   if (window.confirm('Please confirm you would like to remove this list')) {
  //     dispatch(removeList(listUrl))
  //   }
  // }, [dispatch, listUrl])

  const handleEnableList = useCallback(() => {
    dispatch(enableList(listUrl))
  }, [dispatch, listUrl])

  const handleDisableList = useCallback(() => {
    dispatch(disableList(listUrl))
  }, [dispatch, listUrl])

  return extendedChainId && extendedChainId !== chainId ? (
    <></>
  ) : (
    <RowWrapper active={isActive} key={listUrl} id={listUrlRowHTMLId(listUrl)}>
      {extendedLogo || list.logoURI ? (
        <ListLogo
          size="40px"
          style={{ marginRight: '1rem', borderRadius: '20px' }}
          logoURI={extendedLogo || list.logoURI}
          alt={`${extendedName || list.name} list logo`}
        />
      ) : (
        <div style={{ width: '24px', height: '24px', marginRight: '1rem' }} />
      )}
      <Column style={{ flex: '1' }}>
        <Row>
          <Text bold>{extendedName || list.name}</Text>
        </Row>
        <RowFixed>
          <Text fontSize="12px" mr="6px" textTransform="lowercase">
            {list.tokens.length} {t('Tokens')}
          </Text>
          <span>
            <CogIcon color="text" width="12px" />
          </span>
        </RowFixed>
      </Column>
      <Flex sx={{ alignItems: 'flex-end' }}>
        <Switch
          sx={{
            borderRadius: '8px',
            backgroundColor: 'white3',
            'input:checked ~ &': {
              backgroundColor: 'yellow',
            },
          }}
          checked={isActive}
          onChange={() => {
            if (isActive) {
              handleDisableList()
            } else {
              if (!extendedWarning) {
                handleEnableList()
              }
              if (extendedWarning) {
                setImportList(list)
                setModalView(CurrencyModalView.importList)
                setListUrl(listUrl)
              }
            }
          }}
        />
      </Flex>
    </RowWrapper>
  )
})

const ListContainer = styled.div`
  padding: 1rem 0;
  height: 350px;
  overflow: scroll;
  scrollbar-width: none;
  -ms-overflow-style: none;
  ::-webkit-scrollbar {
    display: none;
  }
`

function ManageLists({
  setModalView,
  setImportList,
  setListUrl,
}: {
  setModalView: (view: CurrencyModalView) => void
  setImportList: (list: TokenList) => void
  setListUrl: (url: string) => void
}) {
  const [listUrlInput, setListUrlInput] = useState<string>('')

  const { t } = useTranslation()

  const lists = useAllLists()

  // sort by active but only if not visible
  const activeListUrls = useActiveListUrls()
  const [activeCopy, setActiveCopy] = useState<string[] | undefined>()
  useEffect(() => {
    if (!activeCopy && activeListUrls) {
      setActiveCopy(activeListUrls)
    }
  }, [activeCopy, activeListUrls])

  const handleInput = useCallback((e) => {
    setListUrlInput(e.target.value)
  }, [])

  const fetchList = useFetchListCallback()

  const validUrl: boolean = useMemo(() => {
    return uriToHttp(listUrlInput).length > 0
  }, [listUrlInput])

  const sortedLists = useMemo(() => {
    const listUrls = Object.keys(lists)
    return listUrls
      .filter((listUrl) => {
        // only show loaded lists, hide unsupported lists
        return Boolean(lists[listUrl].current) && !UNSUPPORTED_LIST_URLS.includes(listUrl)
      })
      .sort((u1, u2) => {
        const { current: l1 } = lists[u1]
        const { current: l2 } = lists[u2]

        // first filter on active lists
        if (activeCopy?.includes(u1) && !activeCopy?.includes(u2)) {
          return -1
        }
        if (!activeCopy?.includes(u1) && activeCopy?.includes(u2)) {
          return 1
        }

        if (l1 && l2) {
          // Always make apeswap list in top.
          const keyword = 'apeswap'
          if (l1.name.toLowerCase().includes(keyword) || l2.name.toLowerCase().includes(keyword)) {
            return -1
          }

          return l1.name.toLowerCase() < l2.name.toLowerCase()
            ? -1
            : l1.name.toLowerCase() === l2.name.toLowerCase()
            ? 0
            : 1
        }
        if (l1) return -1
        if (l2) return 1
        return 0
      })
  }, [lists, activeCopy])

  // temporary fetched list for import flow
  const [tempList, setTempList] = useState<TokenList>()
  const [addError, setAddError] = useState<string | undefined>()

  useEffect(() => {
    async function fetchTempList() {
      fetchList(listUrlInput, false)
        .then((list) => setTempList(list))
        .catch(() => setAddError('Error importing list'))
    }
    // if valid url, fetch details for card
    if (validUrl) {
      fetchTempList()
    } else {
      setTempList(undefined)
      if (listUrlInput !== '') {
        setAddError('Enter valid list location')
      }
    }

    // reset error
    if (listUrlInput === '') {
      setAddError(undefined)
    }
  }, [fetchList, listUrlInput, validUrl])

  // check if list is already imported
  const isImported = Object.keys(lists).includes(listUrlInput)

  // set list values and have parent modal switch to import list view
  const handleImport = useCallback(() => {
    if (!tempList) return
    setImportList(tempList)
    setModalView(CurrencyModalView.importList)
    setListUrl(listUrlInput)
  }, [listUrlInput, setImportList, setListUrl, setModalView, tempList])

  return (
    <Wrapper>
      <Flex sx={{ position: 'relative', width: '100%', marginBottom: '20px' }}>
        <StyledInput
          id="list-add-input"
          placeholder={t('https:// or ipfs:// or ENS name')}
          value={listUrlInput}
          onChange={handleInput}
          icon="search"
        />
        {addError ? (
          <Text color="error" style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>
            {addError}
          </Text>
        ) : null}
      </Flex>
      {tempList && (
        <AutoColumn style={{ paddingTop: 0 }}>
          <Card padding="12px 20px">
            <RowBetween>
              <RowFixed>
                {tempList.logoURI && <ListLogo logoURI={tempList.logoURI} size="40px" />}
                <AutoColumn gap="4px" style={{ marginLeft: '20px' }}>
                  <Text bold>{tempList.name}</Text>
                  <Text color="gray" small textTransform="lowercase">
                    {tempList.tokens.length} {t('Tokens')}
                  </Text>
                </AutoColumn>
              </RowFixed>
              {isImported ? (
                <RowFixed>
                  <CheckmarkIcon width="16px" mr="10px" />
                  <Text>{t('Loaded')}</Text>
                </RowFixed>
              ) : (
                <Button onClick={handleImport} size="sm">
                  {t('Import')}
                </Button>
              )}
            </RowBetween>
          </Card>
        </AutoColumn>
      )}
      <ListContainer>
        <AutoColumn gap="md">
          {sortedLists.map((listUrl) => (
            <ListRow
              key={listUrl}
              listUrl={listUrl}
              setListUrl={setListUrl}
              setModalView={setModalView}
              setImportList={setImportList}
            />
          ))}
        </AutoColumn>
      </ListContainer>
    </Wrapper>
  )
}

export default ManageLists
