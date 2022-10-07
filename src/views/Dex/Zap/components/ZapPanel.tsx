/** @jsxImportSource theme-ui */
import React, { useMemo, useState } from 'react'
import { Flex, Text } from '@ape.swap/uikit'
import { Input as NumericalInput } from 'components/CurrencyInputPanel/NumericalInput'
import { useTranslation } from 'contexts/Localization'
import LPSelector from './LPSelector'
import { styles } from '../../components/DexPanel/styles'
import { Pair, Token } from '@ape.swap/sdk'
import { getTokenUsdPrice } from 'utils/getTokenUsdPrice'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { Spinner } from 'theme-ui'
import { useCurrencyBalance } from 'state/wallet/hooks'
import Dots from 'components/Loader/Dots'

export interface ZapPanelProps {
  value: string
  onSelect: (currencyIdA: Token, currencyIdB: Token) => void
  lpPair: Pair
}

const ZapPanel: React.FC<ZapPanelProps> = ({ value, onSelect, lpPair }) => {
  const { account, chainId } = useActiveWeb3React()
  const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, lpPair?.liquidityToken ?? undefined)
  const currencyBalance = selectedCurrencyBalance?.toSignificant(6)
  const { t } = useTranslation()
  const [usdVal, setUsdVal] = useState(null)

  useMemo(async () => {
    setUsdVal(null)
    setUsdVal(await getTokenUsdPrice(chainId, lpPair?.liquidityToken?.address, 18, true))
  }, [chainId, lpPair?.liquidityToken?.address])

  return (
    <Flex sx={styles.dexPanelContainer}>
      <Flex sx={styles.panelTopContainer}>
        <Text sx={styles.swapDirectionText}>{t('To')}</Text>
        <NumericalInput value={value} onUserInput={null} align="left" id="token-amount-input" readOnly />
        <LPSelector lpPair={lpPair} onSelect={onSelect} />
      </Flex>
      <Flex sx={styles.panelBottomContainer}>
        <Flex sx={styles.centered}>
          <Text size="12px" sx={styles.panelBottomText}>
            {!usdVal && value !== '0.0' ? (
              <Spinner width="15px" height="15px" />
            ) : value !== '0.0' && usdVal !== 0 && value ? (
              `$${(usdVal * parseFloat(value)).toFixed(2)}`
            ) : null}
          </Text>
        </Flex>
        <Flex sx={{ alignItems: 'center' }}>
          {account ? (
            <Text size="12px" sx={styles.panelBottomText}>
              {t('Balance: %balance%', { balance: currencyBalance || 'loading' })}
              {!currencyBalance && <Dots />}
            </Text>
          ) : null}
        </Flex>
      </Flex>
    </Flex>
  )
}

export default React.memo(ZapPanel)
