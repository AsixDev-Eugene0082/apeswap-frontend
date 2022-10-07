import { ThemeUIStyleObject } from 'theme-ui'

export const styles: Record<string, ThemeUIStyleObject> = {
  cardContainer: {
    maxWidth: '387px',
    width: '100%',
    background: 'white2',
    borderRadius: '10px',
    margin: '10px 0px',
    flexDirection: 'column',
    padding: '20px',
    '@media screen and (min-width: 726px)': {
      mr: '10px',
    },
  },
}
