import { BaseLayout, Card, Flex, Text } from '@apeswapfinance/uikit'
import { rgba } from 'polished'
import styled from 'styled-components'

export const Container = styled.div`
  max-width: 1240px;
  width: 100%;
  margin: 0 auto;
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

export const Header = styled.div`
  display: flex;
  flex-direction: column;

  height: 300px;
  border-radius: 10px;
  margin: 20px 20px 0;
  padding: 20px 10px 0;

  overflow-y: hidden;
  overflow-x: hidden;
  background-image: ${({ theme }) =>
    theme.isDark ? 'url(/images/new-banners/stats-banner-night.svg)' : 'url(/images/new-banners/stats-banner-day.svg)'};
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;

  z-index: -1;

  ${({ theme }) => theme.mediaQueries.md} {
    padding: 0 24px;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    padding: 0 10px;
  }
`

export const StyledHeading = styled(Flex)`
  flex-direction: column;
  align-items: center;
  justify-content: center;

  font-size: 32px;
  max-width: 374px;
  width: 100%;
  margin-top: -16px;

  z-index: 1;

  & ${Text} {
    color: ${({ theme }) => theme.colors.primaryBright};
  }

  ${({ theme }) => theme.mediaQueries.md} {
    margin-top: 0;
  }
`

export const PaddedCard = styled(Card)`
  padding: 26px;
  margin-bottom: 10px;
`

export const HeadingContainer = styled(Flex)`
  justify-content: center;

  width: 100%;
  max-width: 1160px;
  margin: 0 auto;

  color: ${({ theme }) => theme.colors.white3};

  position: relative;

  ${({ theme }) => theme.mediaQueries.md} {
    justify-content: space-between;
  }
`

export const GridCardsContainer = styled.div`
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(3, 1fr);

  width: 100%;
  max-width: 1160px;
  margin: auto auto 20px auto;
`

export const TranslucidCard = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  height: 90px;
  background: ${({ theme }) => (theme.isDark ? rgba(11, 11, 11, 0.4) : rgba(253, 251, 245, 0.2))} !important;
  backdrop-filter: blur(16px);
`

export const CardLabel = styled(Text)`
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.primaryBright};
  opacity: ${({ theme }) => (theme.isDark ? '0.5' : '0.7')};
`

export const MobileCard = styled(Card)`
  height: 200px;
  max-width: 240px;
  margin: -114px auto 0 auto !important;

  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  justify-content: center;

  text-align: center;

  div:first-child {
    font-size: 12px;
  }
`

export const TransparentGradient = styled.div`
  position: absolute;
  top: 0;
  transform: translateY(-48px);

  height: 200px;
  width: 110%;
  background: linear-gradient(rgba(0, 0, 0, 0.4) 0.47%, rgba(0, 0, 0, 0) 98.62%);
`

export const PacocaPortfolio = styled(Card)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background-color: ${({ theme }) => (theme.isDark ? rgba(11, 11, 11, 0.4) : rgba(253, 251, 245, 0.2))} !important;
  backdrop-filter: blur(16px);
  padding: 10px 32px;

  ${({ theme }) => theme.mediaQueries.md} {
    background-color: transparent !important;
    margin-top: -8px !important;
  }
`
