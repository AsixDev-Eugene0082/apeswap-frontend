/** @jsxImportSource theme-ui */
import React from 'react'
import { Box } from 'theme-ui'
import { Heading, Text } from '@ape.swap/uikit'
import { useTranslation } from 'contexts/Localization'
import { styles } from '../styles'

const QuestSlide1 = () => {
  const { t } = useTranslation()
  return (
    <>
      <Box sx={styles.text}>
        <Heading sx={styles.first}>{t("Let's get started").toUpperCase()}</Heading>
        <Heading sx={styles.second}>{t('Hello, Crypto Adventurer')}</Heading>
      </Box>
      <Box sx={styles.thirdWrapper}>
        <Text sx={styles.third}>{t('Complete the')}</Text>{' '}
        <Text color="yellow" sx={styles.third}>
          <a
            href="https://box.genki.io/RJ4LP3"
            style={{ textDecoration: 'underline' }}
            target="_blank"
            rel="noreferrer noopener"
          >
            {t('introductory Quests')}
          </a>
        </Text>{' '}
        <Text sx={styles.third}>{t('to earn great rewards while you learn!')}</Text>
      </Box>
    </>
  )
}

export default QuestSlide1
