/** @jsxImportSource theme-ui */
import React from 'react'
import ServiceTokenDisplay from 'components/ServiceTokenDisplay'
import useIsMobile from 'hooks/useIsMobile'
import ListCard from './ListCard'
import { ListViewContainer } from './styles'
import MobileListCard from './MobileListCard'
import { ExtendedListViewProps } from './types'

const ListView: React.FC<{ listViews: ExtendedListViewProps[] }> = ({ listViews }) => {
  const isMobile = useIsMobile()

  return (
    <ListViewContainer>
      {listViews.map((view) => {
        return isMobile ? (
          <MobileListCard
            serviceTokenDisplay={
              <ServiceTokenDisplay
                token1={view.tokens.token1}
                token2={view.tokens.token2}
                token3={view.tokens?.token3}
                token4={view.tokens?.token4}
                billArrow={view?.billArrow}
                earnLp={view?.earnLp}
                stakeLp={view?.stakeLp}
                dualEarn={view.tokens?.token4 != null}
              />
            }
            tag={view?.tag}
            title={view.title}
            cardContent={view.cardContent}
            expandedContent={view.expandedContent}
            infoContent={view.infoContent}
            infoContentPosition={view?.infoContentPosition}
            key={view.id}
            open={view?.open}
            expandedContentSize={view?.expandedContentSize}
            titleContainerWidth={view?.titleContainerWidth}
            toolTipIconWidth={view?.toolTipIconWidth}
            toolTipStyle={view?.toolTipStyle}
            ttWidth={view?.ttWidth}
          />
        ) : (
          <ListCard
            serviceTokenDisplay={
              <ServiceTokenDisplay
                token1={view.tokens.token1}
                token2={view.tokens.token2}
                token3={view.tokens?.token3}
                token4={view.tokens?.token4}
                billArrow={view?.billArrow}
                earnLp={view?.earnLp}
                stakeLp={view?.stakeLp}
                dualEarn={view.tokens?.token4 != null}
              />
            }
            tag={view?.tag}
            title={view.title}
            cardContent={view.cardContent}
            expandedContent={view.expandedContent}
            infoContent={view.infoContent}
            infoContentPosition={view?.infoContentPosition}
            expandedContentJustified={view?.expandedContentJustified}
            titleContainerWidth={view?.titleContainerWidth}
            key={view.id}
            open={view?.open}
            alignServiceTokens={view?.alignServiceTokens}
            toolTipIconWidth={view?.toolTipIconWidth}
            toolTipStyle={view?.toolTipStyle}
            ttWidth={view?.ttWidth}
          />
        )
      })}
    </ListViewContainer>
  )
}

export default React.memo(ListView)
