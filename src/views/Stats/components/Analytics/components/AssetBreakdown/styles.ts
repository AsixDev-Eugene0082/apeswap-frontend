import { Flex } from '@apeswapfinance/uikit'
import styled from 'styled-components'

export const Container = styled(Flex)`
  height: 64px;
  width: 100%;
  max-width: 550px;
  margin: 0 auto;
  border-radius: 10px;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  transition: all 0.2s ease;

  :hover {
    background: ${({ theme }) => theme.colors.white4};
  }

  ${({ theme }) => theme.mediaQueries.md} {
    padding: 10px 16px;
  }
`
