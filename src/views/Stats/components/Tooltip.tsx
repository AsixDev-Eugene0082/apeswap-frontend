import useTheme from 'hooks/useTheme'
import { rgba } from 'polished'
import React from 'react'
import styled from 'styled-components'

interface TooltipProps {
  content: React.ReactNode
  children: React.ReactNode
}

const TooltipContent = styled.div<{ isDark: boolean }>`
  padding: 16px 20px;
  background: ${({ theme }) => theme.colors.white2};
  box-shadow: 0px 0px 25px ${(props) => (props.isDark ? rgba(250, 250, 250, 0.15) : rgba(0, 0, 0, 0.2))};
  border-radius: 10px;
  color: ${({ theme }) => theme.colors.text};
  width: max-content;
  display: none;
  font-size: 14px;
  font-weight: 500;
  line-height: 24px;
  max-height: 500px;
  z-index: 1000;
  position: absolute;
  bottom: calc(100% + 12px);
  transform: translate(36px, 0);
  right: 14px;
  max-width: 246px;

  &:after {
    content: '';
    display: block;
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 8px solid ${({ theme }) => theme.colors.white2};
    bottom: 0;
    position: absolute;
    transform: translate(-48px, 7px);
    right: -24px;
  }
`

const Container = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;

  &:hover ${TooltipContent}, &:focus-within ${TooltipContent} {
    display: block;
  }
`

export const Tooltip = ({ content, children }: TooltipProps) => {
  const { isDark } = useTheme()

  return (
    <Container>
      {children}
      <TooltipContent isDark={isDark}>{content}</TooltipContent>
    </Container>
  )
}
