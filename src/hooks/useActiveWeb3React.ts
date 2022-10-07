import { useState, useRef, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
// eslint-disable-next-line import/no-unresolved
import { Web3ReactContextInterface } from '@web3-react/core/dist/types'
import { useSelector } from 'react-redux'
import getProvider from 'utils/getProvider'
import { State } from 'state/types'

const useActiveWeb3React = (): Web3ReactContextInterface<Web3Provider> => {
  const { account, library, chainId, ...web3React } = useWeb3React()
  const appChainId = useSelector((state: State) => state.network.data.chainId)
  const appProvider = getProvider(appChainId)
  const currChainId = chainId || appChainId
  const refChainId = useRef(currChainId)
  const refEth = useRef(library || appProvider)
  const [provider, setProvider] = useState(library || appProvider)

  useEffect(() => {
    if (library !== refEth.current || appProvider !== refEth.current) {
      setProvider(library || appProvider)
      refEth.current = library || appProvider
      refChainId.current = currChainId
    }
  }, [library, appProvider, currChainId])

  // To allow the app to update before passing a chainId !== provider
  if (currChainId !== refChainId.current) {
    return { library: refEth.current, chainId: refChainId.current, account, ...web3React }
  }

  return { library: provider, chainId: currChainId, account, ...web3React }
}

export default useActiveWeb3React
