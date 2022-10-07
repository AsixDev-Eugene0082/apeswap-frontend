import { Flex } from '@ape.swap/uikit'
import React from 'react'
import TreasuryBreakdown from './components/TreasuryBreakdown'
import TreasuryHistory from './components/TreasuryHistory'

const Treasury: React.FC = () => {
  return (
    <Flex
      sx={{
        position: 'relative',
        maxWidth: '1200px',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
      }}
    >
      <TreasuryHistory />
      <TreasuryBreakdown />
    </Flex>
  )
}

export default React.memo(Treasury)
