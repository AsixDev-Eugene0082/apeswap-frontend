/** @jsxImportSource theme-ui */
import React, { useCallback, useEffect, useState } from 'react'
import { Currency, ETHER, JSBI, TokenAmount } from '@ape.swap/sdk'
import { Text, useModal, Flex, Svg } from '@ape.swap/uikit'
import { useTranslation } from 'contexts/Localization'
import { AutoColumn, ColumnCenter } from '../../../components/layout/Column'
import { CurrencyLogo } from '../../../components/Logo'
import { MinimalPositionCard } from '../../../components/PositionCard'
import Row from '../../../components/layout/Row'
import CurrencySearchModal from '../../../components/SearchModal/CurrencySearchModal'
import { PairState, usePair } from '../../../hooks/usePairs'
import useActiveWeb3React from '../../../hooks/useActiveWeb3React'
import { usePairAdder, useUserRecentTransactions } from '../../../state/user/hooks'
import { useTokenBalance } from '../../../state/wallet/hooks'
import StyledInternalLink from '../../../components/Links'
import { currencyId } from '../../../utils/currencyId'
import Dots from '../../../components/Loader/Dots'
import { dexStyles } from '../styles'
import { styles } from './styles'
import DexNav from '../components/DexNav'
import MyPositions from '../components/MyPositions'
import RecentTransactions from '../components/RecentTransactions'
import { Box } from 'theme-ui'

enum Fields {
  TOKEN0 = 0,
  TOKEN1 = 1,
}

