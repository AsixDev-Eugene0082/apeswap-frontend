import React from 'react'
import { Flex } from '@ape.swap/uikit'
import styled from '@emotion/styled'
import { useTranslation } from 'contexts/Localization'
import { escapeRegExp } from '../../utils'

const StyledInput = styled.input<{
  error?: boolean
  fontSize?: string
  align?: string
  removeLiquidity?: boolean
  disabledText?: boolean
}>`
  color: ${({ error, theme }) => (error ? theme.colors.error : theme.colors.text)};
  opacity: ${({ disabledText }) => disabledText && 0.4};
  display: inline-block;
  width: inherit;
  height: 100%;
  position: relative;
  font-weight: 700;
  minwidth: auto;
  width: auto;
  maxwidth: auto;
  border: none;
  outline: none;
  flex: 1 1 auto;
  background-color: transparent;
  font-size: ${({ fontSize }) => fontSize || '16px'};
  text-align: ${({ align }) => align && align};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  content: '%';
  padding: 0 0 0 0px;
  -webkit-appearance: textfield;

  ::-webkit-search-decoration {
    -webkit-appearance: none;
  }

  [type='number'] {
    -moz-appearance: textfield;
  }

  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  ::placeholder {
    color: ${({ theme }) => theme.colors.text};
  }
  ::after {
    content: '%';
  }
`

const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`) // match escaped "." characters via in a non-capturing group

export const Input = React.memo(function InnerInput({
  value,
  onUserInput,
  placeholder,
  removeLiquidity,
  disabledText,
  ...rest
}: {
  value: string | number
  onUserInput: (input: string) => void
  removeLiquidity?: boolean
  error?: boolean
  fontSize?: string
  disabledText?: boolean
  align?: 'right' | 'left'
} & Omit<React.HTMLProps<HTMLInputElement>, 'ref' | 'onChange' | 'as'>) {
  const { t } = useTranslation()
  const enforcer = (nextUserInput: string) => {
    if (nextUserInput === '' || inputRegex.test(escapeRegExp(nextUserInput))) {
      onUserInput(nextUserInput)
    }
  }

  return (
    <Flex>
      <StyledInput
        {...rest}
        value={value}
        onChange={(event) => {
          // replace commas with periods, because we exclusively uses period as the decimal separator
          enforcer(event.target.value.replace(/,/g, '.'))
          enforcer(event.target.value.replace(/%/g, ''))
        }}
        // universal input options
        inputMode="decimal"
        title={t('Token Amount')}
        autoComplete="off"
        autoCorrect="off"
        // text-specific options
        type="text"
        pattern="^[0-9]*[.,]?[0-9]*$"
        placeholder={placeholder || '0.0'}
        minLength={1}
        maxLength={79}
        spellCheck="false"
        fontSize="22px"
        style={{ marginRight: removeLiquidity ? '0px' : '10px' }}
        removeLiquidity={removeLiquidity}
        disabledText={disabledText}
      />
    </Flex>
  )
})

export default Input
