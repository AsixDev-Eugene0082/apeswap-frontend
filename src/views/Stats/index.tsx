import React from 'react'
import { StatsProvider } from 'state/statsPage/hooks'
import Stats from './Stats'

const StatsPage = () => {
  return (
    <StatsProvider>
      <Stats />
    </StatsProvider>
  )
}

export default StatsPage
