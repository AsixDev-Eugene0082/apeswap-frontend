import React from 'react'
import styled from 'styled-components'
import { Button } from '@apeswapfinance/uikit'
import { useTranslation } from 'contexts/Localization'

const StyledButton = styled(Button)`
  display: flex;
  align-self: center;
  border: none;
  text-decoration: underline;
  margin-top: 10px;
  text-transform: capitalize;
`

const UnderlinedButton: React.FC<{ text: string; handleClick: () => void }> = ({ text, handleClick }) => {
  const { t } = useTranslation()

  return (
    <StyledButton variant="text" onClick={handleClick}>
      {t(text)}
    </StyledButton>
  )
}

export default UnderlinedButton
