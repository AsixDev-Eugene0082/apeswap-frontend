/** @jsxImportSource theme-ui */
import React from 'react'

import { Flex, Text, Button, useMatchBreakpoints } from '@ape.swap/uikit'
import { useTranslation } from 'contexts/Localization'
import { styles } from '../styles'
import useIsMobile from 'hooks/useIsMobile'

const NewToDeFi: React.FC = () => {
  const { t } = useTranslation()
  const { isMd } = useMatchBreakpoints()
  const isMobile = useIsMobile()
  const openLink = (link: string) => window.open(link, '_blank')
  return (
    <Flex sx={styles.ntd}>
      <Flex sx={styles.ntdTop}>
        <Text sx={styles.ntdHeader}>{t('New to DeFi?')}</Text>
        <Text sx={styles.ntdSupportHeader}>
          {t('ApeSwap is the best')}
          {isMobile && !isMd ? <br /> : <> </>}
          {t('place to start!')}
        </Text>
        <Text sx={styles.ntdDescription}>{t('Exchange, Stake, Lend, and Raise, all in one place.')}</Text>
      </Flex>
      <Flex sx={styles.btnContainer}>
        <Button
          variant="secondary"
          onClick={() => openLink('https://welcome.apeswap.finance')}
          sx={{ ...styles.btn, margin: ['20px 0 0 0', 0] }}
        >
          {t('Learn More')}
        </Button>
        <Button onClick={() => openLink('https://apeswap.finance/?modal=tutorial')} sx={styles.btn}>
          {t('Get Started')}
        </Button>
      </Flex>
    </Flex>
  )
}

export default React.memo(NewToDeFi)
