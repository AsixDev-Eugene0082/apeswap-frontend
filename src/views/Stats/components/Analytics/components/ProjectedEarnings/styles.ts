import { Flex, Text } from '@apeswapfinance/uikit'
import styled from 'styled-components'

export const FlexScroll = styled(Flex)`
  align-items: center;
  width: calc(100% - 16px);

  ${({ theme }) => theme.mediaQueries.md} {
    width: calc(100% - 72px);
  }
`

export const ScrollMenu = styled.nav`
  position: relative;

  overflow-x: scroll;
  scrollbar-width: none;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  scroll-padding-block: 72px;
  white-space: nowrap;

  width: 100%;
  height: 38px;
  margin-top: 16px;
  text-align: center;

  ::-webkit-scrollbar {
    display: none;
  }
`

export const Tab = styled(Text)`
  display: inline-block;
  padding: 0 4px;
  margin: 0 16px;
  transition: all 0.2s ease;
  cursor: pointer;

  scroll-snap-align: center;

  :hover {
    opacity: 0.6;
  }

  :focus-visible {
    outline: none;
  }
`

export const Indicator = styled.div`
  position: absolute;
  bottom: 8px;

  left: 0;
  width: 0;
  height: 4px;

  background-color: ${({ theme }) => theme.colors.text};
  border-radius: 10px;
  transition: 0.2s;
`
