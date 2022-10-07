import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { WalletLinkConnector } from '@web3-react/walletlink-connector'
import { TorusConnector } from '@web3-react/torus-connector'
import { BscConnector } from '@binance-chain/bsc-connector'
import { ConnectorNames } from '@ape.swap/uikit'
import getRpcUrl from 'utils/getRpcUrl'
import { Web3Provider } from '@ethersproject/providers'
import { UAuthConnector } from '@uauth/web3-react'
import UAuth from '@uauth/js'
import { ChainId } from '@ape.swap/sdk'

const POLLING_INTERVAL = 15000

// When adding a new chain we need to add the CHAIN_ID to the supported chains

const injected = new InjectedConnector({
  supportedChainIds: [ChainId.BSC, ChainId.BSC_TESTNET, ChainId.MATIC, ChainId.MATIC_TESTNET, ChainId.MAINNET],
})

const walletconnect = new WalletConnectConnector({
  rpc: { [ChainId.BSC]: getRpcUrl(ChainId.BSC) },
  supportedChainIds: [ChainId.BSC, ChainId.BSC_TESTNET, ChainId.MATIC, ChainId.MATIC_TESTNET, ChainId.MAINNET],
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
  pollingInterval: POLLING_INTERVAL,
})

const bscConnector = new BscConnector({ supportedChainIds: [ChainId.BSC] })
const torus = new TorusConnector({ chainId: ChainId.BSC, initOptions: { network: { host: 'bsc_mainnet' } } })

export const walletlink = new WalletLinkConnector({
  url: getRpcUrl(ChainId.BSC),
  supportedChainIds: [ChainId.BSC],
  appName: 'Apeswap',
  darkMode: true,
  appLogoUrl: 'https://apeswap.finance/logo.png',
})

export const uauth = new UAuthConnector({
  uauth: new UAuth({
    clientID: process.env.REACT_APP_UD_CLIENT_ID,
    redirectUri: process.env.REACT_APP_UD_REDIRECT_URI,
    scope: 'openid wallet',
  }),
  connectors: { injected, walletconnect },
})

export const connectorsByName: { [connectorName in ConnectorNames]: any } = {
  [ConnectorNames.Injected]: injected,
  [ConnectorNames.WalletConnect]: walletconnect,
  [ConnectorNames.BSC]: bscConnector,
  [ConnectorNames.Walletlink]: walletlink,
  [ConnectorNames.Torus]: torus,
  [ConnectorNames.Unstoppable]: uauth,
}

export const getLibrary = (provider: any): Web3Provider => {
  const library = new Web3Provider(provider, 'any')
  library.pollingInterval = 15000
  return library
}
