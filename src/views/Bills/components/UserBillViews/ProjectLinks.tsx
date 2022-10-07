/** @jsxImportSource theme-ui */
import React from 'react'
import { Flex, LinkExternal } from '@ape.swap/uikit'
import { PLProps } from './types'
import { styles } from './styles'

const ProjectLinks: React.FC<PLProps> = ({ website, twitter, isMobile, t }) => {
  return (
    <Flex>
      {(website || twitter) && (
        <Flex sx={styles.links}>
          {website && (
            <Flex sx={{ justifyContent: 'center', alignItems: 'center' }} mt="5px">
              <LinkExternal href={website} style={{ fontSize: (isMobile && '12px') || '14px' }}>
                {t('Website')}
              </LinkExternal>
            </Flex>
          )}
          {twitter && (
            <Flex sx={{ justifyContent: 'center', alignItems: 'center' }} mt="5px" ml="20px">
              <LinkExternal href={twitter} style={{ fontSize: (isMobile && '12px') || '14px' }}>
                {t('Twitter')}
              </LinkExternal>
            </Flex>
          )}
        </Flex>
      )}
    </Flex>
  )
}

export default ProjectLinks
