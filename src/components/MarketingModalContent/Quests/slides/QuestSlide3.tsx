/** @jsxImportSource theme-ui */
import React from 'react'
import { Box } from 'theme-ui'
import { Heading, Text } from '@ape.swap/uikit'
import { useTranslation } from 'contexts/Localization'
import { styles } from '../styles'

const QuestSlide3 = () => {
  const { t } = useTranslation()
  return (
    <>
      <Box sx={styles.text}>
        <Heading sx={styles.first}>{t('Get it done').toUpperCase()}</Heading>
        <Heading sx={styles.second}>{t('Can You Complete Them All?')}</Heading>
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
            {t('Quests')}
          </a>
        </Text>{' '}
        <Text sx={styles.third}>{t('- the more you complete, the more chances you get!')}</Text>
      </Box>
    </>
  )
}

export default QuestSlide3
