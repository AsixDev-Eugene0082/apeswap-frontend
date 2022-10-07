/** @jsxImportSource theme-ui */
import React from 'react'
import { Text, Flex } from '@ape.swap/uikit'
import { TranslateFunction } from 'contexts/Localization'
import { styles } from '../styles'

const NumberedList: React.FC<{
  title: string
  description: string
  showBtn?: boolean
  t: TranslateFunction
}> = ({ title, description, showBtn, t, children }) => {
  return (
    <Flex sx={{ flexDirection: 'column' }}>
      <Text size="12px" weight={700}>
        {t(`${title}`)}
      </Text>
      <Flex>
        <Text sx={{ ...styles.playBody, marginBottom: 0 }}>
          {t(`${description}`)} <br />
          {showBtn && (
            <>
              <Text color="yellow" sx={styles.playBody}>
                <a
                  href="https://www.binance.com/en/support/faq/bacaf9595b52440ea2b023195ba4a09c"
                  style={{ textDecoration: 'underline', padding: 0, margin: 0 }}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  {t('Click here')}
                </a>{' '}
              </Text>
              <Text>{t('to learn how to mint your BAB Token.')}</Text>
            </>
          )}
        </Text>
        {children}
      </Flex>
    </Flex>
  )
}

export default React.memo(NumberedList)
