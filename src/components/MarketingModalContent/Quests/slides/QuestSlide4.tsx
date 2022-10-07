/** @jsxImportSource theme-ui */
import React from 'react'
import { Box } from 'theme-ui'
import { Heading, Text } from '@ape.swap/uikit'
import { useTranslation } from 'contexts/Localization'
import { styles } from '../styles'

const QuestSlide4 = () => {
  const { t } = useTranslation()
  return (
    <>
      <Box sx={styles.text}>
        <Heading sx={styles.first}>{t('Ready, steady, go').toUpperCase()}</Heading>
        <Heading sx={styles.second}>{t('Congratulations!')}</Heading>
      </Box>
      <Box sx={styles.thirdWrapper}>
        <Text sx={styles.third}>{t('You are officially ready to begin your')}</Text>{' '}
        <Text color="yellow" sx={styles.third}>
          <a
            href="https://box.genki.io/RJ4LP3"
            style={{ textDecoration: 'underline' }}
            target="_blank"
            rel="noreferrer noopener"
          >
            {t('DeFi journey')}
          </a>
        </Text>{' '}
        <Text sx={styles.third}>{t('with ApeSwap. Good luck!')}</Text>
      </Box>
    </>
  )
}

export default QuestSlide4
