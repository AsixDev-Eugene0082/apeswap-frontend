/** @jsxImportSource theme-ui */
import React, { useCallback, useState } from 'react'
import { Flex, Svg, Text, Text as StyledText, useModal } from '@ape.swap/uikit'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useBuyBill from 'views/Bills/hooks/useBuyBill'
import BigNumber from 'bignumber.js'
import { useToast } from 'state/hooks'
import { getEtherscanLink } from 'utils'
import { useAppDispatch } from 'state'
import { fetchBillsUserDataAsync, fetchUserOwnedBillsDataAsync } from 'state/bills'
import { Field, selectCurrency } from 'state/swap/actions'
import { useTranslation } from 'contexts/Localization'
import { BuyProps, DualCurrencySelector } from './types'
import { GetLPButton, styles } from './styles'
import DualLiquidityModal from 'components/DualAddLiquidity/DualLiquidityModal'
import { selectOutputCurrency } from 'state/zap/actions'
import { BillValueContainer, TextWrapper } from '../Modals/styles'
import DualCurrencyPanel from 'components/DualCurrencyPanel/DualCurrencyPanel'
import { usePair } from 'hooks/usePairs'
import { ZapType } from '@ape.swap/sdk'
import { useDerivedZapInfo, useZapActionHandlers, useZapState } from 'state/zap/hooks'
import { useCurrency } from 'hooks/Tokens'
import { Box } from 'theme-ui'
import { useCurrencyBalance } from 'state/wallet/hooks'
import maxAmountSpend from 'utils/maxAmountSpend'
import { useUserSlippageTolerance } from 'state/user/hooks'
import { useZapCallback } from 'hooks/useZapCallback'
import BillActions from './BillActions'
import track from 'utils/track'
import { getBalanceNumber } from 'utils/formatBalance'

