import { Button, Flex, Svg, Text } from '@ape.swap/uikit'
import { Currency, ZapType } from '@ape.swap/sdk'
import { useCurrency } from 'hooks/Tokens'
import { useZapCallback } from 'hooks/useZapCallback'
import React, { useCallback, useMemo } from 'react'
import { useUserSlippageTolerance } from 'state/user/hooks'
import { Field } from 'state/zap/actions'
import { useDerivedZapInfo, useZapActionHandlers, useZapState } from 'state/zap/hooks'
import DexPanel from 'views/Dex/components/DexPanel'
import { ApprovalState, useApproveCallbackFromZap } from 'hooks/useApproveCallback'
import { CurrencyLogo } from 'components/Logo'
import { PairState } from 'hooks/usePairs'
import { useBills, usePollBills, useSetBills } from 'state/bills/hooks'

const ZapTest: React.FC = () => {
  useSetBills()
  usePollBills()

  const bills = useBills()

  const [allowedSlippage] = useUserSlippageTolerance()

  const { INPUT, OUTPUT, independentField, typedValue, recipient, zapType } = useZapState()

  const { zap, parsedAmount, inputError: zapInputError } = useDerivedZapInfo()

  const { onCurrencySelection, onUserInput, onSetZapType } = useZapActionHandlers()

  const inputCurrency = useCurrency(INPUT?.currencyId)
  const outputCurrencys = [useCurrency(OUTPUT?.currency1), useCurrency(OUTPUT?.currency2)]
  const { currencyOut1, currencyOut2, pairOut } = zap

  const parsedAmounts = {
    [Field.INPUT]: parsedAmount,
    [Field.OUTPUT]: {
      currency1: pairOut?.inAmount.token1,
      currency2: pairOut?.inAmount.token2,
    },
  }

  const formattedAmounts = {
    [Field.INPUT]: typedValue,
    [Field.OUTPUT]: {
      currency1: parsedAmounts[Field.OUTPUT].currency1?.toSignificant(6) ?? '',
      currency2: parsedAmounts[Field.OUTPUT].currency2?.toSignificant(6) ?? '',
    },
  }

  const billExists = useMemo(
    () =>
      bills.find(
        (bill) => bill.lpToken.address[56].toLowerCase() === pairOut?.pair?.liquidityToken?.address.toLowerCase(),
      ),
    [bills, pairOut],
  )

  const { callback: zapCallback } = useZapCallback(
    zap,
    zapType,
    allowedSlippage,
    recipient,
    billExists?.contractAddress[56] || 's',
  )

  const handleZapCurrencySelection = useCallback(
    (field: Field, currency: Currency[]) => {
      onCurrencySelection(field, currency)
    },
    [onCurrencySelection],
  )

  // check whether the user has approved the router on the input token
  const [approval, approveCallback] = useApproveCallbackFromZap(zap)
  const showApproveFlow =
    !zapInputError && (approval === ApprovalState.NOT_APPROVED || approval === ApprovalState.PENDING)

  return (
    <Flex sx={{ height: '100vh', justifyContent: 'center' }}>
      <Flex sx={{ position: 'absolute', top: '150px', justifyContent: 'center', flexDirection: 'column' }}>
        <Flex sx={{ alignItems: 'flex-end', justifyContent: 'flex-end', mb: '10px' }}>
          <Button onClick={() => onSetZapType(zapType === ZapType.ZAP ? ZapType.ZAP_T_BILL : ZapType.ZAP)}>
            {zapType === ZapType.ZAP ? 'Zap Into Bill' : 'Zap Into LP'}
          </Button>
        </Flex>
        <DexPanel
          value={formattedAmounts[Field.INPUT]}
          panelText="From"
          currency={inputCurrency}
          otherCurrency={outputCurrencys[0]}
          fieldType={Field.INPUT}
          onCurrencySelect={(field, currency) => handleZapCurrencySelection(field, [currency])}
          onUserInput={onUserInput}
          handleMaxInput={null}
          independentField={independentField}
        />
        <Flex sx={{ margin: '30px 0px' }} />
        <Flex sx={{ minWidth: '400px', maxWidth: '600px' }}>
          <Flex sx={{ minWidth: '200px' }}>
            <DexPanel
              value={formattedAmounts[Field.OUTPUT].currency1}
              panelText="To"
              currency={outputCurrencys[0]}
              otherCurrency={inputCurrency}
              fieldType={Field.OUTPUT}
              onCurrencySelect={(field, currency) => handleZapCurrencySelection(field, [currency, outputCurrencys[1]])}
              onUserInput={onUserInput}
              handleMaxInput={null}
              independentField={independentField}
              disabled
            />
          </Flex>
          <Flex sx={{ width: '10px' }} />
          <Flex sx={{ minWidth: '200px' }}>
            <DexPanel
              value={formattedAmounts[Field.OUTPUT].currency2}
              panelText="To"
              currency={outputCurrencys[1]}
              otherCurrency={inputCurrency}
              fieldType={Field.OUTPUT}
              onCurrencySelect={(field, currency) => handleZapCurrencySelection(field, [outputCurrencys[0], currency])}
              onUserInput={onUserInput}
              handleMaxInput={null}
              independentField={independentField}
              disabled
            />
          </Flex>
        </Flex>
        <Flex sx={{ margin: '10px 0px' }} />
        {!showApproveFlow ? (
          <Button
            fullWidth
            onClick={zapCallback}
            disabled={pairOut.pairState === PairState.NOT_EXISTS || (zapType === ZapType.ZAP_T_BILL && !billExists)}
          >
            {zapType === ZapType.ZAP ? 'Zap Me' : 'Zap Me Into Bill'}
          </Button>
        ) : (
          <Button fullWidth onClick={approveCallback}>
            Approve Zap
          </Button>
        )}
        <Flex sx={{ mt: '10px', flexDirection: 'column' }}>
          <Text>Current Zap Type: {ZapType[zapType]}</Text>
          <Text>Does zap pair exist? {PairState[pairOut.pairState]}</Text>
          {zapType === ZapType.ZAP_T_BILL && <Text>Does Bill Exist?: {billExists ? 'Yes' : 'No'}</Text>}
          <Text>Estimated Zap LP amount: {pairOut.liquidityMinted?.toSignificant(10)}</Text>
          <Text>Routes taken</Text>
          <Text>
            <Flex sx={{ margin: '10px 0px' }}>
              {currencyOut1.path?.map((token, i) => {
                return (
                  <Flex
                    sx={{ alignItems: 'center', width: '50px', justifyContent: 'space-around' }}
                    key={token.address}
                  >
                    <CurrencyLogo currency={token} />{' '}
                    {i !== currencyOut1.path.length - 1 && <Svg icon="arrow" direction="right" />}
                  </Flex>
                )
              })}
            </Flex>
          </Text>
          <Text>
            <Flex>
              {zap?.currencyOut2.path?.map((token, i) => {
                return (
                  <Flex
                    sx={{ alignItems: 'center', width: '50px', justifyContent: 'space-around' }}
                    key={token.address}
                  >
                    <CurrencyLogo currency={token} />{' '}
                    {i !== currencyOut2.path.length - 1 && <Svg icon="arrow" direction="right" />}
                  </Flex>
                )
              })}
            </Flex>
          </Text>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default ZapTest
