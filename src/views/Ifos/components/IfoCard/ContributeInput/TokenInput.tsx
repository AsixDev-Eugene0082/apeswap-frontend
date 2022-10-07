/** @jsxImportSource theme-ui */
import React from 'react'
import { useTranslation } from 'contexts/Localization'
import Input, { InputProps } from 'components/Input'
import { Box } from 'theme-ui'
import { StyledBalance, StyledButton, StyledSpacer, StyledTokenAdornmentWrapper, StyledTokenInput } from './styles'

interface TokenInputProps extends InputProps {
  max: number | string
  symbol: string
  onSelectMax?: () => void
}

const TokenInput: React.FC<TokenInputProps> = ({ max, symbol, onChange, onSelectMax, value }) => {
  const { t } = useTranslation()
  return (
    <StyledTokenInput>
      <StyledBalance>
        <Box>{t('Balance')}:</Box>
        <Box>
          {max.toLocaleString()} {symbol}
        </Box>
      </StyledBalance>
      <Input
        endAdornment={
          <StyledTokenAdornmentWrapper>
            <StyledSpacer />
            <div>
              <StyledButton size="sm" onClick={onSelectMax}>
                {t('Max')}
              </StyledButton>
            </div>
          </StyledTokenAdornmentWrapper>
        }
        onChange={onChange}
        placeholder="0"
        value={value}
        height={'44px'}
      />
    </StyledTokenInput>
  )
}

export default TokenInput
