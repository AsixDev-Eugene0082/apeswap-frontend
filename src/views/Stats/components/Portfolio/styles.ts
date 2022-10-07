import { ArrowDropUpIcon, Card, Flex, Text } from '@apeswapfinance/uikit'
import styled from 'styled-components'

export const Container = styled.div`
  max-width: 1200px;
  width: 100%;
  margin: 48px 0 12px;
`

export const CardInfo = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 100%;
  padding: 15px 10px;
  margin-bottom: 20px !important;

  ${({ theme }) => theme.mediaQueries.md} {
    padding: 18px 22px;
  }
`

export const StyledDiv = styled.div`
  width: 100%;
`

export const TableHeader = styled(Flex)`
  align-items: center;
  padding: 0 22px;

  div {
    font-weight: 700;
  }

  div:first-child {
    max-width: 308px;
    width: 100%;
  }
`

export const Content = styled.div<{ isOpen: boolean }>`
  max-width: 1160px;
  width: 100%;
  max-height: ${(props) => (props.isOpen ? '9999px' : 0)};
  height: auto;

  margin: ${(props) => (props.isOpen ? '16px 0 0' : 0)};
  overflow: hidden;

  transition: all 0.4s ${(props) => (props.isOpen ? 'cubic-bezier(1,0,1,0)' : 'cubic-bezier(0,1,0,1)')};
`

export const StyledText = styled(Text)`
  display: flex;
  align-items: center;
  justify-content: end;
  margin-right: 36px;

  div {
    opacity: 0.5;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    margin-right: 42px;
  }
`

export const AnimatedArrow = styled(ArrowDropUpIcon)<{ isOpen: boolean }>`
  transform: ${(props) => (props.isOpen ? 'rotate(0)' : 'rotate(180deg)')};
  transition: all 0.5s ease;
  cursor: pointer;
`

export const ChainDisplay = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 10px;
  background: ${({ theme }) => theme.colors.white4};
  cursor: pointer;

  ${({ theme }) => theme.mediaQueries.md} {
    padding: 8px 16px 8px 32px;
  }
`

export const ListCardContainer = styled(Flex)<{ isOpen?: boolean }>`
  align-items: center;

  height: 60px;
  padding: 10px;
  background: ${({ theme }) => theme.colors.white3};

  ${({ theme }) => theme.mediaQueries.md} {
    height: 80px;
    padding: 20px;
    border-bottom: 1px solid rgba(226, 226, 226, 0.2);
  }
`

export const ListExpandedContainer = styled(Flex)<{ isOpen: boolean }>`
  height: auto;
  max-height: ${(props) => (props.isOpen ? '9999px' : 0)};
  width: 100%;

  flex-wrap: wrap;
  overflow: hidden;

  background: ${({ theme }) => theme.colors.white3};
  border-bottom: 1px solid rgba(226, 226, 226, 0.2);

  transition: all 0.4s ${(props) => (props.isOpen ? 'cubic-bezier(1,0,1,0)' : 'cubic-bezier(0,1,0,1)')};
`

export const ListViewContainer = styled.div<{ isOpen: boolean }>`
  width: 100%;
  max-height: ${(props) => (props.isOpen ? '9999px' : 0)};
  height: auto;
  transition: all 0.4s ${(props) => (props.isOpen ? 'cubic-bezier(1,0,1,0)' : 'cubic-bezier(0,1,0,1)')};
  overflow: hidden;

  & ${ListCardContainer}:last-child {
    border: none;
  }

  & ${ListExpandedContainer}:last-child {
    border: none;
  }
`

export const ContentContainer = styled(Flex)`
  align-items: center;
  justify-content: space-between;

  width: 0;

  ${({ theme }) => theme.mediaQueries.md} {
    height: 60px;
    width: 100%;
  }
`

export const LargeDiv = styled.div`
  max-width: 150px;
  width: 100%;
`

export const MediumDiv = styled.div`
  max-width: 110px;
  width: 100%;
`
