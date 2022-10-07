import styled from 'styled-components'
import { Tag } from '@ape.swap/uikit'
import { ThemeUIStyleObject } from 'theme-ui'

export const styles: Record<string, ThemeUIStyleObject> = {
  cardContainer: {
    width: '100%',
    maxWidth: '580px',
    minHeight: '350px',
    height: 'fit-content',
    borderRadius: '10px',
    margin: '10px 0px',
    flexDirection: 'column',
    alignItems: 'space-between',
    padding: '20px 0px',
  },
  assetBreakdownContainer: {
    maxWidth: '580px',
    width: '100%',
    height: 'auto',
    maxHeight: '545px',
    background: 'white3',
    overflowY: 'scroll',
    overflowX: 'hidden',
    flexDirection: 'column',
    borderRadius: '10px',
    marginTop: '20px',
  },
  assetContainer: {
    position: 'relative',
    background: 'white3',
    minHeight: '60px',
    height: 'fit-content',
    width: '100%',
    maxWidth: '580px',
    justifyContent: 'center',
    pr: '20px',
    flexDirection: 'column',
    overflow: 'hidden',
    borderRadius: '10px',
    margin: '5px 10px',
  },
  assetRow: {
    maxWidth: '250px',
    width: '100%',
    justifyContent: 'space-between',
    margin: '2.5px 0px',
    '@media screen and (max-width: 578px)': {
      margin: '10px 0px',
    },
  },
}

export const StyledTag = styled(Tag)`
  font-size: 10px;
  padding: 0px 6px !important;
  margin-left: 6px;
  font-weight: 700;
  border: 1px;
  border-radius: 10px;
  height: auto;
  width: max-content;
`
