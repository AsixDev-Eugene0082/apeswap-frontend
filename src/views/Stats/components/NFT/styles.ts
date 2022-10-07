import { BaseLayout, Card, Flex, Text } from '@apeswapfinance/uikit'
import styled from 'styled-components'

export const Container = styled.div`
  width: 100%;
  margin-top: 48px;
`

export const StyledFlex = styled(Flex)`
  align-items: center;
  justify-content: center;

  ${({ theme }) => theme.mediaQueries.lg} {
    flex-direction: row;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: column !important;
  }
`

export const ContentCard = styled(BaseLayout)`
  width: 100%;
  min-height: 403px;
  background: ${({ theme }) => theme.colors.white2};
  gap: 20px;
  grid-template-columns: repeat(4, 1fr);
  border-radius: 10px;
  margin: 30px 0 32px;
  padding: 30px;

  ${({ theme }) => theme.mediaQueries.sm} {
    grid-template-columns: repeat(8, 1fr);
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    grid-template-columns: repeat(12, 1fr);
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    grid-template-columns: repeat(16, 1fr);
  }
`

export const StyledCard = styled(Card)`
  background: ${({ theme }) => theme.colors.white3} !important;
  grid-column: span 4 / auto;
  min-height: 343px;

  ${({ theme }) => theme.mediaQueries.sm} {
    grid-column: span 4 / auto;
  }
`

export const StyledText = styled(Text)`
  font-size: 12px;
  font-weight: 500;
  opacity: 0.6;
  margin-top: 4px;
`

export const BillImageContainer = styled.div`
  width: 230px;
  margin: 20px;
  border-radius: 6px;
  overflow: hidden;
`

export const NoContentCard = styled(Card)`
  width: 100%;
  min-height: 403px;
  margin: 30px 0 32px !important;
  padding: 30px;
`
