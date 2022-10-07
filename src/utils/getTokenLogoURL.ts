import { ChainId } from '@ape.swap/sdk'
import { getMaticTokenLogoURL } from 'config/constants/maticTokenMapping'

const getTokenLogoURL = (address: string, chainId: any) => {
  let imageURL
  if (chainId === ChainId.BSC) {
    imageURL = `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/assets/${address}/logo.png`
  } else if (chainId === ChainId.MATIC) {
    imageURL = getMaticTokenLogoURL(address)
  } else if (chainId === ChainId.MAINNET) {
    imageURL = `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${address}/logo.png`
  } else {
    imageURL = `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${address}/logo.png`
  }
  return imageURL
}

export default getTokenLogoURL