const Buy: React.FC<BuyProps> = ({ bill, onBillId, onTransactionSubmited }) => {
  const {
    token,
    quoteToken,
    contractAddress,
    price,
    lpPrice,
    earnToken,
    earnTokenPrice,
    maxTotalPayOut,
    totalPayoutGiven,
    billNftAddress,
  } = bill
  const { chainId, account, library } = useActiveWeb3React()
  const { recipient, typedValue } = useZapState()
  const { onBuyBill } = useBuyBill(contractAddress[chainId], typedValue, lpPrice, price)
  const dispatch = useAppDispatch()
  const [pendingTrx, setPendingTrx] = useState(false)
  const { toastSuccess, toastError } = useToast()
  const { t } = useTranslation()

  const billsCurrencies: DualCurrencySelector = {
    currencyA: useCurrency(token.address[chainId]),
    currencyB: useCurrency(quoteToken.address[chainId]),
  }
  const [currencyA, setCurrencyA] = useState(billsCurrencies.currencyA)
  const [currencyB, setCurrencyB] = useState(billsCurrencies.currencyB)
  const inputCurrencies = [currencyA, currencyB]

  // We want to find the pair (if any) to get its balance, if there's no pair use currencyA
  const [, pair] = usePair(inputCurrencies[0], inputCurrencies[1])
  const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, pair?.liquidityToken ?? currencyA)

  const { zap } = useDerivedZapInfo()
  const [zapSlippage] = useUserSlippageTolerance(true)
  const { onCurrencySelection, onUserInput } = useZapActionHandlers()
  const maxPrice = new BigNumber(price).times(102).div(100).toFixed(0)
  const { callback: zapCallback } = useZapCallback(
    zap,
    ZapType.ZAP_T_BILL,
    zapSlippage,
    recipient,
    contractAddress[chainId] || 's',
    maxPrice,
  )

  // this logic prevents user to initiate a tx for a higher bill value than the available amount
  const consideredValue = currencyB ? typedValue : zap?.pairOut?.liquidityMinted?.toExact()
  const bigValue = new BigNumber(consideredValue).times(new BigNumber(10).pow(18))
  const billValue = bigValue.div(new BigNumber(price))?.toString()
  const available = new BigNumber(maxTotalPayOut)
    ?.minus(new BigNumber(totalPayoutGiven))
    ?.div(new BigNumber(10).pow(earnToken.decimals))
  // threshold equals to 10 usd in earned tokens (banana or jungle token)
  const threshold = new BigNumber(10).div(earnTokenPrice)
  const safeAvailable = available.minus(threshold)

  const onHandleValueChange = useCallback(
    (val: string) => {
      onUserInput(Field.INPUT, val)
    },
    [onUserInput],
  )

  const searchForBillId = useCallback(
    (resp) => {
      const billId = resp.events[6]?.args?.billId?.toString()
      const { transactionHash } = resp
      onBillId(billId, transactionHash)
    },
    [onBillId],
  )

  const handleBuy = useCallback(async () => {
    setPendingTrx(true)
    onTransactionSubmited(true)
    if (currencyB) {
      await onBuyBill()
        .then((resp) => {
          const trxHash = resp.transactionHash
          searchForBillId(resp)
          toastSuccess(t('Buy Successful'), {
            text: t('View Transaction'),
            url: getEtherscanLink(trxHash, 'transaction', chainId),
          })
          dispatch(fetchUserOwnedBillsDataAsync(chainId, account))
          dispatch(fetchBillsUserDataAsync(chainId, account))
        })
        .catch((e) => {
          console.error(e)
          toastError(e?.data?.message || t('Error: Please try again.'))
          setPendingTrx(false)
          onTransactionSubmited(false)
        })
    } else {
      await zapCallback()
        .then((hash) => {
          setPendingTrx(true)
          library
            .waitForTransaction(hash)
            .then((receipt) => {
              const { logs } = receipt
              const findBillNftLog = logs.find((log) => log.address.toLowerCase() === billNftAddress.toLowerCase())
              const getBillNftIndex = findBillNftLog.topics[findBillNftLog.topics.length - 1]
              const convertHexId = parseInt(getBillNftIndex, 16)
              onBillId(convertHexId.toString(), hash)
              dispatch(fetchUserOwnedBillsDataAsync(chainId, account))
              dispatch(fetchBillsUserDataAsync(chainId, account))
            })
            .catch((e) => {
              console.error(e)
              toastError(e?.data?.message || t('Error: Please try again.'))
              setPendingTrx(false)
              onTransactionSubmited(false)
            })
          track({
            event: 'zap',
            chain: chainId,
            data: {
              cat: 'bill',
              token1: zap.currencyIn.currency.getSymbol(chainId),
              token2: `${zap.currencyOut1.outputCurrency.getSymbol(
                chainId,
              )}-${zap.currencyOut2.outputCurrency.getSymbol(chainId)}`,
              amount: getBalanceNumber(new BigNumber(zap.currencyIn.inputAmount.toString())),
            },
          })
        })
        .catch((e) => {
          console.error(e)
          toastError(e?.data?.message || t('Error: Please try again.'))
          setPendingTrx(false)
          onTransactionSubmited(false)
        })
    }
  }, [
    account,
    chainId,
    currencyB,
    library,
    billNftAddress,
    onBillId,
    dispatch,
    onBuyBill,
    onTransactionSubmited,
    searchForBillId,
    t,
    toastError,
    toastSuccess,
    zapCallback,
    zap,
  ])

  // would love to create a function on the near future to avoid the same code repeating itself along several parts of the repo
  const [onPresentAddLiquidityModal] = useModal(<DualLiquidityModal />, true, true, 'liquidityWidgetModal')

  const showLiquidity = () => {
    dispatch(
      selectCurrency({
        field: Field.INPUT,
        currencyId: token.symbol === 'BNB' ? 'ETH' : token.address[chainId],
      }),
    )
    dispatch(
      selectCurrency({
        field: Field.OUTPUT,
        currencyId: quoteToken.symbol === 'BNB' ? 'ETH' : quoteToken.address[chainId],
      }),
    )
    dispatch(
      selectOutputCurrency({
        currency1: token.address[chainId],
        currency2: quoteToken.address[chainId],
      }),
    )
    onPresentAddLiquidityModal()
  }

  const handleMaxInput = useCallback(() => {
    onHandleValueChange(maxAmountSpend(selectedCurrencyBalance).toExact())
  }, [onHandleValueChange, selectedCurrencyBalance])

  const handleCurrencySelect = useCallback(
    (currency: DualCurrencySelector) => {
      setCurrencyA(currency?.currencyA)
      setCurrencyB(currency?.currencyB)
      onHandleValueChange('')
      if (!currency?.currencyB) {
        // if there's no currencyB use zap logic
        onCurrencySelection(Field.INPUT, [currency.currencyA])
        onCurrencySelection(Field.OUTPUT, [billsCurrencies.currencyA, billsCurrencies.currencyB])
      }
    },
    [billsCurrencies.currencyA, billsCurrencies.currencyB, onCurrencySelection, onHandleValueChange],
  )

  return (
    <Flex sx={styles.buyContainer}>
      <Flex sx={{ flexWrap: 'wrap' }}>
        <DualCurrencyPanel
          handleMaxInput={handleMaxInput}
          onUserInput={onHandleValueChange}
          value={typedValue}
          onCurrencySelect={handleCurrencySelect}
          inputCurrencies={inputCurrencies}
          lpList={[billsCurrencies]}
        />
      </Flex>
      <Flex sx={styles.detailsContainer}>
        <BillValueContainer>
          <TextWrapper>
            <Text size="12px" pr={1}>
              {t('Bill Value')}:{' '}
              <span style={{ fontWeight: 700 }}>
                {billValue === 'NaN' ? '0' : parseFloat(billValue).toFixed(3)} {earnToken?.symbol}
              </span>
            </Text>
          </TextWrapper>
          <TextWrapper>
            <Text size="12px">
              {t('Available')}:{' '}
              <span style={{ fontWeight: 700 }}>
                {!available ? '0' : new BigNumber(safeAvailable).toFixed(3)} {earnToken?.symbol}
              </span>
            </Text>
          </TextWrapper>
        </BillValueContainer>
        <Flex sx={{ ...styles.buttonsContainer }}>
          <Box sx={styles.getLpContainer}>
            <GetLPButton variant="secondary" onClick={showLiquidity}>
              <StyledText sx={{ marginRight: '5px' }}>{t('Get LP')}</StyledText>
              <Svg icon="ZapIcon" color="yellow" />
            </GetLPButton>
          </Box>
          <Box sx={styles.buyButtonContainer}>
            <BillActions
              bill={bill}
              zap={zap}
              currencyB={currencyB}
              handleBuy={handleBuy}
              billValue={billValue}
              value={typedValue}
              safeAvailable={safeAvailable?.toString()}
              balance={selectedCurrencyBalance?.toExact()}
              pendingTrx={pendingTrx}
            />
          </Box>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default React.memo(Buy)
