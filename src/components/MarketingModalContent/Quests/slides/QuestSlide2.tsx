/** @jsxImportSource theme-ui */
import React from 'react'
import { Box } from 'theme-ui'
import { Heading, Text } from '@ape.swap/uikit'
import { useTranslation } from 'contexts/Localization'
import { styles } from '../styles'

const QuestSlide2 = () => {
  const { t } = useTranslation()
  return (
    <Box sx={{ marginBottom: '20px' }}>
      <Box sx={styles.text}>
        <Heading as="h5" color="yellow" style={{ fontSize: '12px' }}>
          {t('Connect to Genki').toUpperCase()}
        </Heading>
        <Heading>{t('You Have New Quests!')}</Heading>
      </Box>
      <Box sx={{ marginTop: '10px' }}>
        <Text color="yellow" size="14px">
          <a
            href="https://beta-box.genki.io/FLMHAQ"
            style={{ textDecoration: 'underline' }}
            target="_blank"
            rel="noreferrer noopener"
          >
            {t('Visit GENKI')}
          </a>
        </Text>{' '}
        <Text size="14px"> {t('and connect your Wallet to access your available Quests.')}</Text>
      </Box>
    </Box>
  )
}

export default QuestSlide2
