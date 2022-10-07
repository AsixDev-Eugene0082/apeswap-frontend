import styled from 'styled-components'

export const Container = styled.div`
  padding: 0 10px;
  width: 100%;
  margin-top: 24px;
  ${({ theme }) => theme.mediaQueries.md} {
    margin-top: 0;
  }
  ${({ theme }) => theme.mediaQueries.xxl} {
    padding: 0;
  }
`

export const StyledTabNavStats = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  margin: 0 auto;
  width: 100%;
`

interface TabProps {
  isActive: boolean
  disabled?: boolean
}

export const Tab = styled.div<TabProps>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: ${({ disabled }) => (!disabled ? 'pointer' : 'arrow')};
  font-weight: ${(props) => (props.isActive ? 700 : 500)};
  transition: all 0.3s ease-out;
  :hover {
    opacity: ${({ disabled }) => !disabled && '0.6'};
  }
`

export const Bar = styled.div`
  height: 5px;
  width: 100%;
  border-radius: 10px;
  margin-top: 8px;
  background: ${({ theme }) => theme.colors.white3};
`

export const Indicator = styled.div`
  position: absolute;
  bottom: -13px;
  left: 0;
  width: 0;
  height: 5px;
  background-color: ${({ theme }) => theme.colors.text};
  border-radius: 10px;
  transition: 0.2s;
`
