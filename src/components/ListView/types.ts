import { CSSProperties } from 'theme-ui'

export interface ListViewProps {
  tag?: React.ReactNode
  title: React.ReactNode
  infoContent?: React.ReactNode
  infoContentPosition?: string
  open?: boolean
  cardContent: React.ReactNode
  expandedContent?: React.ReactNode
  expandedContentSize?: number
  expandedContentJustified?: string
  billArrow?: boolean
  stakeLp?: boolean
  earnLp?: boolean
  titleContainerWidth?: number
  alignServiceTokens?: boolean
  toolTipIconWidth?: string
  toolTipStyle?: CSSProperties
  ttWidth?: string
}

export interface ListCardProps extends ListViewProps {
  serviceTokenDisplay: React.ReactNode
}

export interface ExtendedListViewProps extends ListViewProps {
  tokens: { token1: string; token2: string; token3?: string; token4?: string }
  viewType: string
  id: string | number
}
