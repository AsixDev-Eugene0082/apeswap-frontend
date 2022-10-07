import React from 'react'
import { ModalProvider } from '@ape.swap/uikit'
import { ModalProvider as OldModalProvider } from '@apeswapfinance/uikit'
import { Web3ReactProvider, createWeb3ReactRoot } from '@web3-react/core'
import { HelmetProvider } from 'react-helmet-async'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Provider } from 'react-redux'
import { getLibrary } from 'utils/web3React'
import { ThemeContextProvider } from 'contexts/ThemeContext'
import { RefreshContextProvider } from 'contexts/RefreshContext'
import store from 'state'
import { BlockNumberProvider } from 'lib/hooks/useBlockNumber'
import NftProvider from 'views/Nft/contexts/NftProvider'
import { NetworkContextName } from 'config/constants'
import { LanguageProvider } from './contexts/Localization'
import Blocklist from 'components/Blocklist'

const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName)

const queryClient = new QueryClient()

const Providers: React.FC = ({ children }) => {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Web3ProviderNetwork getLibrary={getLibrary}>
        <Provider store={store}>
          <BlockNumberProvider>
            <HelmetProvider>
              <ThemeContextProvider>
                <NftProvider>
                  <LanguageProvider>
                    <Blocklist>
                      <RefreshContextProvider>
                        <ModalProvider>
                          <OldModalProvider>
                            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
                          </OldModalProvider>
                        </ModalProvider>
                      </RefreshContextProvider>
                    </Blocklist>
                  </LanguageProvider>
                </NftProvider>
              </ThemeContextProvider>
            </HelmetProvider>
          </BlockNumberProvider>
        </Provider>
      </Web3ProviderNetwork>
    </Web3ReactProvider>
  )
}

export default Providers
