import { Flex, Text } from '@apeswapfinance/uikit'
import styled from 'styled-components'

export const ControlContainer = styled(Flex)`
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 24px;

  border-radius: 10px;
  padding: 15px;
  background-color: ${({ theme }) => theme.colors.white2};
  width: 100%;

  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
    min-height: 76px;
    height: 100%;
    padding: 20px;
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    padding: 0px 50px;
  }
`

export const MobilePadding = styled(Flex)`
  padding: 7.5px 0;
  ${({ theme }) => theme.mediaQueries.md} {
    padding: 0 0;
  }
`

export const LabelWrapper = styled(Flex)`
  flex-direction: row;
  align-items: center;
  justify-content: center;

  width: 100%;

  ${({ theme }) => theme.mediaQueries.md} {
    max-width: 447px;
  }
`

export const StyledText = styled(Text)`
  font-weight: 700;
  font-size: 16px;
`
