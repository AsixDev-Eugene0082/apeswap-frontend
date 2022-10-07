/** @jsxImportSource theme-ui */
import { Flex, Text } from '@ape.swap/uikit'
import { Input as NumericalInput } from 'components/CurrencyInputPanel/NumericalInput'
import { useTranslation } from 'contexts/Localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { Spinner } from 'theme-ui'
import React, { useState, useMemo, useEffect } from 'react'
import { Field } from 'state/swap/actions'
import { Field as MintField } from 'state/mint/actions'
import { useCurrencyBalance } from 'state/wallet/hooks'
import { getCurrencyUsdPrice } from 'utils/getTokenUsdPrice'
import TokenSelector from '../TokenSelector'
import { styles } from './styles'
import { DexPanelProps } from './types'
import Dots from 'components/Loader/Dots'

const DexPanel: React.FC<DexPanelProps> = ({
  value,
  currency,
  onCurrencySelect,
  onUserInput,
  handleMaxInput,
  setTradeValueUsd,
  otherCurrency,
  fieldType,
  panelText,
  lpPair,
  disabled,
  smartRouter,
  independentField,
  ordersDisabled,
  disableTokenSelect,
  showCommonBases = false,
  isZapInput,
}) => {
  const [usdVal, setUsdVal] = useState(null)
  const { chainId, account } = useActiveWeb3React()
  const isRemoveLiquidity = !!lpPair
  const selectedCurrencyBalance = useCurrencyBalance(
    account ?? undefined,
    isRemoveLiquidity ? lpPair?.liquidityToken ?? undefined : currency ?? undefined,
  )
  const currencyBalance = selectedCurrencyBalance?.toSignificant(6)
  const { t } = useTranslation()

  useMemo(async () => {
    setUsdVal(null)
    setUsdVal(await getCurrencyUsdPrice(chainId, lpPair?.liquidityToken || currency, isRemoveLiquidity, smartRouter))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId, currency, isRemoveLiquidity, smartRouter])

  useEffect(() => {
    if (setTradeValueUsd) {
      setTradeValueUsd(
        isRemoveLiquidity
          ? usdVal * parseFloat(currencyBalance) * (parseFloat(value) / 100)
          : usdVal * parseFloat(value),
      )
    }
  }, [usdVal, value, currencyBalance, isRemoveLiquidity, setTradeValueUsd])

  return (
    <Flex sx={styles.dexPanelContainer}>
      <Flex sx={styles.panelTopContainer}>
        <Text sx={styles.swapDirectionText}>{panelText}</Text>
        <NumericalInput
          value={isRemoveLiquidity ? `${value}%` : value}
          onUserInput={(val) => onUserInput(fieldType, val)}
          removeLiquidity={isRemoveLiquidity}
          align="left"
          id="token-amount-input"
          disabled={(independentField && independentField !== fieldType && disabled) || ordersDisabled}
          disabledText={independentField && independentField !== fieldType && disabled}
        />
        <TokenSelector
          currency={currency}
          otherCurrency={otherCurrency}
          onCurrencySelect={onCurrencySelect}
          showCommonBases={showCommonBases}
          disableTokenSelect={disableTokenSelect}
          isRemoveLiquidity={isRemoveLiquidity}
          field={fieldType}
          typedValue={value}
          isZapInput={isZapInput}
        />
      </Flex>
      <Flex sx={styles.panelBottomContainer}>
        <Flex
          sx={{
            alignItems: 'center',
            justifyContent: 'center',
            opacity: independentField && independentField !== fieldType && disabled && 0.4,
          }}
        >
          {!usdVal && (value || value === '.') && <Spinner width="15px" height="15px" />}
          <Text size="12px" sx={styles.panelBottomText}>
            {usdVal !== null &&
              value !== '.' &&
              usdVal !== 0 &&
              value &&
              `$${(lpPair
                ? usdVal * parseFloat(currencyBalance) * (parseFloat(value) / 100)
                : usdVal * parseFloat(value)
              ).toFixed(2)}`}
          </Text>
        </Flex>
        {account && (
          <Flex sx={{ alignItems: 'center' }}>
            <Text size="12px" sx={styles.panelBottomText}>
              {t('Balance: %balance%', { balance: currencyBalance || 'loading' })}
              {!currencyBalance && <Dots />}
            </Text>
            {(fieldType === Field.INPUT ||
              fieldType === MintField.CURRENCY_A ||
              fieldType === MintField.CURRENCY_B ||
              isRemoveLiquidity) &&
              parseFloat(currencyBalance) > 0 && (
                <Flex sx={styles.maxButton} size="sm" onClick={() => handleMaxInput(fieldType)}>
                  <Text color="primaryBright" sx={{ lineHeight: '0px' }}>
                    {t('MAX')}
                  </Text>
                </Flex>
              )}
          </Flex>
        )}
      </Flex>
    </Flex>
  )
}

export default React.memo(DexPanel)
