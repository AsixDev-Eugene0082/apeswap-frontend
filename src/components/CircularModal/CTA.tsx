/** @jsxImportSource theme-ui */
import React from 'react'
import { Flex } from '@ape.swap/uikit'

import CTACard from './CTACard'
import { CTAProps } from './types'
import { CTA_TYPE, MODAL_TYPE } from 'config/constants'

const CTA_CARDS = {
  sellModal: {
    0: <CTACard type={CTA_TYPE.MAXIMIZERS} action={MODAL_TYPE.SELLING} />,
    1: <CTACard type={CTA_TYPE.POOLS} action={MODAL_TYPE.SELLING} />,
    2: <CTACard type={CTA_TYPE.LENDING} action={MODAL_TYPE.SELLING} />,
  },
  buyModal: {
    0: <CTACard type={CTA_TYPE.MAXIMIZERS} action={MODAL_TYPE.BUYING} />,
    1: <CTACard type={CTA_TYPE.POOLS} action={MODAL_TYPE.BUYING} />,
    2: <CTACard type={CTA_TYPE.GNANA} action={MODAL_TYPE.BUYING} />,
  },
  generalHarvestModal: {
    0: <CTACard type={CTA_TYPE.MAXIMIZERS} action={MODAL_TYPE.GENERAL_HARVEST} />,
    1: <CTACard type={CTA_TYPE.POOLS} action={MODAL_TYPE.GENERAL_HARVEST} />,
    2: <CTACard type={CTA_TYPE.GNANA} action={MODAL_TYPE.GENERAL_HARVEST} />,
  },
  poolHarvestModal: {
    0: <CTACard type={CTA_TYPE.COMPOUND} action={MODAL_TYPE.POOL_HARVEST} />,
    1: <CTACard type={CTA_TYPE.MAXIMIZERS} action={MODAL_TYPE.POOL_HARVEST} />,
    2: <CTACard type={CTA_TYPE.GNANA} action={MODAL_TYPE.POOL_HARVEST} />,
  },
}

const CTA: React.FC<CTAProps> = ({ actionType }) => {
  const cards = CTA_CARDS[actionType]
  const cardsLength = Object.keys(cards).length
  return (
    <Flex
      sx={{
        flexDirection: 'column',
        marginTop: ['20px', '30px'],
      }}
    >
      {/* Display each collection of CTACards using the modal actionType */}
      {[...Array(cardsLength)].map((_, idx) => cards[idx])}
    </Flex>
  )
}

export default CTA
