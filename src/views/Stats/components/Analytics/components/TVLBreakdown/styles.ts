import { Flex } from '@apeswapfinance/uikit'
import styled from 'styled-components'

export const TableInfo = styled.div`
  max-width: 234px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
`

interface CircleProps {
  name: string
}

export const circleColors = {
  farms: '#F4BE37',
  pools: '#548DE1',
  jungleFarms: '#E74F4F',
  lending: '#9033F6',
  maximizer: '#69A588',
}

export const Circle = styled.div<CircleProps>`
  height: 8px;
  width: 8px;
  border-radius: 50%;

  background-color: ${(props) => circleColors[props.name]};
`

export const TableRowContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`

export const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`

export const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;

  > div:last-child {
    color: ${({ theme }) => theme.colors.gray};
  }
`

export const StyledFlex = styled(Flex)`
  align-items: center;
  justify-content: space-evenly;
  flex-direction: column;
  width: 100%;
  height: 100%;
  margin-top: 16px;
  gap: 28px;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    gap: 0px;
    margin-top: 0;
  }
`
