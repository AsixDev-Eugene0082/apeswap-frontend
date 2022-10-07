import React from 'react'
import { Flex, Text } from '@apeswapfinance/uikit'
import { ListCardContainer, ContentContainer } from '../../styles'
import { ListCardProps } from './types'

const ListCard: React.FC<ListCardProps> = ({ serviceTokenDisplay, title, cardContent }) => {
  return (
    <ListCardContainer>
      <Flex alignItems="center" style={{ height: '100%', maxWidth: '308px', width: '100%' }}>
        {serviceTokenDisplay}
        <Flex marginLeft={10} flexDirection="row">
          <Text>{title}</Text>
        </Flex>
      </Flex>
      <ContentContainer>{cardContent}</ContentContainer>
    </ListCardContainer>
  )
}

export default React.memo(ListCard)
