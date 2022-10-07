import { Link } from '@ape.swap/uikit'
import { BaseLayout, Card, Flex } from '@apeswapfinance/uikit'
import styled from 'styled-components'

export const TopContent = styled.div`
  margin: 0 auto;
  max-width: 1200px;
  width: 90%;
  position: relative;
`

export const StyledFlex = styled(Flex)<{ loading: boolean }>`
  align-items: center;
  justify-content: center;
  margin: 20px auto 0;
  max-width: 420px;
  pointer-events: ${(props) => (props.loading ? 'none' : 'all')};
  opacity: ${(props) => (props.loading ? 0.6 : 1)};

  z-index: 100;

  height: 38px;
  width: 100%;

  ${({ theme }) => theme.mediaQueries.md} {
    position: absolute;
    right: 0;
    top: 0;
    transform: translate(-20px, 20px);
    max-width: 240px;
  }
`

export const Cards = styled(BaseLayout)`
  align-items: stretch;
  justify-content: stretch;
  margin-bottom: 32px;

  & > div {
    grid-column: span 6;
    width: 100%;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    & > div {
      grid-column: span 8;
    }
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    & > div {
      grid-column: span 6;
    }
  }
`

export const PaddedCard = styled(Card)`
  padding: 26px;
  margin-bottom: 10px;
`

export const StatsContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

interface PacocaProps {
  width?: string
  height?: string
}

export const Pacoca = styled.div<PacocaProps>`
  background-image: url(/images/pacoca-stats.svg);
  background: url(/images/pacoca-stats.svg);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  height: ${(props) => (props.height ? props.height : '18px')};
  width: ${(props) => (props.width ? props.width : '62px')};
`

export const PacocaCard = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  padding: 16px 32px;
  margin: 0 auto !important;
  max-width: 260px;

  background: ${({ theme }) => theme.colors.white2};
  border-radius: 10px;
`
