import React, { useState, useRef } from 'react'
import { Input } from '@apeswapfinance/uikit'
import styled from '@emotion/styled'

const StyledInput = styled(Input)`
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.white3};
  height: 36px;
  width: 100%;
  font-weight: 800;
  border: none;
`

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 369px;
`

const Container = styled.div<{ toggled: boolean }>``

interface Props {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const SearchInput: React.FC<Props> = ({ value, onChange }) => {
  const [toggled, setToggled] = useState(false)
  const inputEl = useRef(null)

  return (
    <Container toggled={toggled}>
      <InputWrapper>
        <StyledInput ref={inputEl} value={value} onChange={onChange} onBlur={() => setToggled(false)} icon="search" />
      </InputWrapper>
    </Container>
  )
}

export default SearchInput
