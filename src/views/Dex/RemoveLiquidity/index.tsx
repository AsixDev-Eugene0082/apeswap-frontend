import React, { useCallback, useState } from 'react'
import { useCurrency } from 'hooks/Tokens'
import { Flex, Text } from '@ape.swap/uikit'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useTranslation } from 'contexts/Localization'
import { RouteComponentProps } from 'react-router-dom'
import { Percent } from '@ape.swap/sdk'
import { useBurnActionHandlers, useBurnState, useDerivedBurnInfo } from 'state/burn/hooks'
import { useUserRecentTransactions } from 'state/user/hooks'
import { Field } from 'state/burn/actions'
import { dexStyles } from '../styles'
import DexPanel from '../components/DexPanel'
import DexNav from '../components/DexNav'
import PoolInfo from './components/PoolInfo'
import RemoveLiquidityActions from './components/Actions'
import MyPositions from '../components/MyPositions'
import RecentTransactions from '../components/RecentTransactions'

function RemoveLiquidity({
  match: {
    params: { currencyIdA, currencyIdB },
  },
}: RouteComponentProps<{ currencyIdA: string; currencyIdB: string }>) {
  const { chainId } = useActiveWeb3React()
  const { t } = useTranslation()
  const [recentTransactions] = useUserRecentTransactions()
  const [tradeValueUsd, setTradeValueUsd] = useState(0)

  // Set currencies
  const currencyA = useCurrency(currencyIdA)
  const currencyB = useCurrency(currencyIdB)

  // burn state
  const { independentField, typedValue } = useBurnState()
  const { pair, parsedAmounts, error } = useDerivedBurnInfo(currencyA ?? undefined, currencyB ?? undefined)
  const { onUserInput: _onUserInput } = useBurnActionHandlers()

  // allowance handling
  const [, setSignatureData] = useState<{ v: number; r: string; s: string; deadline: number } | null>(null)

  // get formatted amounts
  const formattedAmounts = {
    [Field.LIQUIDITY_PERCENT]: parsedAmounts[Field.LIQUIDITY_PERCENT].equalTo('0')
      ? '0'
      : parsedAmounts[Field.LIQUIDITY_PERCENT].lessThan(new Percent('1', '100'))
      ? '<1'
      : parsedAmounts[Field.LIQUIDITY_PERCENT].toFixed(0),
    [Field.LIQUIDITY]:
      independentField === Field.LIQUIDITY ? typedValue : parsedAmounts[Field.LIQUIDITY]?.toSignificant(6) ?? '',
    [Field.CURRENCY_A]:
      independentField === Field.CURRENCY_A ? typedValue : parsedAmounts[Field.CURRENCY_A]?.toSignificant(6) ?? '',
    [Field.CURRENCY_B]:
      independentField === Field.CURRENCY_B ? typedValue : parsedAmounts[Field.CURRENCY_B]?.toSignificant(6) ?? '',
  }

  // wrapped onUserInput to clear signatures
  const onUserInput = useCallback(
    (field: Field, value: string) => {
      setSignatureData(null)
      return _onUserInput(field, value)
    },
    [_onUserInput],
  )

  const handleMaxInput = useCallback(() => {
    onUserInput(Field.LIQUIDITY_PERCENT, '100')
  }, [onUserInput])

  return (
    <Flex sx={{ ...dexStyles.pageContainer }}>
      <Flex sx={{ flexDirection: 'column' }}>
        <Flex sx={{ ...dexStyles.dexContainer }}>
          <DexNav />
          <Flex sx={{ margin: '20px 0px 5px 0px', justifyContent: 'center', maxWidth: '100%', width: '420px' }}>
            <Text weight={700}>{t('REMOVE LIQUIDITY')}</Text>
          </Flex>
          <MyPositions />
          <Flex sx={{ marginTop: '35px', flexWrap: 'wrap' }}>
            <DexPanel
              value={formattedAmounts[Field.LIQUIDITY_PERCENT]}
              setTradeValueUsd={setTradeValueUsd}
              panelText={t('Remove:')}
              currency={currencyA}
              otherCurrency={currencyB}
              fieldType={Field.LIQUIDITY_PERCENT}
              onCurrencySelect={null}
              onUserInput={(field, val) =>
                parseInt(val) > 100
                  ? onUserInput(field, '100')
                  : val.toString() === ''
                  ? onUserInput(field, '0')
                  : onUserInput(field, parseInt(val).toString())
              }
              handleMaxInput={handleMaxInput}
              showCommonBases
              lpPair={pair}
            />
            <PoolInfo pair={pair} parsedAmounts={parsedAmounts} chainId={chainId} />
            <RemoveLiquidityActions
              pair={pair}
              error={error}
              parsedAmounts={parsedAmounts}
              tradeValueUsd={tradeValueUsd}
            />
          </Flex>
        </Flex>
        {recentTransactions && <RecentTransactions />}
      </Flex>
    </Flex>
  )
}

export default React.memo(RemoveLiquidity)
