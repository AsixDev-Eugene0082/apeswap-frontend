export interface ListViewProps {
  cardContent: React.ReactNode
  title: React.ReactNode
  billArrow?: boolean
  stakeLp?: boolean
  viewType?: string
  earnLp?: boolean
  expandedContent?: React.ReactNode
}

export interface ExtendedListViewProps extends ListViewProps {
  id: string | number
  tokens: { token1: string; token2?: string; token3?: string; token4?: string }
}

export interface ListCardProps extends ListViewProps {
  serviceTokenDisplay: React.ReactNode
}
