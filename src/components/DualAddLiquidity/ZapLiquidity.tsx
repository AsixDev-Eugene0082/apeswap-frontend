import React, { useCallback, useEffect, useState } from 'react'
import { Flex, Link, Svg, Text } from '@ape.swap/uikit'
import DexPanel from 'views/Dex/components/DexPanel'
import { useCurrency } from 'hooks/Tokens'
import { Currency, CurrencyAmount, Pair } from '@ape.swap/sdk'
import maxAmountSpend from 'utils/maxAmountSpend'
import ZapPanel from 'views/Dex/Zap/components/ZapPanel'
import { Field } from 'state/zap/actions'
import { useDerivedZapInfo, useSetZapInputList, useZapActionHandlers, useZapState } from 'state/zap/hooks'
import ZapLiquidityActions from 'views/Dex/Zap/components/ZapLiquidityActions'
import { styles } from './styles'
import { useZapCallback } from 'hooks/useZapCallback'
import DistributionPanel from 'views/Dex/Zap/components/DistributionPanel/DistributionPanel'
import { useUserSlippageTolerance } from 'state/user/hooks'
import track from 'utils/track'
import { getBalanceNumber } from 'utils/formatBalance'
import BigNumber from 'bignumber.js'
import useActiveWeb3React from 'hooks/useActiveWeb3React'

interface ZapLiquidityProps {
  handleConfirmedTx: (hash: string, pairOut: Pair) => void
}

const ZapLiquidity: React.FC<ZapLiquidityProps> = ({ handleConfirmedTx }) => {
  useSetZapInputList()
  const [zapErrorMessage, setZapErrorMessage] = useState<string>(null)
  const { chainId } = useActiveWeb3React()

  const { INPUT, typedValue, recipient, zapType } = useZapState()
  const [zapSlippage] = useUserSlippageTolerance(true)

  const currencyA = INPUT.currencyId

  const inputCurrency = useCurrency(currencyA)

  const { zap, inputError: zapInputError, currencyBalances } = useDerivedZapInfo()
  const { onUserInput, onInputSelect, onCurrencySelection } = useZapActionHandlers()

  const handleInputSelect = useCallback(
    (field: Field, currency: Currency) => {
      onInputSelect(field, currency)
    },
    [onInputSelect],
  )

  const handleOutputSelect = useCallback(
    (currencyIdA: Currency, currencyIdB: Currency) => {
      onCurrencySelection(Field.OUTPUT, [currencyIdA, currencyIdB])
    },
    [onCurrencySelection],
  )

  const { callback: zapCallback } = useZapCallback(zap, zapType, zapSlippage, recipient, '', null)

  const handleZap = useCallback(() => {
    setZapErrorMessage(null)
    zapCallback()
      .then((hash) => {
        handleConfirmedTx(hash, zap.pairOut.pair)
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
        setZapErrorMessage(error.message)
      })
  }, [chainId, handleConfirmedTx, zap, zapCallback])

  const handleDismissConfirmation = useCallback(() => {
    // clear zapErrorMessage if user closes the error modal
    setZapErrorMessage(null)
  }, [])

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

  return (
    <div>
      <Flex sx={styles.liquidityContainer}>
        <Flex sx={{ marginTop: '30px' }}>
          <DexPanel
            value={typedValue}
            panelText="From:"
            currency={inputCurrency}
            otherCurrency={null}
            fieldType={Field.INPUT}
            onCurrencySelect={handleInputSelect}
            onUserInput={onUserInput}
            handleMaxInput={handleMaxInput}
            isZapInput
          />
        </Flex>
        <Flex sx={{ margin: '10px', justifyContent: 'center' }}>
          <Svg icon="ZapArrow" />
        </Flex>
        <ZapPanel
          value={zap?.pairOut?.liquidityMinted?.toSignificant(10) || '0.0'}
          onSelect={handleOutputSelect}
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
    </div>
  )
}

export default React.memo(ZapLiquidity)
