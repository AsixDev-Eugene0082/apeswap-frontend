/** @jsxImportSource theme-ui */
import React, { useCallback, useState } from 'react'
import { Currency, Token } from '@ape.swap/sdk'
import { Flex, Text, ModalProps, ModalFooter, Modal } from '@ape.swap/uikit'
import { TokenList } from '@uniswap/token-lists'
import { useTranslation } from 'contexts/Localization'
import CurrencySearch from './CurrencySearch'
import ImportToken from './ImportToken'
import Manage from './Manage'
import ImportList from './ImportList'
import { CurrencyModalView } from './types'
import { Box } from 'theme-ui'

interface CurrencySearchModalProps extends ModalProps {
  selectedCurrency?: Currency | null
  onCurrencySelect: (currency: Currency) => void
  otherSelectedCurrency?: Currency | null
  showCommonBases?: boolean
  isZapInput?: boolean
}

export const modalProps = {
  sx: {
    minWidth: ['90%', '425px'],
    width: ['250px'],
    maxWidth: '425px',
    height: ['calc(100vh - 10%)', 'auto'],
  },
}

export default function CurrencySearchModal({
  onDismiss = () => null,
  onCurrencySelect,
  selectedCurrency,
  otherSelectedCurrency,
  showCommonBases = false,
  isZapInput,
}: CurrencySearchModalProps) {
  const [modalView, setModalView] = useState<CurrencyModalView>(CurrencyModalView.search)

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      onDismiss()
      onCurrencySelect(currency)
    },
    [onDismiss, onCurrencySelect],
  )
  // used for import token flow
  const [importToken, setImportToken] = useState<Token | undefined>()

  // used for import list
  const [importList, setImportList] = useState<TokenList | undefined>()
  const [listURL, setListUrl] = useState<string | undefined>()
  const { t } = useTranslation()

  return (
    <Modal {...modalProps} onDismiss={onDismiss} title={t('Tokens')}>
      <Flex
        sx={{
          flexDirection: 'column',
          maxHeight: 'none',
          height: [
            (((modalView === CurrencyModalView.importToken || modalView === CurrencyModalView.importList) && '90%') ||
              (modalView === CurrencyModalView.search && '95%')) ??
              'auto',
            'auto',
          ],
          width: ['auto'],
          overflowY: 'auto',
        }}
        className="YOU"
      >
        <Flex sx={{ flexDirection: 'column', width: '380px', maxWidth: '100%', alignSelf: 'center' }}>
          {modalView === CurrencyModalView.search ? (
            <CurrencySearch
              onCurrencySelect={handleCurrencySelect}
              selectedCurrency={selectedCurrency}
              otherSelectedCurrency={otherSelectedCurrency}
              showCommonBases={showCommonBases}
              showImportView={() => setModalView(CurrencyModalView.importToken)}
              setImportToken={setImportToken}
              isZapInput={isZapInput}
            />
          ) : modalView === CurrencyModalView.importToken && importToken ? (
            <ImportToken tokens={[importToken]} handleCurrencySelect={handleCurrencySelect} />
          ) : modalView === CurrencyModalView.importList && importList && listURL ? (
            <ImportList list={importList} listURL={listURL} onImport={() => setModalView(CurrencyModalView.manage)} />
          ) : modalView === CurrencyModalView.manage ? (
            <Manage
              setModalView={setModalView}
              setImportToken={setImportToken}
              setImportList={setImportList}
              setListUrl={setListUrl}
            />
          ) : (
            ''
          )}
          {modalView === CurrencyModalView.search && !isZapInput && (
            <Box sx={{ marginBottom: ['30px', '0px'] }}>
              <ModalFooter onDismiss={onDismiss}>
                <Text
                  onClick={() => setModalView(CurrencyModalView.manage)}
                  className="list-token-manage-button"
                  sx={{ cursor: 'pointer', textDecoration: 'underline' }}
                >
                  {t('Manage Tokens')}
                </Text>
              </ModalFooter>
            </Box>
          )}
        </Flex>
      </Flex>
    </Modal>
  )
}
