import { Flex } from '@apeswapfinance/uikit'
import React, { useState } from 'react'
import { ContentContainer, AnimatedArrow, ListCardContainer, ListExpandedContainer } from '../../styles'
import { ListCardProps } from './types'

const MobileListCard: React.FC<ListCardProps> = ({ serviceTokenDisplay, title, cardContent, expandedContent }) => {
  const [isOpen, setIsOpen] = useState(false)

  const toogle = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      <ListCardContainer onClick={toogle} isOpen={isOpen}>
        <Flex justifyContent="space-between" alignItems="center" style={{ width: '100%' }}>
          <Flex alignItems="center">
            {serviceTokenDisplay}
            <Flex style={{ flexDirection: 'column', marginLeft: '10px' }}>{title}</Flex>
          </Flex>
          <Flex>{expandedContent && <AnimatedArrow isOpen={isOpen} height={8} />}</Flex>
        </Flex>
        <ContentContainer>{cardContent}</ContentContainer>
      </ListCardContainer>
      <ListExpandedContainer isOpen={isOpen}>{expandedContent}</ListExpandedContainer>
    </>
  )
}

export default React.memo(MobileListCard)
