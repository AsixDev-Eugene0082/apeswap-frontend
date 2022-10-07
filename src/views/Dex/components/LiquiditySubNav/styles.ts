import { Tag } from '@ape.swap/uikit'
import styled from '@emotion/styled'

import { ThemeUIStyleObject } from 'theme-ui'
import { textUnderlineHover } from '../../styles'

export const styles: Record<string, ThemeUIStyleObject> = {
  liquiditySelector: {
    position: 'relative',
    alignItems: 'center',
    cursor: 'pointer',
    margin: '0 20px',
    ...textUnderlineHover,
  },
  liquiditySelectorContainer: {
    marginBottom: '40px',
    justifyContent: 'center',
    fontSize: '14px',
  },
  migrate: { margin: '0 20px', position: 'relative', alignItems: 'center', color: 'textDisabled' },
}

export const StyledTag = styled(Tag)`
  font-size: 10px;
  padding: 0px 6px !important;
  margin-left: 5px;
  font-weight: 700;
  border: none;
  border-radius: 10px;
  height: auto;
  width: max-content;
`
