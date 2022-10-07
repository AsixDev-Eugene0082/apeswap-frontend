/** @jsxImportSource theme-ui */
import React, { useCallback, useMemo, useState } from 'react'
import { Text } from '@apeswapfinance/uikit'
import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import { getFullDisplayBalance } from 'utils/formatBalance'
import useApproveTransaction from 'hooks/useApproveTransaction'
import { useGoldenBanana, useTreasury } from 'hooks/useContract'
import { useSellGoldenBanana } from 'hooks/useGoldenBanana'
import { useToast } from 'state/hooks'
import { useGoldenBananaAddress } from 'hooks/useAddress'
import useTokenBalance from 'hooks/useTokenBalance'

import TokenInput from 'components/TokenInput'
import { useTranslation } from 'contexts/Localization'

import { StyledCard, HeaderCard, Header, TokensDisplay, ContentCard, StyledButton, FlexSection } from './styles'
import { Flex } from 'theme-ui'
import UnlockButton from 'components/UnlockButton'
import useActiveWeb3React from 'hooks/useActiveWeb3React'

interface ReturnCardType {
  fromToken: string
  toToken: string
}

const ReturnCard: React.FC<ReturnCardType> = ({ fromToken, toToken }) => {
  const [val, setVal] = useState('')
  const [processing, setProcessing] = useState(false)
  const treasuryContract = useTreasury()
  const { toastSuccess } = useToast()
  const valBanana = parseFloat(val) * 0.98
  const { handleSell } = useSellGoldenBanana()
  const goldenBananaBalance = useTokenBalance(useGoldenBananaAddress())
  const goldenBananaContract = useGoldenBanana()
  const { t } = useTranslation()
  const { account } = useActiveWeb3React()

  const { isApproving, isApproved, handleApprove } = useApproveTransaction({
    onRequiresApproval: async (loadedAccount) => {
      try {
        const response = await goldenBananaContract.allowance(loadedAccount, treasuryContract.address)
        const currentAllowance = new BigNumber(response.toString())
        return currentAllowance.gt(0)
      } catch (error) {
        console.warn(error)
        return false
      }
    },
    onApprove: () => {
      return goldenBananaContract
        .approve(treasuryContract.address, ethers.constants.MaxUint256)
        .then((trx) => trx.wait())
    },
    onSuccess: async () => {
      toastSuccess(t('Approved!'))
    },
  })

  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(goldenBananaBalance)
  }, [goldenBananaBalance])

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setVal(e.currentTarget.value)
    },
    [setVal],
  )
  const sell = useCallback(async () => {
    try {
      setProcessing(true)
      await handleSell(val)
      setProcessing(false)
    } catch (e) {
      setProcessing(false)
      console.warn(e)
    }
  }, [handleSell, val])

  const disabled = processing || parseInt(val) > parseInt(fullBalance) || parseInt(val) === 0

  const handleSelectMax = useCallback(() => {
    setVal(fullBalance)
  }, [fullBalance, setVal])

  return (
    <StyledCard>
      <HeaderCard>
        <Header>{t('RETURN')}</Header>
        <TokensDisplay>
          {fromToken} &gt; {toToken}
        </TokensDisplay>
      </HeaderCard>

      <ContentCard>
        <TokenInput
          value={val}
          onSelectMax={handleSelectMax}
          onChange={handleChange}
          max={parseFloat(fullBalance).toFixed(2)}
          symbol={fromToken}
        />
        {!account ? (
          <Flex sx={{ margin: '15px 0 10px 0' }}>
            <UnlockButton table />
          </Flex>
        ) : isApproved ? (
          <StyledButton disabled={disabled} variant="primary" margin="10px" onClick={sell}>
            {t('RETURN')}
          </StyledButton>
        ) : (
          <StyledButton margin="10px" disabled={isApproving} onClick={handleApprove}>
            {t('APPROVE CONTRACT')}
          </StyledButton>
        )}

        <FlexSection flexDirection="column" alignItems="center" mb="10px">
          <Text fontSize="16px" fontWeight={700}>
            {t('OUTPUT')} {`${toToken} ${valBanana ? valBanana?.toFixed(3) : 0}`}
          </Text>
          <Text fontSize="12px" fontWeight={500}>
            *After 2% reflect fee
          </Text>
        </FlexSection>
      </ContentCard>
    </StyledCard>
  )
}

export default React.memo(ReturnCard)
