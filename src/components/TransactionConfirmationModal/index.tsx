/** @jsxImportSource theme-ui */
import React, { useCallback } from 'react'
import { ChainId, Currency, Pair, Token } from '@ape.swap/sdk'
import styled from 'styled-components'
import { Button, Text, ErrorIcon, Flex, Link, MetamaskIcon, Spinner } from '@ape.swap/uikit'
import { Modal, ModalProps } from '@apeswapfinance/uikit'
import { registerToken } from 'utils/wallet'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { dexStyles } from 'views/Dex/styles'
import { wrappedCurrency } from 'utils/wrappedCurrency'
import { ArrowUpCircle } from 'react-feather'
import { useTranslation } from 'contexts/Localization'
import { getEtherscanLink } from 'utils'
import { RowFixed } from '../layout/Row'
import { AutoColumn, ColumnCenter } from '../layout/Column'
import getCleanLpSymbol from '../../utils/getCleanLpSymbol'

const Wrapper = styled.div`
  width: 100%;
`

const ConfirmedIcon = styled(ColumnCenter)`
  padding: 24px 0;
`

export function ConfirmationPendingContent({ pendingText }: { pendingText: string }) {
  const { t } = useTranslation()
  return (
    <Flex
      sx={{
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        margin: '15px 0px',
        borderRadius: '10px',
      }}
    >
      <Flex sx={{ alignItems: 'center', justifyContent: 'center' }}>
        <Spinner size={150} />
      </Flex>
      <Flex
        sx={{
          flexDirection: 'column',
          alignItems: 'center',
          background: 'white3',
          padding: '10px 20px',
          margin: '10px',
          borderRadius: '10px',
        }}
      >
        <Text size="20px" weight={500} margin="5px 0px" sx={{ textAlign: 'center' }}>
          {t('Waiting For Confirmation')}
        </Text>
        <Flex margin="10px 0px">
          <Text weight={700} sx={{ textAlign: 'center' }}>
            {pendingText}
          </Text>
        </Flex>
        <Text size="14px" weight={400}>
          {t('Confirm this transaction in your wallet')}
        </Text>
      </Flex>
    </Flex>
  )
}

export function TransactionSubmittedContent({
  onDismiss,
  chainId,
  hash,
  currencyToAdd,
  LpToAdd,
}: {
  onDismiss: () => void
  hash: string | undefined
  chainId: ChainId
  currencyToAdd?: Currency | undefined
  LpToAdd?: Pair
}) {
  const { library } = useActiveWeb3React()

  const token: Token | undefined = wrappedCurrency(currencyToAdd, chainId)
  const { t } = useTranslation()

  return (
    <Wrapper>
      <ConfirmedIcon>
        <ArrowUpCircle strokeWidth={1} size={97} color="rgba(255, 179, 0, 1)" />
      </ConfirmedIcon>
      <AutoColumn gap="12px" justify="center">
        <Text fontSize="20px">{t('Transaction Submitted')}</Text>
        {chainId && hash && (
          <Link color="text" external small href={getEtherscanLink(hash, 'transaction', chainId)}>
            {t('View on explorer')}
          </Link>
        )}
        {currencyToAdd && library?.provider?.isMetaMask && (
          <Button
            variant="tertiary"
            mt="12px"
            onClick={() => registerToken(token.address, token.symbol, token.decimals, '')}
          >
            <RowFixed>
              <Text>{t(`Add %symbol% to Metamask`, { symbol: currencyToAdd.getSymbol(chainId) })}</Text>
              <MetamaskIcon width="16px" ml="6px" />
            </RowFixed>{' '}
          </Button>
        )}
        {LpToAdd && library?.provider?.isMetaMask && (
          <Button
            variant="tertiary"
            mt="12px"
            onClick={() => registerToken(LpToAdd?.liquidityToken?.address, getCleanLpSymbol(LpToAdd, chainId), 18, '')}
          >
            <RowFixed>
              <Text>{t('Add Ape LP to Metamask')}</Text>
              <MetamaskIcon width="16px" ml="6px" />
            </RowFixed>{' '}
          </Button>
        )}
        <Button fullWidth onClick={onDismiss} style={{ height: '50px', fontSize: '20px' }} mt="20px">
          {t('Close')}
        </Button>
      </AutoColumn>
    </Wrapper>
  )
}

export function ConfirmationModalContent({
  bottomContent,
  topContent,
}: {
  topContent: () => React.ReactNode
  bottomContent: () => React.ReactNode
}) {
  return (
    <Flex sx={{ ...dexStyles.dexContainer, padding: '0px' }}>
      <div>{topContent()}</div>
      <div>{bottomContent()}</div>
    </Flex>
  )
}

export function TransactionErrorContent({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  const { t } = useTranslation()
  return (
    <Wrapper>
      <AutoColumn justify="center">
        <ErrorIcon color="error" width="64px" />
        <Text color="error" style={{ textAlign: 'center', width: '85%' }}>
          {message}
        </Text>
        <Flex justifyContent="center" pt="24px">
          <Button onClick={onDismiss}>{t('Dismiss')}</Button>
        </Flex>
      </AutoColumn>
    </Wrapper>
  )
}

interface ConfirmationModalProps {
  title: string
  customOnDismiss?: () => void
  hash: string | undefined
  content: () => React.ReactNode
  attemptingTxn: boolean
  pendingText: string
  currencyToAdd?: Currency | undefined
}

const TransactionConfirmationModal: React.FC<ModalProps & ConfirmationModalProps> = ({
  title,
  onDismiss,
  customOnDismiss,
  attemptingTxn,
  hash,
  pendingText,
  content,
  currencyToAdd,
}) => {
  const { chainId } = useActiveWeb3React()

  const handleDismiss = useCallback(() => {
    if (customOnDismiss) {
      customOnDismiss()
    }
    onDismiss()
  }, [customOnDismiss, onDismiss])

  if (!chainId) return null

  return (
    <Flex sx={{ width: '420px' }}>
      <Modal title={title} onDismiss={handleDismiss} maxWidth="100%">
        <Flex sx={{ width: '380px', maxWidth: '100%' }}>
          {attemptingTxn ? (
            <ConfirmationPendingContent pendingText={pendingText} />
          ) : hash ? (
            <TransactionSubmittedContent
              chainId={chainId}
              hash={hash}
              onDismiss={onDismiss}
              currencyToAdd={currencyToAdd}
            />
          ) : (
            content()
          )}
        </Flex>
      </Modal>
    </Flex>
  )
}

export default TransactionConfirmationModal
