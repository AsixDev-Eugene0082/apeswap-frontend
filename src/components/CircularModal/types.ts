import { ModalProps } from '@ape.swap/uikit'

export interface CMProps extends ModalProps {
  actionType: 'sellModal' | 'buyModal' | 'generalHarvestModal' | 'poolHarvestModal'
}

export interface MP {
  supporting: string
  description: string
  actionType: 'sellModal' | 'buyModal' | 'generalHarvestModal' | 'poolHarvestModal'
}

export interface CTACardProps {
  type: string
  action: string
}

export interface CTAProps {
  actionType: string
}
