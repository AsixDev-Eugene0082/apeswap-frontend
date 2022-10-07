/** @jsxImportSource theme-ui */
import React, { useCallback, useState } from 'react'
import { Modal, ModalProvider } from '@ape.swap/uikit'
import { Box } from 'theme-ui'
import { useTranslation } from 'contexts/Localization'
import RegularLiquidity from './RegularLiquidity'
import ZapLiquidity from './ZapLiquidity'
import ZapSwitch from './components/ZapSwitch'
import { TransactionSubmittedContent } from '../TransactionConfirmationModal'
import { Pair } from '@ape.swap/sdk'
import useActiveWeb3React from '../../hooks/useActiveWeb3React'

interface DualLiquidityModalProps {
  onDismiss?: () => void
}

const modalProps = {
  sx: {
    zIndex: 11,
    overflowY: 'auto',
    maxHeight: 'calc(100% - 30px)',
    minWidth: ['90%', '420px'],
    width: '200px',
    maxWidth: '425px',
  },
}

const DualLiquidityModal: React.FC<DualLiquidityModalProps> = ({ onDismiss = () => null }) => {
  const { t } = useTranslation()
  const [goZap, setGoZap] = useState(true)
  const [{ txHash, pairOut }, setTxHash] = useState({
    txHash: '',
    pairOut: null,
  })
  const { chainId } = useActiveWeb3React()

  const handleConfirmedTx = useCallback((hash: string, pair: Pair) => {
    setTxHash({ txHash: hash, pairOut: pair })
  }, [])

  const handleZapSwitch = useCallback(() => {
    setGoZap(!goZap)
  }, [goZap])

  return (
    <>
      {txHash ? (
        <Modal open {...modalProps} title={t('Confirm ZAP')} onDismiss={onDismiss}>
          <TransactionSubmittedContent chainId={chainId} hash={txHash} onDismiss={onDismiss} LpToAdd={pairOut} />
        </Modal>
      ) : (
        <ModalProvider>
          <Modal open {...modalProps} title={t('Liquidity')} onDismiss={onDismiss}>
            <Box>
              <ZapSwitch goZap={goZap} handleZapSwitch={handleZapSwitch} />
              {goZap ? <ZapLiquidity handleConfirmedTx={handleConfirmedTx} /> : <RegularLiquidity />}
            </Box>
          </Modal>
        </ModalProvider>
      )}
    </>
  )
}

export default React.memo(DualLiquidityModal)
