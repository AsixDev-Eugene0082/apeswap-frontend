import React from 'react'
import ServiceTokenDisplay from 'components/ServiceTokenDisplay'
import useIsMobile from 'hooks/useIsMobile'
import MobileListCard from './MobileListCard'
import ListCard from './ListCard'
import { ListViewContainer } from '../../styles'
import { ExtendedListViewProps } from './types'

interface ListViewProps {
  isOpen: boolean
  listViews: ExtendedListViewProps[]
}

const ListView: React.FC<ListViewProps> = ({ listViews, isOpen }) => {
  const isMobile = useIsMobile()

  return (
    <ListViewContainer isOpen={isOpen}>
      {listViews.map((view) => {
        return isMobile ? (
          <MobileListCard
            key={view.id}
            serviceTokenDisplay={
              <ServiceTokenDisplay
                token1={view.tokens.token1}
                token2={view.tokens.token2}
                token3={view.tokens?.token3}
                token4={view.tokens?.token4}
                stakeLp={view?.stakeLp != null}
                earnLp={view.earnLp != null}
                billArrow={view.billArrow}
              />
            }
            title={view.title}
            cardContent={view.cardContent}
            expandedContent={view.expandedContent}
          />
        ) : (
          <ListCard
            serviceTokenDisplay={
              <ServiceTokenDisplay
                token1={view.tokens.token1}
                token2={view.tokens.token2}
                token3={view.tokens?.token3}
                token4={view.tokens?.token4}
                stakeLp={view?.stakeLp != null}
                earnLp={view.earnLp != null}
                billArrow={view.billArrow}
              />
            }
            title={view.title}
            cardContent={view.cardContent}
            key={view.id}
          />
        )
      })}
    </ListViewContainer>
  )
}

export default React.memo(ListView)
