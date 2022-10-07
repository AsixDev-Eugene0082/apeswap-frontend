import { Bills } from 'state/types'
import { TranslateFunction } from 'contexts/Localization'

export interface BillCardProps {
  bill: Bills
  ml?: string
}
export interface PLProps {
  website: string
  twitter: string
  t: TranslateFunction
  isMobile?: boolean
}
