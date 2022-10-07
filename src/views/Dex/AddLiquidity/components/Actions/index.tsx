/** @jsxImportSource theme-ui */
import { Button, Flex, useModal } from '@ape.swap/uikit'
import { ETHER, ROUTER_ADDRESS } from '@ape.swap/sdk'
import { TransactionResponse } from '@ethersproject/providers'
import UnlockButton from 'components/UnlockButton'
import { useTranslation } from 'contexts/Localization'
import { BigNumber } from 'ethers'
import { useIsTransactionUnsupported } from 'hooks/Trades'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { parseAddress } from 'hooks/useAddress'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import useTransactionDeadline from 'hooks/useTransactionDeadline'
import React, { useCallback, useState } from 'react'
import { Field } from 'state/mint/actions'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useIsExpertMode, useUserSlippageTolerance } from 'state/user/hooks'
import { calculateGasMargin, calculateSlippageAmount, getRouterContract } from 'utils'
import track from 'utils/track'
import { wrappedCurrency } from 'utils/wrappedCurrency'
import AddLiquidityModal from '../AddLiquidityModal'
import { styles } from './styles'
import { AddLiquidityActionsProps } from './types'

const AddLiquidityActions: React.FC<AddLiquidityActionsProps> = ({
  currencies,
  error,
  parsedAmounts,
  noLiquidity,
  liquidityMinted,
  poolTokenPercentage,
  tradeValueUsd,
  price,
}) => {
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false)
  const [txHash, setTxHash] = useState<string>('')
  const { t } = useTranslation()
  const { account, chainId, library } = useActiveWeb3React()

  // Currencies
  const currencyA = currencies?.CURRENCY_A
  const currencyB = currencies?.CURRENCY_B

  // Check to see if the add is supported
  const addIsUnsupported = useIsTransactionUnsupported(currencyA, currencyB)

  // get custom setting values for user
  const [allowedSlippage] = useUserSlippageTolerance()

  // Custom from users settings
  const deadline = useTransactionDeadline()

  // Check if user has expert mode set
  const expertMode = useIsExpertMode()

  // Add transaction
  const addTransaction = useTransactionAdder()

  // check whether the user has approved the router on the tokens
  const [approvalA, approveACallback] = useApproveCallback(
    parsedAmounts[Field.CURRENCY_A],
    parseAddress(ROUTER_ADDRESS, chainId),
  )
  const [approvalB, approveBCallback] = useApproveCallback(
    parsedAmounts[Field.CURRENCY_B],
    parseAddress(ROUTER_ADDRESS, chainId),
  )

  const onAdd = async () => {
    if (!chainId || !library || !account) return
    const router = getRouterContract(chainId, library, account)

    const { [Field.CURRENCY_A]: parsedAmountA, [Field.CURRENCY_B]: parsedAmountB } = parsedAmounts
    if (!parsedAmountA || !parsedAmountB || !currencyA || !currencyB || !deadline) {
      return
    }

    const amountsMin = {
      [Field.CURRENCY_A]: calculateSlippageAmount(parsedAmountA, noLiquidity ? 0 : allowedSlippage)[0],
      [Field.CURRENCY_B]: calculateSlippageAmount(parsedAmountB, noLiquidity ? 0 : allowedSlippage)[0],
    }

    let estimate
    let method: (...args: any) => Promise<TransactionResponse>
    let args: Array<string | string[] | number>
    let value: BigNumber | null
    if (currencyA === ETHER || currencyB === ETHER) {
      const tokenBIsETH = currencyB === ETHER
      estimate = router.estimateGas.addLiquidityETH
      method = router.addLiquidityETH
      args = [
        wrappedCurrency(tokenBIsETH ? currencyA : currencyB, chainId)?.address ?? '', // token
        (tokenBIsETH ? parsedAmountA : parsedAmountB).raw.toString(), // token desired
        amountsMin[tokenBIsETH ? Field.CURRENCY_A : Field.CURRENCY_B].toString(), // token min
        amountsMin[tokenBIsETH ? Field.CURRENCY_B : Field.CURRENCY_A].toString(), // eth min
        account,
        deadline.toHexString(),
      ]
      value = BigNumber.from((tokenBIsETH ? parsedAmountB : parsedAmountA).raw.toString())
    } else {
      estimate = router.estimateGas.addLiquidity
      method = router.addLiquidity
      args = [
        wrappedCurrency(currencyA, chainId)?.address ?? '',
        wrappedCurrency(currencyB, chainId)?.address ?? '',
        parsedAmountA.raw.toString(),
        parsedAmountB.raw.toString(),
        amountsMin[Field.CURRENCY_A].toString(),
        amountsMin[Field.CURRENCY_B].toString(),
        account,
        deadline.toHexString(),
      ]
      value = null
    }

    setAttemptingTxn(true)
    await estimate(...args, value ? { value } : {})
      .then((estimatedGasLimit) =>
        method(...args, {
          ...(value ? { value } : {}),
          gasLimit: calculateGasMargin(estimatedGasLimit),
        }).then((response) => {
          setAttemptingTxn(false)

          addTransaction(response, {
            summary: `Add ${parsedAmounts[Field.CURRENCY_A]?.toSignificant(3)} ${currencies[
              Field.CURRENCY_A
            ]?.getSymbol(chainId)} and ${parsedAmounts[Field.CURRENCY_B]?.toSignificant(3)} ${currencies[
              Field.CURRENCY_B
            ]?.getSymbol(chainId)}`,
          })

          setTxHash(response.hash)
          track({
            event: 'liquidity',
            chain: chainId,
            value: tradeValueUsd * 2,
            data: {
              token1: currencies[Field.CURRENCY_A]?.getSymbol(chainId),
              token2: currencies[Field.CURRENCY_B]?.getSymbol(chainId),
              token1Amount: parsedAmounts[Field.CURRENCY_A]?.toSignificant(3),
              token2Amount: parsedAmounts[Field.CURRENCY_B]?.toSignificant(3),
              cat: 'add',
            },
          })
        }),
      )
      .catch((err) => {
        setAttemptingTxn(false)
        // we only care if the error is something _other_ than the user rejected the tx
        if (err?.code !== 4001) {
          console.error(err)
        }
      })
  }

  const handleDismissConfirmation = useCallback(() => {
    // if there was a tx hash, we want to clear the input
    setTxHash('')
  }, [])

  const [onPresentAddLiquidityModal] = useModal(
    <AddLiquidityModal
      title={noLiquidity ? t('You are creating a pool') : t('Confirm Add Liquidity')}
      currencies={currencies}
      noLiquidity={noLiquidity}
      liquidityMinted={liquidityMinted}
      parsedAmounts={parsedAmounts}
      price={price}
      poolTokenPercentage={poolTokenPercentage}
      txHash={txHash}
      attemptingTxn={attemptingTxn}
      onDismiss={handleDismissConfirmation}
      onAdd={onAdd}
    />,
    true,
    true,
    'addLiquidityModal',
  )

  const renderAction = () => {
    if (addIsUnsupported) {
      return (
        <Button fullWidth disabled>
          {t('Unsupported Asset')}
        </Button>
      )
    }
    if (!account) {
      return <UnlockButton fullWidth />
    }
    if (error) {
      return (
        <Button fullWidth disabled>
          {error}
        </Button>
      )
    }
    if (
      (approvalA === ApprovalState.NOT_APPROVED ||
        approvalA === ApprovalState.PENDING ||
        approvalB === ApprovalState.NOT_APPROVED ||
        approvalB === ApprovalState.PENDING) &&
      !error
    ) {
      return (
        <Flex sx={{ width: '100%' }}>
          <>
            {approvalA !== ApprovalState.APPROVED && (
              <Button
                onClick={approveACallback}
                disabled={approvalA === ApprovalState.PENDING}
                load={approvalA === ApprovalState.PENDING}
                fullWidth
                mr={approvalB !== ApprovalState.APPROVED && '7.5px'}
                sx={{ padding: '10px 2px' }}
              >
                {approvalA === ApprovalState.PENDING
                  ? `${t('Enabling')} ${currencies[Field.CURRENCY_A]?.getSymbol(chainId)}`
                  : `${t('Enable')} ${currencies[Field.CURRENCY_A]?.getSymbol(chainId)}`}
              </Button>
            )}
            {approvalB !== ApprovalState.APPROVED && (
              <Button
                onClick={approveBCallback}
                disabled={approvalB === ApprovalState.PENDING}
                load={approvalB === ApprovalState.PENDING}
                fullWidth
                sx={{ padding: '10px 2px' }}
              >
                {approvalB === ApprovalState.PENDING
                  ? `${t('Enabling')} ${currencies[Field.CURRENCY_B]?.getSymbol(chainId)}`
                  : `${t('Enable')} ${currencies[Field.CURRENCY_B]?.getSymbol(chainId)}`}
              </Button>
            )}
          </>
        </Flex>
      )
    }
    return (
      <Button
        fullWidth
        onClick={() => {
          if (expertMode) {
            onAdd()
          } else {
            onPresentAddLiquidityModal()
          }
        }}
      >
        {t('Add Liquidity')}
      </Button>
    )
  }

  return <Flex sx={{ ...styles.dexActionsContainer }}>{renderAction()}</Flex>
}

export default React.memo(AddLiquidityActions)
