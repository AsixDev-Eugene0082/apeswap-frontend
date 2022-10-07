import React from 'react'
import { Button, Link, Text, TwitterIcon } from '@apeswapfinance/uikit'
import useTheme from 'hooks/useTheme'
import styled from 'styled-components'

const StyledButton = styled(Button)`
  height: 100%;
  max-height: 38px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  text-transform: capitalize;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.white3};
  transition: all 0.2s ease;

  :hover {
    background: ${({ theme }) => theme.colors.white3} !important;
    filter: brightness(1.25);
  }
`

export const ShareButton: React.FC = () => {
  const { theme } = useTheme()

  return (
    <Link
      href="https://twitter.com/intent/tweet?url=&text=I'm%20using%20the%20new%20%23ApeStats%20page!%20Click%20here%20to%20keep%20track%20of%20your%20%23DeFi%20portfolio%20on%20%40ape_swap%2C%20all%20in%20one%20place%3A%20ApeSwap.finance%2FApeStats"
      target="_blank"
      style={{ textDecoration: 'none', width: '100%', maxWidth: '107px', marginLeft: '10px' }}
    >
      <StyledButton startIcon={<TwitterIcon color={theme.colors.white4} fill={theme.colors.text} />}>
        <Text paddingRight="16px" fontSize="12px" fontWeight={500}>
          Share
        </Text>
      </StyledButton>
    </Link>
  )
}
