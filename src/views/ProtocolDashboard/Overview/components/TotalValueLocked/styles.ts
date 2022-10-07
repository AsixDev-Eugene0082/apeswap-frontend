import { ThemeUIStyleObject } from 'theme-ui'

export const styles: Record<string, ThemeUIStyleObject> = {
  cardContainer: {
    maxWidth: '590px',
    width: '100%',
    background: 'white2',
    minHeight: '350px',
    height: 'auto',
    borderRadius: '10px',
    margin: '10px 0px',
    flexDirection: 'column',
    alignItems: 'space-between',
    justifyContent: 'space-between',
    padding: '20px 10px',
    '@media screen and (min-width: 726px)': {
      mr: '10px',
    },
  },
}
