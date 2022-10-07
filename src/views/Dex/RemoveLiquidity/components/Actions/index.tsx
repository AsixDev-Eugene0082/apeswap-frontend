/** @jsxImportSource theme-ui */
import { Button, Flex, useModal } from '@ape.swap/uikit'
import { ETHER, ROUTER_ADDRESS } from '@ape.swap/sdk'
import { TransactionResponse } from '@ethersproject/providers'
import UnlockButton from 'components/UnlockButton'
import { useTranslation } from 'contexts/Localization'
import { BigNumber, Contract } from 'ethers'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { parseAddress } from 'hooks/useAddress'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import { usePairContract } from 'hooks/useContract'
import useTransactionDeadline from 'hooks/useTransactionDeadline'
import React, { useCallback, useMemo, useState } from 'react'
import { Field } from 'state/burn/actions'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useIsExpertMode, useUserSlippageTolerance } from 'state/user/hooks'
import { calculateGasMargin, calculateSlippageAmount, getRouterContract } from 'utils'
import track from 'utils/track'
import { wrappedCurrency } from 'utils/wrappedCurrency'
import RemoveLiquidityModal from '../RemoveLiquidityModal'
import { styles } from './styles'
import { RemoveLiquidityActionProps } from './types'

const RemoveLiquidityActions: React.FC<RemoveLiquidityActionProps> = ({
  pair,
  error,
  parsedAmounts,
  tradeValueUsd,
}) => {
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false)
  const [txHash, setTxHash] = useState<string>('')
  const { t } = useTranslation()
  const { account, chainId, library } = useActiveWeb3React()

  // Currencies
  const currencyA = pair?.token0
  const currencyB = pair?.token1

  // Tokens
  const [tokenA, tokenB] = useMemo(
    () => [wrappedCurrency(currencyA, chainId), wrappedCurrency(currencyB, chainId)],
    [currencyA, currencyB, chainId],
  )

  // Signature data
  const [signatureData] = useState<{ v: number; r: string; s: string; deadline: number } | null>(null)

  // Approval
  const [approval, approveCallback] = useApproveCallback(
    parsedAmounts[Field.LIQUIDITY],
    parseAddress(ROUTER_ADDRESS, chainId),
  )

  // Pair contract
  const pairContract: Contract | null = usePairContract(pair?.liquidityToken?.address)

  // Attempt to approve
  const onAttemptToApprove = async () => {
    if (!pairContract || !pair || !library || !deadline) throw new Error('missing dependencies')
    const liquidityAmount = parsedAmounts[Field.LIQUIDITY]
    if (!liquidityAmount) throw new Error('missing liquidity amount')
    return approveCallback()
  }

  // get custom setting values for user
  const [allowedSlippage] = useUserSlippageTolerance()

  // Custom from users settings
  const deadline = useTransactionDeadline()

  // Check if user has expert mode set
  const expertMode = useIsExpertMode()

  // tx sending
  const addTransaction = useTransactionAdder()
  const onRemove = async () => {
    if (!chainId || !library || !account || !deadline) throw new Error('missing dependencies')
    const { [Field.CURRENCY_A]: currencyAmountA, [Field.CURRENCY_B]: currencyAmountB } = parsedAmounts
    if (!currencyAmountA || !currencyAmountB) {
      throw new Error('missing currency amounts')
    }
    const router = getRouterContract(chainId, library, account)

    const amountsMin = {
      [Field.CURRENCY_A]: calculateSlippageAmount(currencyAmountA, allowedSlippage)[0],
      [Field.CURRENCY_B]: calculateSlippageAmount(currencyAmountB, allowedSlippage)[0],
    }

    if (!currencyA || !currencyB) throw new Error('missing tokens')
    const liquidityAmount = parsedAmounts[Field.LIQUIDITY]
    if (!liquidityAmount) throw new Error('missing liquidity amount')

    const currencyBIsETH = currencyB === ETHER
    const oneCurrencyIsETH = currencyA === ETHER || currencyBIsETH

    if (!tokenA || !tokenB) throw new Error('could not wrap')

    let methodNames: string[]
    let args: Array<string | string[] | number | boolean>
    // we have approval, use normal remove liquidity
    if (approval === ApprovalState.APPROVED) {
      // removeLiquidityETH
      if (oneCurrencyIsETH) {
        methodNames = ['removeLiquidityETH', 'removeLiquidityETHSupportingFeeOnTransferTokens']
        args = [
          currencyBIsETH ? tokenA.address : tokenB.address,
          liquidityAmount.raw.toString(),
          amountsMin[currencyBIsETH ? Field.CURRENCY_A : Field.CURRENCY_B].toString(),
          amountsMin[currencyBIsETH ? Field.CURRENCY_B : Field.CURRENCY_A].toString(),
          account,
          deadline.toHexString(),
        ]
      }
      // removeLiquidity
      else {
        methodNames = ['removeLiquidity']
        args = [
          tokenA.address,
          tokenB.address,
          liquidityAmount.raw.toString(),
          amountsMin[Field.CURRENCY_A].toString(),
          amountsMin[Field.CURRENCY_B].toString(),
          account,
          deadline.toHexString(),
        ]
      }
    }
    // we have a signature, use permit versions of remove liquidity
    else if (signatureData !== null) {
      // removeLiquidityETHWithPermit
      if (oneCurrencyIsETH) {
        methodNames = ['removeLiquidityETHWithPermit', 'removeLiquidityETHWithPermitSupportingFeeOnTransferTokens']
        args = [
          currencyBIsETH ? tokenA.address : tokenB.address,
          liquidityAmount.raw.toString(),
          amountsMin[currencyBIsETH ? Field.CURRENCY_A : Field.CURRENCY_B].toString(),
          amountsMin[currencyBIsETH ? Field.CURRENCY_B : Field.CURRENCY_A].toString(),
          account,
          signatureData.deadline,
          false,
          signatureData.v,
          signatureData.r,
          signatureData.s,
        ]
      }
      // removeLiquidityETHWithPermit
      else {
        methodNames = ['removeLiquidityWithPermit']
        args = [
          tokenA.address,
          tokenB.address,
          liquidityAmount.raw.toString(),
          amountsMin[Field.CURRENCY_A].toString(),
          amountsMin[Field.CURRENCY_B].toString(),
          account,
          signatureData.deadline,
          false,
          signatureData.v,
          signatureData.r,
          signatureData.s,
        ]
      }
    } else {
      throw new Error('Attempting to confirm without approval or a signature. Please contact support.')
    }

    const safeGasEstimates: (BigNumber | undefined)[] = await Promise.all(
      methodNames.map((methodName) =>
        router.estimateGas[methodName](...args)
          .then(calculateGasMargin)
          .catch((err) => {
            console.error(`estimateGas failed`, methodName, args, err)
            return undefined
          }),
      ),
    )

    const indexOfSuccessfulEstimation = safeGasEstimates.findIndex((safeGasEstimate) =>
      BigNumber.isBigNumber(safeGasEstimate),
    )

    // all estimations failed...
    if (indexOfSuccessfulEstimation === -1) {
      console.error('This transaction would fail. Please contact support.')
    } else {
      const methodName = methodNames[indexOfSuccessfulEstimation]
      const safeGasEstimate = safeGasEstimates[indexOfSuccessfulEstimation]

      setAttemptingTxn(true)
      await router[methodName](...args, {
        gasLimit: safeGasEstimate,
      })
        .then((response: TransactionResponse) => {
          setAttemptingTxn(false)

          addTransaction(response, {
            summary: `Remove ${parsedAmounts[Field.CURRENCY_A]?.toSignificant(3)} ${currencyA?.getSymbol(
              chainId,
            )} and ${parsedAmounts[Field.CURRENCY_B]?.toSignificant(3)} ${currencyB?.getSymbol(chainId)}`,
          })

          setTxHash(response.hash)
          track({
            event: 'liquidity',
            chain: chainId,
            value: tradeValueUsd,
            data: {
              token1: currencyA?.getSymbol(chainId),
              token2: currencyB?.getSymbol(chainId),
              token1Amount: parsedAmounts[Field.CURRENCY_A]?.toSignificant(3),
              token2Amount: parsedAmounts[Field.CURRENCY_B]?.toSignificant(3),
              cat: 'remove',
            },
          })
        })
        .catch((err: Error) => {
          setAttemptingTxn(false)
          // we only care if the error is something _other_ than the user rejected the tx
          console.error(err)
        })
    }
  }

  const handleDismissConfirmation = useCallback(() => {
    // if there was a tx hash, we want to clear the input
    setTxHash('')
  }, [])

  const [onPresentAddLiquidityModal] = useModal(
    <RemoveLiquidityModal
      title={t('Confirm Remove Liquidity')}
      pair={pair}
      parsedAmounts={parsedAmounts}
      txHash={txHash}
      attemptingTxn={attemptingTxn}
      onDismiss={handleDismissConfirmation}
      onRemove={onRemove}
    />,
    true,
    true,
    'removeLiquidityModal',
  )

  const renderAction = () => {
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
    if ((approval === ApprovalState.NOT_APPROVED || approval === ApprovalState.PENDING) && !error) {
      return (
        <Flex sx={{ width: '100%' }}>
          <Button
            onClick={onAttemptToApprove}
            disabled={approval === ApprovalState.PENDING}
            load={approval === ApprovalState.PENDING}
            fullWidth
            sx={{ padding: '10px 2px' }}
          >
            {approval === ApprovalState.PENDING ? t('Enabling') : t('Enable')}
          </Button>
        </Flex>
      )
    }
    return (
      <Button
        fullWidth
        onClick={() => {
          if (expertMode) {
            onRemove()
          } else {
            onPresentAddLiquidityModal()
          }
        }}
      >
        {t('Remove Liquidity')}
      </Button>
    )
  }

  return <Flex sx={{ ...styles.dexActionsContainer }}>{renderAction()}</Flex>
}

export default React.memo(RemoveLiquidityActions)
