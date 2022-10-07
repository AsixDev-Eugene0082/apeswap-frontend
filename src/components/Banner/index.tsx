/** @jsxImportSource theme-ui */
import { useHistory } from 'react-router-dom'
import { Flex, Button } from '@ape.swap/uikit'
import useTheme from 'hooks/useTheme'
import { Text } from 'theme-ui'
import useProgressiveImage from 'hooks/useProgressiveImage'
import React from 'react'
import { useTranslation } from 'contexts/Localization'
import { styles, FlexImage, LearnMoreArrow, FlexSkeleton } from './styles'
import { BannerTypes, ColorProps } from './types'

const Banner: React.FC<{
  banner: BannerTypes
  link: string
  title?: string
  children?: React.FC
  listViewBreak?: boolean
  margin?: string
  titleColor?: ColorProps
  maxWidth?: number
}> = ({ banner, children, title, listViewBreak, margin, titleColor, link, maxWidth = 1200 }) => {
  const history = useHistory()
  const { isDark } = useTheme()
  const { t } = useTranslation()
  const loaded = useProgressiveImage(`../images/new-banners/${banner}-${isDark ? 'night' : 'day'}.svg`)

  const openBannerLink = (bannerLink: string) =>
    bannerLink.includes('modal') ? history.push({ search: bannerLink }) : window.open(bannerLink, '_blank')

  // Media breaks are used until tablet mode on list view is designed
  return (
    <Flex sx={{ ...styles.flexPrimary, margin }}>
      {loaded ? (
        <FlexImage sx={{ backgroundImage: `url(${loaded})` }} maxWidth={maxWidth} listViewBreak={listViewBreak} />
      ) : (
        <FlexSkeleton maxWidth={maxWidth} listViewBreak={listViewBreak} />
      )}
      <Flex sx={{ ...styles.titleContainer }}>
        <Text
          sx={{
            ...styles.titleText,
            color: titleColor || 'text',
            '@media screen and (min-width: 500px) and (max-width: 851px)': {
              fontSize: listViewBreak ? '25px' : '5vw',
              lineHeight: listViewBreak ? '25px' : '5vw',
            },
          }}
        >
          {title.toUpperCase()}
        </Text>
        <Button
          variant="text"
          onClick={() => openBannerLink(link)}
          sx={{
            ...styles.learnText,
            color: titleColor || 'text',

            '&&&:hover': {
              textDecoration: 'none',
              color: titleColor || 'text',
            },
          }}
        >
          {t('Learn More')} <LearnMoreArrow color={titleColor || 'text'} />
        </Button>
      </Flex>
      {children}
    </Flex>
  )
}

export default React.memo(Banner)