export default function PoolFinder() {
  const { account, chainId } = useActiveWeb3React()
  const [recentTransactions] = useUserRecentTransactions()

  const [activeField, setActiveField] = useState<number>(Fields.TOKEN1)
  const [currency0, setCurrency0] = useState<Currency | null>(ETHER)
  const [currency1, setCurrency1] = useState<Currency | null>(null)

  const [pairState, pair] = usePair(currency0 ?? undefined, currency1 ?? undefined)
  const addPair = usePairAdder()
  const { t } = useTranslation()
  useEffect(() => {
    if (pair) {
      addPair(pair)
    }
  }, [pair, addPair])

  const validPairNoLiquidity: boolean =
    pairState === PairState.NOT_EXISTS ||
    Boolean(
      pairState === PairState.EXISTS &&
        pair &&
        JSBI.equal(pair.reserve0.raw, JSBI.BigInt(0)) &&
        JSBI.equal(pair.reserve1.raw, JSBI.BigInt(0)),
    )

  const position: TokenAmount | undefined = useTokenBalance(account ?? undefined, pair?.liquidityToken)
  const hasPosition = Boolean(position && JSBI.greaterThan(position.raw, JSBI.BigInt(0)))

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      if (activeField === Fields.TOKEN0) {
        setCurrency0(currency)
      } else {
        setCurrency1(currency)
      }
    },
    [activeField],
  )

  const prerequisiteMessage = (
    <Text textAlign="center">
      {!account ? t('Connect to a wallet to find pools') : t('Select a token to find your liquidity.')}
    </Text>
  )

  const [onPresentCurrencyModal] = useModal(
    <CurrencySearchModal
      onCurrencySelect={handleCurrencySelect}
      selectedCurrency={(activeField === Fields.TOKEN0 ? currency1 : currency0) ?? undefined}
    />,
    true,
    true,
    'selectCurrencyModal',
  )

  return (
    <Flex sx={{ ...dexStyles.pageContainer }}>
      <Flex sx={{ flexDirection: 'column' }}>
        <Flex sx={{ ...dexStyles.dexContainer }}>
          <DexNav />
          <Flex sx={{ margin: '20px 0px 5px 0px', justifyContent: 'center', maxWidth: '100%', width: '420px' }}>
            <Text weight={700}>{t('FIND YOUR LIQUIDITY')}</Text>
          </Flex>
          <MyPositions />
          <Box sx={{ marginTop: '20px' }}>
            <Flex sx={{ ...styles.tokenContainer }}>
              <Text sx={{ ...styles.swapDirectionText }}>{t('Token 1')}</Text>
              <Flex
                sx={{ ...styles.primaryFlex }}
                onClick={() => {
                  onPresentCurrencyModal()
                  setActiveField(Fields.TOKEN0)
                }}
              >
                <>
                  {currency0 ? (
                    <Row>
                      <CurrencyLogo currency={currency0} size="30px" />
                      <Text sx={{ ...styles.tokenText }}>{currency0.getSymbol(chainId)}</Text>
                    </Row>
                  ) : (
                    <Text sx={{ ...styles.tokenText }}>{t('Select a Token')}</Text>
                  )}
                  <Svg icon="caret" />
                </>
              </Flex>
            </Flex>
            <Flex sx={{ margin: '10px 0px', justifyContent: 'center' }}>
              <Flex
                sx={{
                  ...styles.addContainer,
                }}
              >
                <Text weight={700} sx={{ lineHeight: '0px' }}>
                  +
                </Text>
              </Flex>
            </Flex>
            <Flex sx={{ ...styles.tokenContainer }}>
              <Text sx={{ ...styles.swapDirectionText }}>{t('Token 2')}</Text>
              <Flex
                sx={{ ...styles.primaryFlex }}
                onClick={() => {
                  onPresentCurrencyModal()
                  setActiveField(Fields.TOKEN1)
                }}
              >
                <>
                  {currency1 ? (
                    <Row>
                      <CurrencyLogo currency={currency1} size="30px" />
                      <Text sx={{ ...styles.tokenText }}>{currency1.getSymbol(chainId)}</Text>
                    </Row>
                  ) : (
                    <Text sx={{ ...styles.tokenText }}>{t('Select a Token')}</Text>
                  )}
                  <Svg icon="caret" />
                </>
              </Flex>
            </Flex>
          </Box>
          {hasPosition && (
            <ColumnCenter
              style={{ justifyItems: 'center', backgroundColor: '', margin: '20px 0px', borderRadius: '12px' }}
            >
              <Text textAlign="center">{t('Pool Found!')}</Text>
              <StyledInternalLink to="/liquidity">
                <Text textAlign="center" style={{ textDecoration: 'underline' }}>
                  {t('Manage this pool.')}
                </Text>
              </StyledInternalLink>
            </ColumnCenter>
          )}

          {currency0 && currency1 ? (
            pairState === PairState.EXISTS ? (
              hasPosition && pair ? (
                <MinimalPositionCard pair={pair} />
              ) : (
                <AutoColumn gap="sm" justify="center" style={{ margin: '20px 0px' }}>
                  <Text textAlign="center">{t('You don’t have liquidity in this pool yet.')}</Text>
                  <StyledInternalLink to={`/add/${currencyId(currency0)}/${currencyId(currency1)}`}>
                    <Text style={{ textDecoration: 'underline' }} textAlign="center">
                      {t('Add Liquidity')}
                    </Text>
                  </StyledInternalLink>
                </AutoColumn>
              )
            ) : validPairNoLiquidity ? (
              <AutoColumn gap="sm" justify="center" style={{ margin: '20px 0px' }}>
                <Text textAlign="center">No pool found.</Text>
                <StyledInternalLink
                  to={`/add/${currencyId(currency0)}/${currencyId(currency1)}`}
                  style={{ textDecoration: 'underline' }}
                >
                  {t('Create pool.')}
                </StyledInternalLink>
              </AutoColumn>
            ) : pairState === PairState.INVALID ? (
              <AutoColumn gap="sm" justify="center">
                <Text textAlign="center" fontWeight={500}>
                  {t('Invalid pair.')}
                </Text>
              </AutoColumn>
            ) : pairState === PairState.LOADING ? (
              <AutoColumn gap="sm" justify="center">
                <Text textAlign="center">
                  {t('Loading')}
                  <Dots />
                </Text>
              </AutoColumn>
            ) : null
          ) : (
            <Flex sx={{ margin: '20px 0px', justifyContent: 'center' }}>{prerequisiteMessage}</Flex>
          )}
          {/* <CurrencySearchModal
          isOpen={showSearch}
          onCurrencySelect={handleCurrencySelect}
          onDismiss={handleSearchDismiss}
          showCommonBases
          selectedCurrency={(activeField === Fields.TOKEN0 ? currency1 : currency0) ?? undefined}
        /> */}
        </Flex>
        {recentTransactions && <RecentTransactions />}
      </Flex>
    </Flex>
  )
}
