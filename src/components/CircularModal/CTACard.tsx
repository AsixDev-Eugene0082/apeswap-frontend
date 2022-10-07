/** @jsxImportSource theme-ui */
import React from 'react'
import { Text, Flex } from '@ape.swap/uikit'

import { useTranslation } from 'contexts/Localization'
import { CTA_CARD_INFO, CTA_TYPE, MODAL_TYPE } from 'config/constants'
import { CTACardProps } from './types'
import { circular } from './styles'

const CTACard: React.FC<CTACardProps> = ({ type, action }) => {
  const { t } = useTranslation()

  const content = CTA_CARD_INFO[type]
  const phModal = action === MODAL_TYPE.POOL_HARVEST
  const maximizer = type === CTA_TYPE.MAXIMIZERS
  const pool = type === CTA_TYPE.POOLS
  const compound = type === CTA_TYPE.COMPOUND
  const gnana = type === CTA_TYPE.GNANA

  const iconUrl = `url(/images/cta/${compound ? 'pools' : type}-icon.svg)`
  const bannersUrl = `url(/images/cta/${compound ? 'pools' : type}-banner.svg)`
  const gnanaDesktop = `url(/images/cta/gnana-lg-banner.svg)`
  const goToDestination = () => window.open(content.destination, '_blank')

  return (
    <Flex
      sx={{
        ...circular.ctaCard,
        backgroundImage: [bannersUrl, gnana && gnanaDesktop],
        backgroundPosition: gnana && 'center',
        color: ((pool || compound) && 'brown') || 'primaryBright',
        '-webkit-transform': (compound || (maximizer && phModal)) && 'scaleX(-1)',
        transform: (compound || (maximizer && phModal)) && 'scaleX(-1)',
      }}
      onClick={goToDestination}
    >
      <Flex
        sx={{
          ...circular.ctaContent,
          '-webkit-transform': (pool || compound) && 'scaleX(-1)',
          transform: (pool || compound) && 'scaleX(-1)',
        }}
      >
        <Flex
          sx={{
            flexDirection: 'column',
            '-webkit-transform': ((maximizer && phModal) || pool) && 'scaleX(-1)',
            textAlign: ((maximizer && phModal) || pool) && 'end',
          }}
        >
          <Text sx={circular.ctaTitle}>{t(`${content.title.toUpperCase()}`)}</Text>
          <Text sx={circular.ctaDescription}>{t(`${content.description}`)}</Text>
        </Flex>
        {!gnana && (
          <Flex
            sx={{
              ...circular.bannerIcon,
              backgroundImage: iconUrl,
            }}
          />
        )}
      </Flex>
    </Flex>
  )
}

export default CTACard
