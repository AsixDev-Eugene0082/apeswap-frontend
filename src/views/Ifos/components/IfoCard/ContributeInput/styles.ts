import styled from 'styled-components'
import { Button, Flex } from '@apeswapfinance/uikit'

export const Box = styled(Flex)`
  gap: 20px;
  justify-content: space-between;
  margin-bottom: 12px;
`

export const ContributeButton = styled(Button)`
  width: 130px;
  margin-right: 10px;
`

export const Container = styled.div`
  display: flex;
  border-radius: 10px;
  height: 48px;
  background-color: ${({ theme }) => theme.colors.white2};
`

export const StyledTokenInput = styled.div`
  margin-right: 10px;
`

export const StyledSpacer = styled.div`
  width: ${(props) => props.theme.spacing[2]}px;
`

export const StyledTokenAdornmentWrapper = styled.div`
  align-items: center;
  display: flex;
`

export const StyledButton = styled(Button)`
  align-items: center;
  display: flex;
  background-color: #ffb300;
  box-shadow: none;
  text-transform: uppercase;
  font-weight: 500;
  font-size: 12px;
  padding-left: 10px;
  padding-right: 10px;
  border-radius: 10px;
`

export const StyledBalance = styled.div`
  align-items: center;
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  font-size: 12px;
  font-weight: 500;
  height: 18px;
  justify-content: space-between;
  margin: 5px;
`

export const StyledTokenSymbol = styled.span`
  color: ${({ theme }) => theme.colors.text};
  font-weight: 500;
`
