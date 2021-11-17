import React from 'react'
import { Route, useRouteMatch } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'
import useI18n from 'hooks/useI18n'
import { Heading } from '@apeswapfinance/uikit'
import Container from 'components/layout/Container'
import IfoTabButtons from './components/IfoTabButtons'
// import Hero from './components/Hero'
import CurrentIfo from './CurrentIfo'
import PastIfo from './PastIfo'

const Header = styled.div`
  position: relative;
  overflow-y: hidden;
  overflow-x: hidden;
  padding-top: 36px;
  /* padding-left: 10px;
  padding-right: 10px; */
  background-image: ${({ theme }) =>
    theme.isDark ? 'url(/images/banners/iao-bg.svg)' : 'url(/images/banners/iao-bg.svg)'};
  height: 250px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  margin-bottom: 32px;
  z-index: auto;

  ${({ theme }) => theme.mediaQueries.md} {
    height: 300px;
    padding-left: 24px;
    padding-right: 24px;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    height: 300px;
    padding-left: 10px;
    padding-right: 10px;
  }
`

const HeadingContainer = styled.div`
  max-width: 1024px;
  margin-left: auto;
  margin-right: auto;
  z-index: 2;
  position: relative;
  padding-left: 10px;
`

const StyledHeading = styled(Heading)`
  font-size: 32px;
  max-width: 176px !important;
  z-index: 9999;

  ${({ theme }) => theme.mediaQueries.xs} {
    font-size: 36px;
    max-width: 240px !important;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 44px;
    max-width: 400px !important;
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    font-size: 60px;
    max-width: 600px !important;
  }
`

const RightDiv = styled.div`
  background-color: red;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
`

const WinImg = styled.div`
  width: 100%;
  background-image: url(/images/banners/iao-window.svg);
  background-size: cover;
  background-repeat: no-repeat;
  height: inherit;
  background-position: inherit;
`

const WinCon = styled.div`
  top: 0;
  position: absolute;
  width: 800px;
  right: 0;
  margin: 0px auto;

  ${({ theme }) => theme.mediaQueries.md} {
    /* width: 400px; */
    /* background-color: yellow; */
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    /* background-color: yellow; */
    /* width: 700px; */
  }
`

const bananaFloat = keyframes`
  0% { transform: translate(0px, 0px); }
  65%  { transform: translate(20px, 0px); }
  100%   { transform: translate(-0px, 0px); }
`

const Banana = styled.img`
  margin-top: -10px;
  margin-right: 140px;
  width: 200px;
  bottom: 0;
  top: 0;
  position: absolute;
  z-index: 1;
  right: 0;
  animation: ${bananaFloat} 10s linear infinite;
`

const apeFloat = keyframes`
  0% { transform: translate(0, 0px); }
  65%  { transform: translate(0, -20px); }
  100%   { transform: translate(0, -0px); }
`

const Ape = styled.img`
  position: absolute;
  margin-top: 60px;
  margin-right: 75px;
  right: 0;
  top: 0;
  width: 550px;
  animation: ${apeFloat} 10s ease-in-out infinite;
`

const Ifos = () => {
  const { path } = useRouteMatch()
  const TranslateString = useI18n()

  return (
    <>
      <Header>
        <HeadingContainer>
          <StyledHeading as="h1" mb="8px" mt={0} color="white">
            {TranslateString(999, 'Initial Ape Offerings')}
          </StyledHeading>
        </HeadingContainer>

        <RightDiv className="r-d">
          <WinImg className="window" />
        </RightDiv>

        {/* <WinCon className="win-con">
          <Banana src="/images/banners/iao-banana.svg" className="banana" />
          <Ape src="/images/banners/iao-ape.svg" className="ape" />
        </WinCon> */}
      </Header>

      {/* <Hero /> */}
      <Container>
        <IfoTabButtons />
        <Route exact path={`${path}`}>
          <CurrentIfo />
        </Route>
        <Route path={`${path}/history`}>
          <PastIfo />
        </Route>
      </Container>
    </>
  )
}

export default Ifos
