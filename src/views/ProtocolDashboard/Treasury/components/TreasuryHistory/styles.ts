import { ThemeUIStyleObject } from 'theme-ui'

export const styles: Record<string, ThemeUIStyleObject> = {
  cardContainer: {
    width: '100%',
    background: 'white2',
    minHeight: '260px',
    height: 'auto',
    borderRadius: '10px',
    margin: '10px 0px',
    flexDirection: 'column',
    alignItems: 'space-between',
    justifyContent: 'space-between',
    padding: '20px 10px',
  },
  legendContainer: {
    position: 'absolute',
    flexWrap: 'wrap',
    flexDirection: 'column',
    top: '40px',
    left: '50px',
    fontSize: '14px',
    '@media screen and (max-width: 800px)': {
      left: '30px',
      top: '60px',
      fontSize: '12px',
    },
    '@media screen and (max-width: 650px)': {
      left: '10px',
      top: '80px',
    },
  },
}
