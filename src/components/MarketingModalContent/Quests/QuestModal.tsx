/** @jsxImportSource theme-ui */
import React, { useState } from 'react'
import { SET_DEFAULT_MODAL_KEY, SHOW_DEFAULT_MODAL_KEY } from 'config/constants'
import useIsMobile from 'hooks/useIsMobile'
import MarketingSwipper from './MarketingSwipper'
import CardView from './CardView'

const QuestModal: React.FC<{ onDismiss: () => void }> = ({ onDismiss }) => {
  const isMobile = useIsMobile()
  const [hideDefault, setHideDefault] = useState(false)

  const sdmk = localStorage.getItem(SET_DEFAULT_MODAL_KEY)

  const alreadySet = JSON.parse(sdmk)

  const setDefaultNoShow = () => {
    if (hideDefault) {
      setHideDefault(false)
      localStorage.removeItem(SET_DEFAULT_MODAL_KEY)
    } else {
      localStorage.setItem(SET_DEFAULT_MODAL_KEY, JSON.stringify('TRUE'))
      localStorage.removeItem(SHOW_DEFAULT_MODAL_KEY)
      setHideDefault(!hideDefault)
    }
  }

  return isMobile ? (
    <MarketingSwipper
      onDismiss={onDismiss}
      setDefaultNoShow={setDefaultNoShow}
      hideDefault={hideDefault}
      alreadySet={alreadySet}
    />
  ) : (
    <CardView
      onDismiss={onDismiss}
      setDefaultNoShow={setDefaultNoShow}
      hideDefault={hideDefault}
      alreadySet={alreadySet}
    />
  )
}

export default React.memo(QuestModal)
