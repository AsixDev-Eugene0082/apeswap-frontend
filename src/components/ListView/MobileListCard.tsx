/** @jsxImportSource theme-ui */
import { Flex, TooltipBubble, InfoIcon } from '@ape.swap/uikit'
import React, { useState } from 'react'
import { ContentContainer, DropDownIcon, ListCardContainer, ListExpandedContainer, styles } from './styles'
import { ListCardProps } from './types'

const MobileListCard: React.FC<ListCardProps> = ({
  serviceTokenDisplay,
  tag,
  title,
  cardContent,
  expandedContent,
  infoContent,
  infoContentPosition,
  open,
  expandedContentSize,
  toolTipIconWidth,
  toolTipStyle,
  ttWidth,
}) => {
  const [expanded, setExpanded] = useState(open)
  return (
    <>
      <ListCardContainer onClick={() => setExpanded((prev) => !prev)}>
        <Flex sx={{ width: '100%', justifyContent: 'space-between' }}>
          <Flex sx={styles.titleContainer}>
            {serviceTokenDisplay}
            <Flex sx={{ flexDirection: 'column', marginLeft: '10px' }}>
              {tag}
              {title}
            </Flex>
          </Flex>
          <Flex>
            {expandedContent && <DropDownIcon open={expanded} mr="20px" />}
            {infoContent && (
              <div style={{ display: 'inline-block', ...toolTipStyle }}>
                <TooltipBubble
                  body={infoContent}
                  transformTip={infoContentPosition || 'translate(0%, 0%)'}
                  width={ttWidth || '200px'}
                >
                  <InfoIcon width={toolTipIconWidth || '25px'} />
                </TooltipBubble>
              </div>
            )}
          </Flex>
        </Flex>
        <ContentContainer>{cardContent}</ContentContainer>
      </ListCardContainer>
      {expandedContent && expanded && (
        <ListExpandedContainer size={expandedContentSize}>{expandedContent}</ListExpandedContainer>
      )}
    </>
  )
}

export default React.memo(MobileListCard)
