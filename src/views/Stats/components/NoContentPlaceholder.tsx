import React from 'react'
import { Flex, Text } from '@apeswapfinance/uikit'
import styled from 'styled-components'

import MonkeyImage from 'views/Dex/Orders/components/OrderHistoryPanel/MonkeyImage'

const StyledFlex = styled(Flex)`
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 24px;
`

export const NoContentPlaceholder: React.FC<{ mt: string }> = ({ mt }) => {
  return (
    <StyledFlex mt={mt}>
      <MonkeyImage />
      <Text style={{ opacity: 0.7 }}>Nothing to show here yet...</Text>
    </StyledFlex>
  )
}
