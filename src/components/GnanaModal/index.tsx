/** @jsxImportSource theme-ui */
import React from 'react'
import { Modal, ModalProps } from '@ape.swap/uikit'
import Gnana from './Gnana'
import { modalProps } from './styles'

const GnanaModal: React.FC<ModalProps> = ({ onDismiss }) => {
  return (
    <Modal zIndex={10} title="Get GNANA" onDismiss={onDismiss} {...modalProps}>
      <Gnana />
    </Modal>
  )
}

export default GnanaModal
