import { Currency } from '@ape.swap/sdk'
import React from 'react'
import styled from 'styled-components'
import CurrencyLogo from './CurrencyLogo'

const Wrapper = styled.div<{ margin: boolean }>`
  display: flex;
  flex-direction: row;
  margin-right: ${({ margin }) => margin && '0px'};
  transform: translate(8px, 0px);
  margin-left: -8px;
`

interface DoubleCurrencyLogoProps {
  margin?: boolean
  size?: number
  currency0?: Currency
  currency1?: Currency
}

export default function DoubleCurrencyLogo({
  currency0,
  currency1,
  size = 20,
  margin = false,
}: DoubleCurrencyLogoProps) {
  return (
    <Wrapper margin={margin}>
      {currency0 && <CurrencyLogo currency={currency0} size={`${size.toString()}px`} style={{ zIndex: 2 }} />}
      {currency1 && (
        <CurrencyLogo
          currency={currency1}
          size={`${size.toString()}px`}
          style={{ transform: 'translate(-13px, 0px)' }}
        />
      )}
    </Wrapper>
  )
}
