import { ArrowDropUpSmallIcon, Skeleton, Flex } from '@apeswapfinance/uikit'
import Logo from 'components/Logo/Logo'
import styled from 'styled-components'

export const TokenContainer = styled(Logo)<{
  size?: number
  image?: string
  ml?: number
  mr?: number
  mt?: number
  zIndex?: number
}>`
  width: ${({ size }) => size || 30}px;
  height: ${({ size }) => size || 30}px;
  margin-left: ${({ ml }) => ml}px;
  margin-right: ${({ mr }) => mr}px;
  margin-top: ${({ mt }) => mt}px;
  z-index: ${({ zIndex }) => zIndex};
  border-radius: ${({ size }) => (size || 35) / 2}px;
  ${({ theme }) => theme.mediaQueries.lg} {
    width: ${({ size }) => size || 35}px;
    height: ${({ size }) => size || 35}px;
  }
`
export const TokenWrapper = styled(Flex)<{
  size?: number
  image?: string
  ml?: number
  mr?: number
  mt?: number
  zIndex?: number
}>`
  width: ${({ size }) => size + 2 || 32}px;
  height: ${({ size }) => size + 2 || 32}px;
  margin-left: ${({ ml }) => ml}px;
  margin-right: ${({ mr }) => mr}px;
  margin-top: ${({ mt }) => mt}px;
  z-index: ${({ zIndex }) => zIndex || 1};
  background: #fff;
  justify-content: center;
  align-items: center;
  border-radius: ${({ size }) => (size || 37) / 2}px;
  ${({ theme }) => theme.mediaQueries.lg} {
    width: ${({ size }) => size + 2 || 37}px;
    height: ${({ size }) => size + 2 || 37}px;
  }
`

export const EarnIcon = styled(ArrowDropUpSmallIcon)<{ color?: string }>`
  transform: rotate(90deg);
  fill: ${({ theme, color }) => color || theme.colors.text};
`

export const IconSkeleton = styled(Skeleton)<{ size?: number; ml?: number; mr?: number; zIndex?: number }>`
  width: ${({ size }) => size || 30}px;
  height: ${({ size }) => size || 30}px;
  margin-left: ${({ ml }) => ml}px;
  margin-right: ${({ mr }) => mr}px;
  z-index: ${({ zIndex }) => zIndex};
  border-radius: ${({ size }) => (size || 35) / 2}px;
  border: 1px solid white;
  ${({ theme }) => theme.mediaQueries.lg} {
    width: ${({ size }) => size || 35}px;
    height: ${({ size }) => size || 35}px;
  }
`
