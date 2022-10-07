const styles = {
  apyButton: {
    svg: {
      width: ['15px', '13px'],
      height: ['15px', '13px'],
    },
    '&:disabled': {
      border: 0,
      backgroundColor: 'transparent',
      svg: {
        fill: 'primaryButtonDisable',
      },
    },
  },
  maxButton: {
    margin: '0',
    fontSize: '14px',
    lineHeight: 0,
    width: '62px',
    minWidth: '62px',
    height: '30px',
  },
  container: {
    backgroundColor: 'white4',
    borderRadius: '20px',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px',
    rowGap: '10px',
  },
  tabContainer: {
    marginBottom: '30px',
    '&&& span': {
      fontWeight: 700,
      fontSize: '16px',
    },
    '& button': {
      px: '20px',
      fontSize: '16px',
    },
    '& *:not(button)': {
      color: 'primaryButtonDisable',
    },
  },
  inputSection: {
    justifyContent: 'space-between',
    alignItems: 'end',
    flexDirection: 'column',
    position: 'relative',
    borderRadius: '10px',
    zIndex: 1,
    '& input': {
      marginRight: 0,
    },
  },
  text: {
    fontSize: '12px',
    lineHeight: '14px',
    fontWeight: '500',
    color: 'text',
    marginLeft: '-5px',
  },
  title: {
    fontSize: '16px',
    margin: '25px 0px 8px 8px',
  },
  buttonsContainer: {
    justifyContent: 'space-between',
    margin: '10px 10px 10px 0',
    alignItems: 'center',
    flexWrap: 'wrap',
    rowGap: '10px',
  },
  balance: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontSize: '14px',
  },
  roiContainer: {
    backgroundColor: 'white4',
    borderRadius: '20px',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '17px 0',
    marginBottom: '25px',
    columnGap: '20px',
  },
  roiBanana: {
    '& span': {
      fontSize: '12px',
    },
  },
  detailRow: {
    marginBottom: '5px',
    fontSize: '16px',
    fontWeight: '700',
    justifyContent: 'space-between',
    paddingBottom: '5px',
  },
  detailContainer: (hide) => ({
    marginTop: hide ? 0 : '15px',
    backgroundColor: 'white3',
    padding: hide ? 0 : '25px 20px',
    borderRadius: '10px',
    overflow: hide ? 'hidden' : 'visible',
    height: hide ? 0 : 'auto',
    '& span': {
      fontSize: '12px',
    },
  }),
} as any
export default styles
