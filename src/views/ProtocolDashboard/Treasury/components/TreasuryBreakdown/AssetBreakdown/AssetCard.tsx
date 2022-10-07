/** @jsxImportSource theme-ui */
import { Flex, Svg, TagVariants, Text } from '@ape.swap/uikit'
import { styles, StyledTag } from './styles'
import ServiceTokenDisplay from 'components/ServiceTokenDisplay'
import React, { useState } from 'react'
import CountUp from 'react-countup'
import { AnimatePresence, motion } from 'framer-motion'
import { useTranslation } from 'contexts/Localization'
import { CHAIN_PARAMS, NETWORK_LABEL } from 'config/constants/chains'
import useIsMobile from 'hooks/useIsMobile'

const AssetCard: React.FC<{ token: any }> = ({ token }) => {
  const isMobile = useIsMobile()
  const [expanded, setExpanded] = useState(false)
  const { t } = useTranslation()
  return (
    <Flex sx={{ ...styles.assetContainer, background: expanded ? 'white4' : 'white3' }}>
      <Flex
        sx={{
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          minHeight: '60px',
        }}
        onClick={() => setExpanded((prev) => !prev)}
      >
        <Flex sx={{ alignItems: 'center' }}>
          <Flex>
            {token?.isLp ? (
              <ServiceTokenDisplay
                token1={token?.token0?.symbol}
                token2={token?.token1?.symbol}
                size={40}
                noEarnToken
              />
            ) : (
              <ServiceTokenDisplay token1={token?.symbol} size={40} />
            )}
            <Flex sx={{ alignItems: 'flex-start', transform: 'translate(-10px, 0px)' }}>
              <ServiceTokenDisplay token1={CHAIN_PARAMS?.[token?.chainId]?.nativeCurrency?.symbol} size={13.5} />
            </Flex>
          </Flex>
          <Text weight={700} ml="5px" size={isMobile ? '12px' : '16px'}>
            {token?.isLp ? `${token?.token0?.symbol}-${token?.token1?.symbol}` : token?.symbol}
          </Text>
          {token?.type &&
            (token?.type === 'apeswap' ? (
              <StyledTag variant={'rgb(77, 64, 64)' as TagVariants}>
                {isMobile ? t('APE') : t(token?.type.toUpperCase())}
              </StyledTag>
            ) : (
              <StyledTag variant={'#00983D' as TagVariants}>
                {isMobile ? t('PTNR') : t(token?.type.toUpperCase())}
              </StyledTag>
            ))}
        </Flex>
        <Flex>
          <Text weight={700} mr="10px">
            $<CountUp end={token?.value} decimals={0} duration={1} separator="," />
          </Text>
          <Svg icon="caret" direction={expanded ? 'up' : 'down'} />
        </Flex>
      </Flex>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'fit-content' }}
            transition={{ opacity: { duration: 0.2 } }}
            exit={{ opacity: 0, height: 0 }}
            sx={{ position: 'relative' }}
          >
            <Flex sx={{ width: '100%', flexDirection: 'column', flexWrap: 'wrap', mt: '5px', height: 'fit-content' }}>
              <Flex sx={{ justifyContent: 'space-around', flexWrap: 'wrap' }}>
                <Flex sx={styles.assetRow}>
                  <Text weight={500} sx={{ lineHeight: '10px' }}>
                    {t('Value')}:
                  </Text>
                  <Text weight={700} sx={{ lineHeight: '10px' }}>
                    $<CountUp end={token?.value} decimals={2} duration={1} separator="," />
                  </Text>
                </Flex>
                <Flex sx={styles.assetRow}>
                  <Text weight={500} sx={{ lineHeight: '10px' }}>
                    {t('Chain')}:
                  </Text>
                  <Text weight={700} sx={{ lineHeight: '10px' }}>
                    {NETWORK_LABEL[token?.chainId]}
                  </Text>
                </Flex>
              </Flex>
              <Flex sx={{ justifyContent: 'space-around', flexWrap: 'wrap' }}>
                <Flex sx={styles.assetRow}>
                  <Text weight={500} sx={{ lineHeight: '10px' }}>
                    {t('Location')}:
                  </Text>
                  <Text weight={700} sx={{ lineHeight: '10px' }}>
                    {token?.location === 'POL' ? `${token?.location} - ${token?.type.toUpperCase()}` : token?.location}
                  </Text>
                </Flex>
                <Flex sx={styles.assetRow}>
                  <Text weight={500} sx={{ lineHeight: '10px' }}>
                    {t('Amount')}:
                  </Text>
                  <Text weight={700} sx={{ lineHeight: '10px' }}>
                    <CountUp end={token?.amount} decimals={2} duration={1} separator="," />
                  </Text>
                </Flex>
              </Flex>
            </Flex>
          </motion.div>
        )}
      </AnimatePresence>
    </Flex>
  )
}

export default React.memo(AssetCard)
