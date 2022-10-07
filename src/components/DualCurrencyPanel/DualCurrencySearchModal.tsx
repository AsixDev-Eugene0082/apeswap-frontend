/** @jsxImportSource theme-ui */
import React, { useCallback, useRef } from 'react'
import { Currency } from '@ape.swap/sdk'
import { Flex, ModalProps, Modal, Input } from '@ape.swap/uikit'
import { useTranslation } from 'contexts/Localization'
import styled from '@emotion/styled'
import { isAddress } from '../../utils'
import { FixedSizeList } from 'react-window'
import CurrencyList from './CurrencyList'
import { DualCurrencySelector } from 'views/Bills/components/Actions/types'
import { styles } from './styles'

interface CurrencySearchModalProps extends ModalProps {
  onCurrencySelect: (currency: DualCurrencySelector, index) => void
  inputCurrencies: Currency[]
  currenciesList: DualCurrencySelector[]
  searchQuery: string
  handleSearchQuery: (val: string) => void
}

export const modalProps = {
  sx: {
    minWidth: ['90%', '425px'],
    width: ['250px'],
    maxWidth: '425px',
    height: ['calc(100vh - 10%)', 'auto'],
  },
}

const DualCurrencySearchModal: React.FC<CurrencySearchModalProps> = ({
  onDismiss = () => null,
  onCurrencySelect,
  currenciesList,
  searchQuery,
  handleSearchQuery,
}) => {
  // refs for fixed size lists
  const fixedList = useRef<FixedSizeList>()
  const { t } = useTranslation()

  const handleCurrencySelect = useCallback(
    (currency: DualCurrencySelector, index) => {
      onDismiss()
      onCurrencySelect(currency, index)
      handleSearchQuery('')
    },
    [onDismiss, onCurrencySelect, handleSearchQuery],
  )

  const handleInput = useCallback(
    (event) => {
      const input = event.target.value
      const checksummedInput = isAddress(input)
      handleSearchQuery(checksummedInput || input)
      fixedList.current?.scrollTo(0)
    },
    [handleSearchQuery],
  )

  const getCurrencyListRows = useCallback(() => {
    return (
      <CurrencyList currenciesList={currenciesList} onCurrencySelect={handleCurrencySelect} fixedListRef={fixedList} />
    )
  }, [currenciesList, handleCurrencySelect])

  return (
    <Modal {...modalProps} onDismiss={onDismiss} title={t('Tokens')}>
      <Flex sx={styles.tokenSearcherContainer}>
        <Flex sx={{ flexDirection: 'column' }}>
          <Flex sx={{ position: 'relative', margin: '10px 0px 15px 0px' }}>
            <StyledInput
              id="token-search-input"
              placeholder={t('Name or Address')}
              autoComplete="off"
              value={searchQuery}
              onChange={handleInput}
              icon="search"
              autoFocus
            />
          </Flex>
          {getCurrencyListRows()}
        </Flex>
      </Flex>
    </Modal>
  )
}

export default React.memo(DualCurrencySearchModal)

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
