/** @jsxImportSource theme-ui */
import React from 'react'
import { Modal } from '@ape.swap/uikit'
import CircularModal from './CircularModal'
import CTA from './CTA'
import { MODAL_INFO, MODAL_TYPE } from 'config/constants'
import { CMProps } from './types'
import { modalProps } from './styles'

const CM: React.FC<CMProps> = ({ actionType, onDismiss }) => {
  const sellingCTA = <CTA actionType={MODAL_TYPE.SELLING} />
  const gHCTA = <CTA actionType={MODAL_TYPE.GENERAL_HARVEST} />
  const pHCTA = <CTA actionType={MODAL_TYPE.POOL_HARVEST} />
  const buyingCTA = <CTA actionType={MODAL_TYPE.BUYING} />

  return (
    <Modal zIndex={350} title={MODAL_INFO[actionType]['title']} onDismiss={onDismiss} {...modalProps}>
      <CircularModal
        supporting={MODAL_INFO[actionType]['supporting']}
        description={MODAL_INFO[actionType]['description']}
        actionType={actionType}
      >
        {actionType === MODAL_TYPE.SELLING
          ? sellingCTA
          : actionType === MODAL_TYPE.POOL_HARVEST
          ? pHCTA
          : actionType === MODAL_TYPE.GENERAL_HARVEST
          ? gHCTA
          : buyingCTA}
      </CircularModal>
    </Modal>
  )
}

export default CM
