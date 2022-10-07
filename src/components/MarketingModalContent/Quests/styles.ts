/** @jsxImportSource theme-ui */
import styled from 'styled-components'
import { ThemeUIStyleObject } from 'theme-ui'

export const Bubble = styled.div<{ isActive?: boolean }>`
  background: ${({ isActive, theme }) =>
    isActive ? 'linear-gradient(53.53deg, #a16552 15.88%, #e1b242 92.56%)' : theme.colors.white4};
  height: 8px;
  width: 8px;
  border-radius: 50px;
  margin: 0px 2.5px 0px 2.5px;
  cursor: pointer;
`
export const showApe = (slide, isDark): ThemeUIStyleObject => ({
  width: '100%',
  height: '230px',
  '@media screen and (min-width: 853px)': {
    height: '500px',
  },
  background: `url(images/marketing-modals/questApe-${isDark ? 'dark-' : 'light-'}${slide}.svg)`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  backgroundSize: 'contain',
})

export const subtitle = (isDark): ThemeUIStyleObject => ({
  '@media screen and (max-width: 853px)': {
    fontSize: '12px',
    fontWeight: 400,
    lineHeight: '12px',
    textAlign: 'left',
    color: isDark ? '#FAFAFA' : '#4D4040',
    opacity: 0.5,
  },
  '@media screen and (min-width: 853px)': {
    fontSize: '12px',
    fontWeight: 400,
    lineHeight: '18px',
    letterSpacing: '0em',
    textAlign: 'left',
    color: isDark ? '#FAFAFA' : '#4D4040',
    opacity: 0.5,
  },
})

export const styles: Record<string, ThemeUIStyleObject> = {
  container: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    overflow: 'hidden',
    overflowY: 'auto',
    height: ['90%', '90%', '500px'],
    flexWrap: 'wrap',
    width: ['auto', 'auto', '100%'],
    minWidth: ['auto', 'auto', '800px'],
    maxWidth: ['auto', 'auto', '800px'],
  },
  imagesWrapper: {
    width: '100%',
    '@media screen and (min-width: 853px)': {
      width: '380px',
    },
    justifyContent: 'center',
  },
  textWrapper: {
    width: ['100%', '100%', '420px', '420px'],
    textAlign: ['center', 'center', 'start'],
    justifyContent: ['center', 'center', 'flex-start'],
    padding: ['', '', '110px 20px 0 30px'],
    flexWrap: 'wrap',
  },
  bubbleWrapper: {
    width: '100%',
    justifyContent: ['center', 'center', 'flex-start'],
    margin: '20px 0 15px',
    '@media screen and (min-width: 853px)': {
      margin: '32px 0 20px 0',
    },
  },
  text: {
    width: '100%',
    '@media screen and (max-width: 853px)': {
      marginLeft: '30px',
      textAlign: 'left',
    },
  },
  title: {
    fontWeight: 700,
    '@media screen and (max-width: 853px)': {
      fontSize: '18px',
      lineHeight: '14px',
      marginTop: '20px',
      marginBottom: '5px',
    },
    '@media screen and (min-width: 853px)': {
      fontSize: '24px',
      lineHeight: '36px',
    },
  },
  first: {
    fontWeight: 700,
    fontSize: '10px',
    lineHeight: '14px',
    color: '#FFB300',
    '@media screen and (max-width: 853px)': {
      marginTop: '15px',
    },
    '@media screen and (min-width: 853px)': {
      fontWeight: 700,
      fontSize: '10px',
      lineHeight: '14px',
      color: '#FFB300',
      marginTop: '30px',
    },
  },
  second: {
    fontWeight: 700,
    fontSize: '12px',
    lineHeight: '14px',
    marginTop: '4px',
    '@media screen and (min-width: 853px)': {
      fontSize: '22px',
      marginTop: '7px',
    },
  },
  third: {
    fontWeight: 400,
    fontStyle: 'normal',
    lineHeight: '15px',
    fontSize: '12px',
    '@media screen and (max-width: 853px)': {
      width: '220px',
    },
    '@media screen and (min-width: 853px)': {
      fontSize: '14px',
      lineHeight: '16px',
      flex: 'none',
      order: 1,
      alignSelf: 'stretch',
      flexGrow: 0,
    },
  },
  thirdWrapper: {
    '@media screen and (max-width: 853px)': {
      width: '230px',
      marginLeft: '30px',
      textAlign: 'left',
    },
    marginTop: '15px',
    width: '275px',
  },
  button: {
    fontWeight: 700,
    fontSize: '16px',
    lineHeight: '24px',
    fontStyle: 'normal',
    '@media screen and (max-width: 853px)': {
      width: '222px',
    },
    paddingTop: '5px',
    paddingBottom: '5px',
  },
  defaultNoShow: {
    justifySelf: 'flex-end',
    alignSelf: ['flex-start', 'flex-start', 'flex-start', 'center'],
    alignItems: 'center',
    marginTop: '20px',
    marginBottom: ['25px', '25px', '30px', '0px'],
    width: ['222px'],
  },
  checkboxCon: {
    alignItems: 'center',
    width: '21px',
    height: '21px',
    paddingLeft: '4px',
  },
  checkboxText: {
    fontSize: ['12px', '12px', '14px'],
    fontWeight: 500,
    lineHeight: '14px',
    marginLeft: ['15px', '15px', '20px'],
  },
}
