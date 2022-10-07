import { Card } from '@apeswapfinance/uikit'
import styled from 'styled-components'

export const Container = styled.div`
  display: grid;
  gap: 20px;
  width: 100%;
  grid-template-columns: 1;
  padding: 0 10px;
  margin: 34px 0 32px;

  ${({ theme }) => theme.mediaQueries.md} {
    grid-template-columns: repeat(2, 1fr);
    margin: 48px 0 32px;
    padding: 0;
  }
`

export const CardInfo = styled(Card)`
  min-height: 343px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 10px;

  ${({ theme }) => theme.mediaQueries.xxl} {
    padding: 30px 0 0;
  }

  :first-child {
    height: 460px;
  }

  :nth-child(3) {
    padding: 20px 0 0;
    max-height: 343px;

    ${({ theme }) => theme.mediaQueries.xxl} {
      padding: 30px 0 0;
    }
  }

  ${({ theme }) => theme.mediaQueries.md} {
    :first-child {
      height: auto;
    }
  }
`

export const Heading = styled.div`
  font-size: 16px;
  font-weight: 700;

  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 22px;
  }
`

export const StyledTable = styled.table`
  width: 100%;
  max-width: 518px;
  border-collapse: collapse;
  border-radius: 10px;
  overflow: hidden;

  tbody {
    margin-top: 8px;
    font-size: 12px;

    td {
      text-align: center;
      padding: 6px 0;

      div {
        text-align: center;
      }
    }

    tr:nth-child(2n + 1) {
      background-color: ${({ theme }) => theme.colors.white4};
    }

    tr:nth-child(2n) {
      background-color: ${({ theme }) => theme.colors.white3};
    }

    td:nth-child(1) {
      width: 33.33%;
    }

    td:nth-child(2) {
      width: 33.33%;
    }

    td:nth-child(3) {
      width: 33.33%;
    }
  }
`

export const TableHeading = styled.div`
  margin: 28px 0 6px;
  width: 100%;
  max-width: 518px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  text-align: center;

  div {
    font-size: 12px;
    font-weight: 500;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    margin: 16px 0 6px;
  }
`

export const AssetsContainer = styled.div`
  margin-top: 28px;
  height: 100%;
  width: 100%;
  overflow-y: auto;
  ::-webkit-scrollbar {
    width: 5px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    ::-webkit-scrollbar {
      width: 8px;
    }
  }
`

export const TableContainer = styled.div`
  max-width: 518px;
  width: 100%;
  max-height: 208px;
  overflow: hidden;
  overflow-y: auto;
  border-radius: 10px;
  ::-webkit-scrollbar {
    width: 5px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    ::-webkit-scrollbar {
      width: 8px;
    }
  }
`
