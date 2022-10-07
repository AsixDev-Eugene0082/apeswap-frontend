import styled from 'styled-components'
import { ThemeUIStyleObject } from 'theme-ui'
import { FadeIn } from '../../styles'

export const styles: Record<string, ThemeUIStyleObject> = {
  colorWrap: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    flexDirection: 'column',
    width: '100%',
  },
  yieldCard: {
    position: 'relative',
    minWidth: ['300px', '338px'],
    maxWidth: '338px',
    height: '442px',
    opacity: 1,
    padding: '10px 10px',
    borderRadius: '10px',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    animation: `${FadeIn} 0.5s linear`,
  },
  bubble: {
    height: '14px',
    width: '14px',
    borderRadius: '50px',
    margin: '0px 2.5px 0px 2.5px',
    cursor: 'pointer',
    display: 'block',
    '@media screen and (min-width: 1488px)': {
      display: 'none',
    },
  },
  serviceWrapper: {
    width: '95vw',
    maxWidth: '1412px',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
}

export const YieldCard = styled.div<{ image?: string }>`
  position: relative;
  min-width: 300px;
  max-width: 338px;
  height: 442px;
  opacity: 1;
  padding: 10px 10px;
  border-radius: 10px;
  background: url(${({ theme, image }) => (theme.isDark ? `${image}-dark.svg` : `${image}-light.svg`)});
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  @media screen and (min-width: 851px) {
    min-width: 338px;
    padding: 10px 20px;
  }
`
