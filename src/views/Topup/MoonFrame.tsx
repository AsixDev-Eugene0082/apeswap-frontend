import React from 'react'
import styled from 'styled-components'
import Iframe from 'react-iframe'
import { useMoonPayUrl } from 'hooks/api'

const StyledIframe = styled(Iframe)`
  width: 100%;
  max-width: 398px;
  height: calc(100vh - 130px);
  max-height: 738px;
  overflow: hidden;
  margin: 0 auto;
  margin-top: 16px;
  border-radius: 1rem;

  & > div {
    grid-column: span 12;
    width: 100%;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    & > div {
      height: 1200px;
    }
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    & > div {
      height: 860px;
    }
  }
`

export default function MoonPayIframe() {
  const url = useMoonPayUrl()

  return (
    <StyledIframe
      title="Moonpay topup"
      url={url}
      scrolling="no"
      allow="accelerometer; autoplay; camera; gyroscope; payment"
    />
  )
}
