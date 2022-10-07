/** @jsxImportSource theme-ui */
import React from 'react'
import { Flex, Svg, Text, useModal } from '@ape.swap/uikit'
import { styles } from '../../components/TokenSelector/styles'
import { Spinner } from 'theme-ui'
import { Pair, Token } from '@ape.swap/sdk'
import LPSearchModal from 'components/LPSearchModal/LPSearchModal'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import ServiceTokenDisplay from 'components/ServiceTokenDisplay'
import { wrappedToNative } from 'utils'

const LPSelector: React.FC<{
  lpPair: Pair
  onSelect: (currencyA: Token, currencyB: Token) => void
}> = ({ lpPair, onSelect }) => {
  const [onPresentCurrencyModal] = useModal(<LPSearchModal onSelect={onSelect} />)
  const { chainId } = useActiveWeb3React()

  return (
    <Flex sx={styles.primaryFlex} onClick={onPresentCurrencyModal}>
      {lpPair ? (
        <>
          <ServiceTokenDisplay
            token1={lpPair?.token0?.getSymbol(chainId)}
            token2={lpPair?.token1?.getSymbol(chainId)}
            noEarnToken
            size={30}
          />
          <Text sx={styles.tokenText}>
            {wrappedToNative(lpPair.token0.getSymbol(chainId))}-{wrappedToNative(lpPair.token1.getSymbol(chainId))}
          </Text>
        </>
      ) : (
        <Spinner width="15px" height="15px" sx={{ marginRight: '10px' }} />
      )}
      <Svg icon="caret" />
    </Flex>
  )
}

export default React.memo(LPSelector)
