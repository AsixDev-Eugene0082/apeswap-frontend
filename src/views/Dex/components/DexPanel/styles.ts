import { ThemeUIStyleObject } from 'theme-ui'
import { buttonHover } from 'views/Dex/styles'

export const styles: Record<string, ThemeUIStyleObject> = {
  dexPanelContainer: {
    position: 'relative',
    width: '100%',
    height: '94px',
    background: 'white3',
    padding: '10px',
    borderRadius: '10px',
    justifyContent: 'space-between',
    flexDirection: 'column',
  },

  panelTopContainer: {
    width: '100%',
    height: 'auto',
    justifyContent: 'space-between',
  },

  panelBottomContainer: {
    width: '100%',
    justifyContent: 'space-between',
  },

  panelBottomText: {
    opacity: 0.8,
  },

  swapDirectionText: {
    fontSize: '16px',
    position: 'absolute',
    left: 0,
    top: 0,
    transform: 'translate(0px, -30px)',
  },

  maxButton: {
    background: 'yellow',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '6px',
    height: '22px',
    padding: '0px 8px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '600',
    ml: '10px',
    transition: 'all .3s linear',
    '&:active': {
      transform: 'scale(0.9)',
    },
    ':hover': buttonHover,
  },
}
