/** @jsxImportSource theme-ui */
import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import { Button, Text, Link, Flex, Checkbox } from '@ape.swap/uikit'
import { ListLogo } from 'components/Logo'
import { TokenList } from '@uniswap/token-lists'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'state'
import useFetchListCallback from 'hooks/useFetchListCallback'
import { removeList, enableList } from 'state/lists/actions'
import { useAllLists } from 'state/lists/hooks'
import { useTranslation } from 'contexts/Localization'
import { EXTENDED_LIST_DETAILS } from 'config/constants/lists'

interface ImportProps {
  listURL: string
  list: TokenList
  onImport: () => void
}

const TextDot = styled.div`
  height: 3px;
  width: 3px;
  background-color: ${({ theme }) => theme.colors.text};
  border-radius: 50%;
`

function ImportList({ listURL, list, onImport }: ImportProps) {
  const dispatch = useDispatch<AppDispatch>()

  // user must accept
  const [confirmed, setConfirmed] = useState(false)

  const lists = useAllLists()
  const fetchList = useFetchListCallback()

  const extendedLogo = EXTENDED_LIST_DETAILS[list?.name]?.logo
  const extendedName = EXTENDED_LIST_DETAILS[list?.name]?.name
  const extendedWarning = EXTENDED_LIST_DETAILS[list?.name]?.warning

  // monitor is list is loading
  const adding = Boolean(lists[listURL]?.loadingRequestId)
  const [addError, setAddError] = useState<string | null>(null)

  const { t } = useTranslation()

  const handleAddList = useCallback(() => {
    if (adding) {
      dispatch(enableList(listURL))
      onImport()
    } else {
      setAddError(null)
      fetchList(listURL)
        .then(() => {
          dispatch(enableList(listURL))
          onImport()
        })
        .catch((error) => {
          setAddError(error.message)
          dispatch(removeList(listURL))
        })
    }
  }, [adding, dispatch, fetchList, listURL, onImport])

  return (
    <Flex sx={{ flexDirection: 'column', padding: '10px' }}>
      <Flex sx={{ flexDirection: 'row', justifyContent: 'center' }}>
        {(list.logoURI || extendedLogo) && (
          <ListLogo
            logoURI={extendedLogo || list.logoURI}
            size="40px"
            style={{ borderRadius: '20px', marginRight: '10px' }}
          />
        )}
        <Flex sx={{ flexDirection: 'column', margin: '10px 0px' }}>
          <Flex>
            <Text bold mr="6px">
              {extendedName || list.name}
            </Text>
            <TextDot />
            <Text small color="gray" ml="6px">
              {list.tokens.length} tokens
            </Text>
          </Flex>
          {!extendedName && (
            <Link small external href={`https://tokenlists.org/token-list?url=${listURL}`}>
              {listURL}
            </Link>
          )}
        </Flex>
      </Flex>
      <Flex sx={{ flexDirection: 'column', margin: '10px 0px', textAlign: 'center' }}>
        <Text size="20px" weight={700} textAlign="center" color="error" mb="16px">
          {t('Trade at your own risk!')}
        </Text>
        {extendedWarning ? (
          <>
            <Text color="error">{extendedWarning}</Text>
            <br />
            <Text>
              {t('Want to see your crypto project listed? ')}
              <br />
              <a
                href="https://apeswap.click/partnership"
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'underline' }}
              >
                {t('Apply to be listed today!')}
              </a>
            </Text>
          </>
        ) : (
          <>
            <Text color="error" mb="8px">
              {t(
                'By adding this list you are implicitly trusting that the data is correct. Anyone can create a list, including creating fake versions of existing lists and lists that claim to represent projects that do not have one.',
              )}
            </Text>
            <Text bold color="error" mb="16px">
              {typeof t('If you purchase a token from this list, you may not be able to sell it back.')}
            </Text>
            <Text>
              {t('Want to see your crypto project listed? ')}
              <br />
              <br />
              <a
                href="https://apeswap.click/partnership"
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'underline' }}
              >
                {t('Apply to be listed today!')}
              </a>
            </Text>
          </>
        )}
        <Flex sx={{ alignItems: 'center', margin: '15px 0px 5px 0px', textAlign: 'center' }}>
          <Flex sx={{ alignItems: 'center', margin: '15px 0px 5px 0px', width: '100%', justifyContent: 'center' }}>
            <Checkbox
              name="confirmed"
              type="checkbox"
              checked={confirmed}
              onChange={() => setConfirmed(!confirmed)}
              scale="sm"
            />
            <Text ml="10px" style={{ userSelect: 'none' }}>
              {t('I understand')}
            </Text>
          </Flex>
        </Flex>
        <Flex sx={{ justifyContent: 'center', margin: '10px 0px 0px 0px' }}>
          <Button disabled={!confirmed} onClick={handleAddList}>
            {t('Import')}
          </Button>
        </Flex>
      </Flex>
      {addError ? (
        <Text color="error" style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>
          {addError}
        </Text>
      ) : null}
    </Flex>
  )
}

export default ImportList
