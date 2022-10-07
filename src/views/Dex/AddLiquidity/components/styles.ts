import { ThemeUIStyleObject } from 'theme-ui'
import { textUnderlineHover } from '../../styles'

export const styles: Record<string, ThemeUIStyleObject> = {
  swapSwitchContainer: {
    width: '100%',
    height: '50px',
    alignItems: 'center',
    justifyContent: 'center',
  },
  swapSwitchButton: {
    backgroundColor: 'yellow',
    height: '30px',
    width: '30px',
    borderRadius: '30px',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  liquiditySelector: {
    position: 'relative',
    alignItems: 'center',
    cursor: 'pointer',
    margin: '0 20px',
    ...textUnderlineHover,
  },
  liquiditySelectorContainer: {
    marginBottom: '15px',
    justifyContent: 'center',
    fontSize: '14px',
  },
  migrate: { margin: '0 20px', position: 'relative', alignItems: 'center', color: 'textDisabled' },
}
