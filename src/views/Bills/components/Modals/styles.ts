import { Flex, Skeleton, Text } from '@apeswapfinance/uikit'
import styled from '@emotion/styled'

export const ModalBodyContainer = styled(Flex)`
  flex-direction: column;
  align-items: center;
  @media screen and (min-width: 1180px) {
    flex-direction: row;
  }
`

export const Container = styled.div`
  max-height: 100vh;
  overflow: scroll;
  overflow-x: hidden;
  -ms-overflow-style: none;  /* Internet Explorer 10+ */
  scrollbar-width: none;  /* Firefox */
}
::-webkit-scrollbar {
  width: 0; 
  background: transparent;  
}
`

export const BillsImage = styled.div<{ image?: string }>`
  width: 250px;
  align-self: center;
  height: 141px;
  background-image: ${({ image }) => `url(${image});`}
  background-repeat: no-repeat;
  background-size: 100% 100%;
  margin-top: 30px;
  @media screen and (min-width: 1180px) {
    min-width: 606px;
    height: 341px;
    align-self: auto;
    margin-top: 0px;
  }
`

export const ImageSkeleton = styled(Skeleton)`
  width: 250px;
  height: 141px;
  margin-top: 30px;
  align-self: center;
  @media screen and (min-width: 1180px) {
    min-width: 606px;
    height: 341px;
    margin-top: 0px;
  }
`

export const BillDescriptionContainer = styled(Flex)<{ p?: string; minHeight?: number }>`
  position: relative;
  width: 310px;
  min-height: ${({ minHeight }) => minHeight}px;
  height: fit-content;
  flex-direction: column;
  justify-content: space-around;
  @media screen and (min-width: 1180px) {
    width: 540px;
    justify-content: space-between;
    padding: ${({ p }) => p || '20px 30px'};
    margin: 10px 10px 10px 20px;
    min-height: auto;
  }
`

export const TopDescriptionText = styled(Text)<{ width?: string }>`
  opacity: 0.6;
  font-size: 12px;
  width: ${({ width }) => width || '100%'};
`

export const BillTitleContainer = styled(Flex)`
  flex-direction: column;
  margin: 10px 0;
`

export const GridTextValContainer = styled(Flex)`
  justify-content: space-between;
  align-items: center;
  height: 15px;
  width: 100%;
  margin: 5px 0px;
  @media screen and (min-width: 1180px) {
    margin: 8px 0px;
  }
`

export const StyledExit = styled(Text)`
  position: absolute;
  top: 15px;
  right: 25px;
  font-size: 20px;
  cursor: pointer;
  font-weight: 600;
  z-index: 1;
`

export const ActionButtonsContainer = styled(Flex)`
  justify-content: space-around;
  align-items: center;
  flex-direction: column;
  @media screen and (min-width: 1180px) {
    flex-direction: row;
    height: auto;
  }
`

export const UserActionButtonsContainer = styled(ActionButtonsContainer)`
  height: 110px;
  justify-content: space-between;
  @media screen and (min-width: 1180px) {
    transform: translate(0px, 25px);
  }
`

export const StyledHeadingText = styled(Text)`
  font-size: 16px;
  @media screen and (min-width: 1180px) {
    font-size: 22px;
  }
`

export const BillsFooterContainer = styled(Flex)`
  width: 100%;
  height: 276px;
  margin-top: 20px;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
  @media screen and (min-width: 1180px) {
    flex-direction: row;
    height: 100px;
    margin-bottom: 0px;
  }
`

export const BillFooterContentContainer = styled(Flex)`
  background: ${({ theme }) => theme.colors.white3};
  width: 100%;
  height: 82px;
  border-radius: 10px;
  align-items: center;
  @media screen and (min-width: 1180px) {
    width: 351px;
    height: 82px;
  }
`

export const BillValueContainer = styled('div')`
  display: flex;
  width: 100%;
  padding: 10px 0;
  flex-wrap: wrap;
`

export const TextWrapper = styled('div')`
  display: flex;
  width: 100%;
  justify-content: center;
  @media screen and (min-width: 1180px) {
    width: 50%;
  }
`
