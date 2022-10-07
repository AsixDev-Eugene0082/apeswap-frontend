/** @jsxImportSource theme-ui */
import React, { useCallback, useEffect, useState } from 'react'
import { useCurrency } from 'hooks/Tokens'
import { Flex, Text } from '@ape.swap/uikit'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useTranslation } from 'contexts/Localization'
import { RouteComponentProps } from 'react-router-dom'
import { Currency, TokenAmount } from '@ape.swap/sdk'
import { useSwapState } from 'state/swap/hooks'
import { useUserRecentTransactions } from 'state/user/hooks'
import maxAmountSpend from 'utils/maxAmountSpend'
import { useAppDispatch } from 'state'
import { Field, resetMintState } from 'state/mint/actions'
import { currencyId } from 'utils/currencyId'
import { useDerivedMintInfo, useMintActionHandlers, useMintState } from 'state/mint/hooks'
import { dexStyles } from '../styles'
import { styles } from './styles'
import DexPanel from '../components/DexPanel'
import DexNav from '../components/DexNav'
import AddLiquiditySign from './components/AddLiquiditySign'
import PoolInfo from './components/PoolInfo'
import AddLiquidityActions from './components/Actions'
import MyPositions from '../components/MyPositions'
import RecentTransactions from '../components/RecentTransactions'
import LiquiditySubNav from '../components/LiquiditySubNav'

function AddLiquidity({
  match: {
    params: { currencyIdA, currencyIdB },
  },
  history,
}: RouteComponentProps<{ currencyIdA?: string; currencyIdB?: string }>) {
  const { chainId } = useActiveWeb3React()
  const dispatch = useAppDispatch()
  const { INPUT, OUTPUT } = useSwapState()
  const { t } = useTranslation()
  const [tradeValueUsd, setTradeValueUsd] = useState(0)

  // Set either param currency or swap currency
  currencyIdA = currencyIdA || INPUT.currencyId
  currencyIdB = currencyIdB || OUTPUT.currencyId

  const [recentTransactions] = useUserRecentTransactions()

  // Set currencies
  const currencyA = useCurrency(currencyIdA)
  const currencyB = useCurrency(currencyIdB)

  // Check to reset mint state
  useEffect(() => {
    if (!currencyIdA && !currencyIdB) {
      dispatch(resetMintState())
    }
  }, [dispatch, currencyIdA, currencyIdB])

  // mint state
  const { independentField, typedValue, otherTypedValue } = useMintState()
  const {
    dependentField,
    currencies,
    currencyBalances,
    parsedAmounts,
    price,
    noLiquidity,
    liquidityMinted,
    poolTokenPercentage,
    error,
  } = useDerivedMintInfo(currencyA ?? undefined, currencyB ?? undefined)

  const { onUserInput } = useMintActionHandlers(noLiquidity)

  // Handle currency selection
  const handleCurrencySelect = useCallback(
    (field: Field, currency: Currency) => {
      const newCurrencyId = currencyId(currency)
      if (field === Field.CURRENCY_A) {
        if (newCurrencyId === currencyIdB) {
          history.push(`/add-liquidity/${currencyIdB}/${currencyIdA}`)
        } else if (currencyIdB) {
          history.push(`/add-liquidity/${newCurrencyId}/${currencyIdB}`)
        } else {
          history.push(`/add-liquidity/${newCurrencyId}`)
        }
      } else if (field === Field.CURRENCY_B) {
        if (newCurrencyId === currencyIdA) {
          if (currencyIdB) {
            history.push(`/add-liquidity/${currencyIdB}/${newCurrencyId}`)
          } else {
            history.push(`/add-liquidity/${newCurrencyId}`)
          }
        } else {
          history.push(`/add-liquidity/${currencyIdA || 'ETH'}/${newCurrencyId}`)
        }
      }
    },
    [currencyIdA, history, currencyIdB],
  )

  // get formatted amounts
  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: noLiquidity ? otherTypedValue : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  }

  // get the max amounts user can add
  const maxAmounts: { [field in Field]?: TokenAmount } = [Field.CURRENCY_A, Field.CURRENCY_B].reduce(
    (accumulator, field) => {
      return {
        ...accumulator,
        [field]: maxAmountSpend(currencyBalances[field]),
      }
    },
    {},
  )

  const handleMaxInput = useCallback(
    (field: Field) => {
      if (maxAmounts) {
        onUserInput(field, maxAmounts[field]?.toExact() ?? '')
      }
    },
    [maxAmounts, onUserInput],
  )

  return (
    <Flex sx={{ ...dexStyles.pageContainer }}>
      <Flex sx={{ flexDirection: 'column' }}>
        <Flex sx={{ ...dexStyles.dexContainer }}>
          <DexNav />
          <MyPositions />
          <LiquiditySubNav />
          {noLiquidity && (
            <Flex sx={{ ...styles.warningMessageContainer }}>
              <Text size="14px" weight={700} mb="10px" color="primaryBright">
                {t('You are the first liquidity provider.')}
              </Text>
              <Text size="12px" weight={500} color="primaryBright" sx={{ textAlign: 'center' }}>
                {t(
                  'The ratio of tokens you add will set the price of this pool. Once you are happy with the rate click supply to review.',
                )}
              </Text>
            </Flex>
          )}
          <DexPanel
            value={formattedAmounts[Field.CURRENCY_A]}
            panelText="Token 1"
            currency={currencyA}
            otherCurrency={currencyB}
            setTradeValueUsd={setTradeValueUsd}
            fieldType={Field.CURRENCY_A}
            onCurrencySelect={handleCurrencySelect}
            onUserInput={onUserInput}
            handleMaxInput={handleMaxInput}
            showCommonBases
          />
          <AddLiquiditySign />
          <DexPanel
            value={formattedAmounts[Field.CURRENCY_B]}
            panelText="Token 2"
            currency={currencyB}
            otherCurrency={currencyA}
            fieldType={Field.CURRENCY_B}
            onCurrencySelect={handleCurrencySelect}
            onUserInput={onUserInput}
            handleMaxInput={handleMaxInput}
            showCommonBases
          />
          <PoolInfo
            currencies={currencies}
            poolTokenPercentage={poolTokenPercentage}
            noLiquidity={noLiquidity}
            price={price}
            chainId={chainId}
            liquidityMinted={liquidityMinted}
          />
          <AddLiquidityActions
            currencies={currencies}
            tradeValueUsd={tradeValueUsd}
            error={error}
            parsedAmounts={parsedAmounts}
            noLiquidity={noLiquidity}
            liquidityMinted={liquidityMinted}
            poolTokenPercentage={poolTokenPercentage}
            price={price}
          />
        </Flex>
        {recentTransactions && <RecentTransactions />}
      </Flex>
    </Flex>
  )
}

export default React.memo(AddLiquidity)
