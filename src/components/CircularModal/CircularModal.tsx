/** @jsxImportSource theme-ui */
import React from 'react'
import { useTranslation } from 'contexts/Localization'
import { Text, Flex, Checkbox, Button } from '@ape.swap/uikit'
import { MP } from './types'
import { circular } from './styles'
import { useIsModalShown, useShowModal } from 'state/user/hooks'
import { MODAL_TYPE } from 'config/constants'

const CircularModal: React.FC<MP> = ({ actionType, description, supporting, children }) => {
  const { t } = useTranslation()
  const { showBuyModal, showSellModal, showPoolHarvestModal, showGeneralHarvestModal } = useIsModalShown()
  // Get the boolean values to send to the `displayModal` state
  // based on which modal is currently open
  const flag =
    (actionType === MODAL_TYPE.BUYING && showBuyModal) ||
    (actionType === MODAL_TYPE.SELLING && showSellModal) ||
    (actionType === MODAL_TYPE.POOL_HARVEST && showPoolHarvestModal) ||
    (actionType === MODAL_TYPE.GENERAL_HARVEST && showGeneralHarvestModal)
  const [toggleShowModal] = useShowModal(actionType, flag)
  const openLearnMore = () =>
    window.open(
      'https://apeswap.gitbook.io/apeswap-finance/welcome/apeswap-tokens/banana#what-can-i-do-with-banana',
      '_blank',
    )

  return (
    <Flex sx={circular.container}>
      <Text sx={circular.supporting}>{t(`${supporting}`)}</Text>
      <Text sx={circular.description}>{t(`${description}`)}</Text>

      {children}

      <Flex sx={circular.footer}>
        <Button variant="secondary" sx={{ width: ['100%', '188px'] }} onClick={openLearnMore}>
          {t('Learn More')}
        </Button>
        <Flex sx={circular.checkSection}>
          <Flex sx={circular.checkboxParent}>
            <Checkbox
              id="checkbox"
              checked={flag ? false : true}
              sx={{ backgroundColor: 'white2' }}
              onChange={toggleShowModal}
            />
          </Flex>
          <Text sx={circular.checkboxText}>{t("Don't show this again")}</Text>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default CircularModal
