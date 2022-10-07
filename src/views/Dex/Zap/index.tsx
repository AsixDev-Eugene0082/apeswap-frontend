/** @jsxImportSource theme-ui */
import React, { useCallback, useEffect, useState } from 'react'
import { Flex, Link, Svg, Text } from '@ape.swap/uikit'
import DexPanel from 'views/Dex/components/DexPanel'
import { useCurrency } from 'hooks/Tokens'
import { Currency, CurrencyAmount } from '@ape.swap/sdk'
import maxAmountSpend from 'utils/maxAmountSpend'
import ZapPanel from './components/ZapPanel'
import { Field } from 'state/zap/actions'
import {
  useDefaultCurrencies,
  useDerivedZapInfo,
  useSetZapDexOutputList,
  useSetZapInputList,
  useZapActionHandlers,
  useZapState,
} from 'state/zap/hooks'
import ZapLiquidityActions from './components/ZapLiquidityActions'
import { styles } from './styles'
import { dexStyles } from '../styles'
import { useZapCallback } from 'hooks/useZapCallback'
import DistributionPanel from './components/DistributionPanel/DistributionPanel'
import { RouteComponentProps } from 'react-router-dom'
import DexNav from '../components/DexNav'
import MyPositions from '../components/MyPositions'
import LiquiditySubNav from '../components/LiquiditySubNav'
import { useUserSlippageTolerance } from 'state/user/hooks'
import track from 'utils/track'
import { getBalanceNumber } from 'utils/formatBalance'
import BigNumber from 'bignumber.js'
import useActiveWeb3React from 'hooks/useActiveWeb3React'

function ZapLiquidity({
  match: {
    params: { currencyIdA, currencyIdB, currencyIdC },
  },
}: RouteComponentProps<{ currencyIdA?: string; currencyIdB?: string; currencyIdC: string }>) {
  useSetZapInputList()
  useDefaultCurrencies()

  const [{ zapErrorMessage, txHash }, setZapState] = useState<{
    zapErrorMessage: string | undefined
    txHash: string | undefined
  }>({
    zapErrorMessage: undefined,
    txHash: undefined,
  })
  const { chainId } = useActiveWeb3React()
  const { INPUT, typedValue, recipient, zapType } = useZapState()
  const [zapSlippage] = useUserSlippageTolerance(true)

  const currencyA = currencyIdA || INPUT.currencyId

  const inputCurrency = useCurrency(currencyA)

  const { zap, inputError: zapInputError, currencyBalances } = useDerivedZapInfo()
  const { onUserInput, onCurrencySelection } = useZapActionHandlers()

  const handleCurrencySelect = useCallback(
    (field: Field, currency: Currency[]) => {
      onCurrencySelection(field, currency)
    },
    [onCurrencySelection],
  )

  const { callback: zapCallback, error: zapCallbackError } = useZapCallback(
    zap,
    zapType,
    zapSlippage,
    recipient,
    '',
    null,
  )

  const handleZap = useCallback(() => {
    setZapState({
      zapErrorMessage: undefined,
      txHash: undefined,
    })
    zapCallback()
      .then((hash) => {
        setZapState({
          zapErrorMessage: undefined,
          txHash: hash,
        })
        track({
          event: 'zap',
          chain: chainId,
          data: {
            cat: 'liquidity',
            token1: zap.currencyIn.currency.getSymbol(chainId),
            token2: `${zap.currencyOut1.outputCurrency.getSymbol(chainId)}-${zap.currencyOut2.outputCurrency.getSymbol(
              chainId,
            )}`,
            amount: getBalanceNumber(new BigNumber(zap.currencyIn.inputAmount.toString())),
          },
        })
      })
      .catch((error) => {
        setZapState({
          zapErrorMessage: error.message,
          txHash: undefined,
        })
      })
  }, [chainId, zapCallback, zap])

  const handleDismissConfirmation = useCallback(() => {
    // clear zapState if user close the error modal
    setZapState({
      zapErrorMessage: undefined,
      txHash: undefined,
    })
  }, [setZapState])

  const handleMaxInput = useCallback(
    (field: Field) => {
      const maxAmounts: { [field in Field]?: CurrencyAmount } = {
        [Field.INPUT]: maxAmountSpend(currencyBalances[Field.INPUT]),
        [Field.OUTPUT]: maxAmountSpend(currencyBalances[Field.OUTPUT]),
      }
      if (maxAmounts) {
        onUserInput(field, maxAmounts[field]?.toExact() ?? '')
      }
    },
    [currencyBalances, onUserInput],
  )

  // reset input value to zero on first render
  useEffect(() => {
    onUserInput(Field.INPUT, '')
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [])
  useSetZapDexOutputList()

  return (
    <Flex sx={dexStyles.pageContainer}>
      <Flex sx={{ flexDirection: 'column' }}>
        <Flex sx={dexStyles.dexContainer}>
          <DexNav zapSettings />
          <MyPositions />
          <LiquiditySubNav />
          <Flex sx={styles.liquidityContainer}>
            <DexPanel
              value={typedValue}
              panelText="From"
              currency={inputCurrency}
              otherCurrency={null}
              fieldType={Field.INPUT}
              onCurrencySelect={(field, currency) => handleCurrencySelect(field, [currency])}
              onUserInput={onUserInput}
              handleMaxInput={handleMaxInput}
              isZapInput
            />
            <Flex sx={{ margin: '10px', justifyContent: 'center' }}>
              <Svg icon="ZapArrow" />
            </Flex>
            <ZapPanel
              value={zap?.pairOut?.liquidityMinted?.toSignificant(10) || '0.0'}
              onSelect={(currency0, currency1) => handleCurrencySelect(Field.OUTPUT, [currency0, currency1])}
              lpPair={zap.pairOut.pair}
            />
            {typedValue && parseFloat(typedValue) > 0 && zap?.pairOut?.liquidityMinted && (
              <Flex sx={{ marginTop: '40px' }}>
                <DistributionPanel zap={zap} />
              </Flex>
            )}
            <ZapLiquidityActions
              zapInputError={zapInputError}
              zap={zap}
              handleZap={handleZap}
              zapErrorMessage={zapErrorMessage}
              txHash={txHash}
              handleDismissConfirmation={handleDismissConfirmation}
            />
            <Flex sx={{ marginTop: '10px', justifyContent: 'center' }}>
              <Link
                href="https://apeswap.gitbook.io/apeswap-finance/product-and-features/exchange/liquidity"
                target="_blank"
                textAlign="center"
              >
                <Text size="12px" style={{ lineHeight: '18px', fontWeight: 400, textDecoration: 'underline' }}>
                  Learn more{'>'}
                </Text>
              </Link>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default React.memo(ZapLiquidity)
