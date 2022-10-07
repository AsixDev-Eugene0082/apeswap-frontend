import { ArrowDropUpIcon } from '@apeswapfinance/uikit'
import { Tag } from '@ape.swap/uikit'
import styled from '@emotion/styled'
import { ThemeUIStyleObject } from 'theme-ui'

export const poolStyles: Record<string, ThemeUIStyleObject> = {
  styledBtn: {
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: 700,
    padding: '10px 20px',
    minWidth: '150px',
    height: '44px',
    '&&': {
      width: '150px',
    },
  },
  container: {
    position: 'relative',
  },
  actionContainer: {
    width: '100%',
    justifyContent: 'space-between',
    '@media screen and (min-width: 852px)': {
      width: 'fit-content',
    },
  },
}

export const NextArrow = styled(ArrowDropUpIcon)`
  transform: rotate(90deg);
`

export const StyledTag = styled(Tag)`
  font-size: 10px;
  padding: 0px 6px !important;
  font-weight: 700;
  border: none;
  border-radius: 10px;
  height: auto;
  width: max-content;
`
