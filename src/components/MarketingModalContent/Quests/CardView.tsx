/** @jsxImportSource theme-ui */
import React, { useContext, useState } from 'react'
import { Box, Flex } from 'theme-ui'
import { Button, Checkbox, Heading, IconButton, Modal, Text } from '@ape.swap/uikit'
import { useTranslation } from 'contexts/Localization'
import { ThemeContext } from 'contexts/ThemeContext'
import { Bubble, showApe, styles, subtitle } from './styles'
import { QuestSlides } from './slides'
import { SwiperProps } from './types'

const CardView: React.FC<SwiperProps> = ({ onDismiss, setDefaultNoShow, hideDefault, alreadySet }) => {
  const { t } = useTranslation()
  const { isDark } = useContext(ThemeContext)
  const [activeSlide, setActiveSlide] = useState(0)

  const slideNav = (index: number) => {
    setActiveSlide(index)
  }

  const handleNext = () => {
    if (QuestSlides.length <= activeSlide + 1) {
      onDismiss()
    } else {
      setActiveSlide(activeSlide + 1)
    }
  }

  const modalProps = {
    minWidth: 'unset',
    maxWidth: 'none',
    sx: {
      padding: '0',
    },
  }

  return (
    <Modal onDismiss={onDismiss} {...modalProps}>
      <Flex sx={styles.container}>
        <Box sx={{ position: 'absolute', top: '20px', right: '20px' }}>
          <IconButton width="15px" icon="close" color="text" variant="transparent" onClick={onDismiss} />
        </Box>
        <Flex sx={styles.imagesWrapper}>
          <Box sx={showApe(activeSlide, isDark)} />
        </Flex>
        <Flex sx={styles.textWrapper}>
          <Box sx={{ width: '100%' }}>
            <Heading sx={styles.title}>{t('Welcome to ApeSwap').toUpperCase()}</Heading>
          </Box>
          <Box sx={{ width: '100%' }}>
            <Text sx={subtitle(isDark)}>{t('Your DeFi Journey Starts Here!')}</Text>
          </Box>
          {QuestSlides[activeSlide]}
          <Flex sx={styles.bubbleWrapper}>
            {[...Array(QuestSlides.length)].map((_, i) => {
              return (
                <Bubble
                  isActive={i === activeSlide}
                  onClick={() => slideNav(i)}
                  style={{ marginRight: '10px' }}
                  key={i}
                />
              )
            })}
          </Flex>
          <Flex sx={{ width: '240px' }}>
            <Button fullWidth onClick={handleNext} sx={styles.button}>
              {activeSlide + 1 === QuestSlides.length ? t("I'm ready") : t('Next')}
            </Button>
          </Flex>
          <Flex sx={styles.defaultNoShow}>
            <Flex sx={styles.checkboxCon}>
              <Checkbox
                id="checkbox"
                checked={alreadySet || hideDefault}
                sx={{ backgroundColor: 'white2' }}
                onChange={setDefaultNoShow}
              />
            </Flex>
            <Text sx={styles.checkboxText}>{t('Don’t show this again')}</Text>
          </Flex>
        </Flex>
      </Flex>
    </Modal>
  )
}

export default React.memo(CardView)
