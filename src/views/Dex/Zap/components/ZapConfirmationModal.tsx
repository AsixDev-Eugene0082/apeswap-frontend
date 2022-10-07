/** @jsxImportSource theme-ui */
import { Modal } from '@ape.swap/uikit'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import React from 'react'
import {
  ConfirmationPendingContent,
  TransactionErrorContent,
  TransactionSubmittedContent,
} from 'components/TransactionConfirmationModal'
import { ChainId } from '@ape.swap/sdk'
import { getBalanceNumber } from 'utils/formatBalance'
import { useTranslation } from 'contexts/Localization'
import { wrappedToNative } from 'utils'
import { MergedZap } from 'state/zap/actions'
import BigNumber from 'bignumber.js'

export interface ZapConfirmationModalProps {
  title?: string
  onDismiss?: () => void
  txHash?: string
  zap: MergedZap
  zapErrorMessage?: string
}

const modalProps = {
  sx: {
    zIndex: 12,
    overflowY: 'auto',
    maxHeight: 'calc(100% - 30px)',
    minWidth: ['90%', '420px'],
    width: '200px',
    maxWidth: '425px',
  },
}

const ZapConfirmationModal: React.FC<ZapConfirmationModalProps> = ({
  zap,
  title,
  onDismiss,
  txHash,
  zapErrorMessage,
}) => {
  const { currencyIn, pairOut } = zap
  const { t } = useTranslation()
  const { chainId } = useActiveWeb3React()
  const currencyInputSymbol =
    currencyIn?.currency?.symbol === 'ETH' ? (chainId === ChainId.BSC ? 'BNB' : 'MATIC') : currencyIn?.currency?.symbol

  const pendingText = `Zapping ${getBalanceNumber(
    new BigNumber(currencyIn.inputAmount.toString()),
    currencyIn.currency.decimals,
  )} ${currencyInputSymbol}
   into ${pairOut?.liquidityMinted?.toSignificant(4)} ${wrappedToNative(
    pairOut?.pair.token0.getSymbol(chainId),
  )}-${wrappedToNative(pairOut?.pair.token1.getSymbol(chainId))} LP`

  return (
    <Modal title={title} {...modalProps} onDismiss={onDismiss}>
      {zapErrorMessage ? (
        <TransactionErrorContent
          onDismiss={onDismiss}
          message={
            zapErrorMessage.includes('INSUFFICIENT')
              ? t('Slippage Error: Please check your slippage using the ⚙️ icon & try again!')
              : zapErrorMessage
          }
        />
      ) : !txHash ? (
        <ConfirmationPendingContent pendingText={pendingText} />
      ) : (
        <TransactionSubmittedContent chainId={chainId} hash={txHash} onDismiss={onDismiss} LpToAdd={pairOut?.pair} />
      )}
    </Modal>
  )
}

export default React.memo(ZapConfirmationModal)
