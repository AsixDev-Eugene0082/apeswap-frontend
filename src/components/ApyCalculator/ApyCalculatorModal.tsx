/** @jsxImportSource theme-ui */
import React from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { Modal, Text, Flex, useModal } from '@apeswapfinance/uikit'
import { Text as StyledText } from '@ape.swap/uikit'

import { calculateBananaEarnedPerThousandDollars, apyModalRoi } from 'utils/compoundApyHelpers'
import { useTranslation } from 'contexts/Localization'
import { JungleFarm } from '../../state/types'
import { Field, selectCurrency } from '../../state/swap/actions'
import useActiveWeb3React from '../../hooks/useActiveWeb3React'
import { useAppDispatch } from '../../state'
import DualLiquidityModal from '../DualAddLiquidity/DualLiquidityModal'
import { selectOutputCurrency } from '../../state/zap/actions'

interface ApyCalculatorModalProps {
  onDismiss?: () => void
  rewardTokenName?: string
  rewardTokenPrice?: number
  apy?: number
  jungleFarm: JungleFarm
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(4, auto);
  margin-bottom: 24px;
`

const GridItem = styled.div`
  margin-bottom: 10px;
`

const Description = styled(Text)`
  max-width: 320px;
  margin-bottom: 28px;
`

const ApyCalculatorModal: React.FC<ApyCalculatorModalProps> = ({
  onDismiss,
  rewardTokenName,
  rewardTokenPrice,
  apy,
  jungleFarm,
}) => {
  const { chainId } = useActiveWeb3React()
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const farmApy = new BigNumber(apy).times(new BigNumber(100)).toNumber()
  const tokenPrice =
    typeof rewardTokenPrice === 'number' ? rewardTokenPrice : new BigNumber(rewardTokenPrice).toNumber()
  const oneThousandDollarsWorthOfBanana = 1000 / tokenPrice

  const bananaEarnedPerThousand1D = calculateBananaEarnedPerThousandDollars({
    numberOfDays: 1,
    farmApy,
    rewardTokenPrice,
  })
  const bananaEarnedPerThousand7D = calculateBananaEarnedPerThousandDollars({
    numberOfDays: 7,
    farmApy,
    rewardTokenPrice,
  })
  const bananaEarnedPerThousand30D = calculateBananaEarnedPerThousandDollars({
    numberOfDays: 30,
    farmApy,
    rewardTokenPrice,
  })
  const bananaEarnedPerThousand365D = calculateBananaEarnedPerThousandDollars({
    numberOfDays: 365,
    farmApy,
    rewardTokenPrice,
  })

  const [onPresentAddLiquidityWidgetModal] = useModal(<DualLiquidityModal />, true, true, 'dualLiquidityModal')

  const showLiquidity = (token, quoteToken, farm) => {
    dispatch(
      selectCurrency({
        field: Field.INPUT,
        currencyId: token,
      }),
    )
    dispatch(
      selectCurrency({
        field: Field.OUTPUT,
        currencyId: quoteToken,
      }),
    )
    dispatch(
      selectOutputCurrency({
        currency1: farm.lpTokens.token.address[chainId],
        currency2: farm.lpTokens.quoteToken.address[chainId],
      }),
    )
    onPresentAddLiquidityWidgetModal()
  }

  return (
    <Modal onDismiss={onDismiss} title={t('CURRENT RATES')}>
      <Grid>
        <GridItem>
          <Text fontSize="12px" color="gray" textTransform="uppercase" mb="20px">
            {t('Timeframe')}
          </Text>
        </GridItem>
        <GridItem>
          <Text fontSize="12px" color="gray" textTransform="uppercase" mb="20px">
            {t('Return')}
          </Text>
        </GridItem>
        <GridItem>
          <Text fontSize="12px" color="gray" textTransform="uppercase" mb="20px">
            {rewardTokenName}
            {t(' per $1000')}
          </Text>
        </GridItem>
        {/* 1 day row */}
        <GridItem>
          <Text>{t('1d')}</Text>
        </GridItem>
        <GridItem>
          <Text>
            {apyModalRoi({ amountEarned: bananaEarnedPerThousand1D, amountInvested: oneThousandDollarsWorthOfBanana })}%
          </Text>
        </GridItem>
        <GridItem>
          <Text>{bananaEarnedPerThousand1D}</Text>
        </GridItem>
        {/* 7 day row */}
        <GridItem>
          <Text>{t('7d')}</Text>
        </GridItem>
        <GridItem>
          <Text>
            {apyModalRoi({ amountEarned: bananaEarnedPerThousand7D, amountInvested: oneThousandDollarsWorthOfBanana })}%
          </Text>
        </GridItem>
        <GridItem>
          <Text>{bananaEarnedPerThousand7D}</Text>
        </GridItem>
        {/* 30 day row */}
        <GridItem>
          <Text>{t('30d')}</Text>
        </GridItem>
        <GridItem>
          <Text>
            {apyModalRoi({ amountEarned: bananaEarnedPerThousand30D, amountInvested: oneThousandDollarsWorthOfBanana })}
            %
          </Text>
        </GridItem>
        <GridItem>
          <Text>{bananaEarnedPerThousand30D}</Text>
        </GridItem>
        {/* 365 day / APY row */}
        <GridItem>
          <Text>{`${t('365d')}${t('')}`}</Text>
        </GridItem>
        <GridItem>
          <Text>
            {apyModalRoi({
              amountEarned: bananaEarnedPerThousand365D,
              amountInvested: oneThousandDollarsWorthOfBanana,
            })}
            %
          </Text>
        </GridItem>
        <GridItem>
          <Text>{bananaEarnedPerThousand365D}</Text>
        </GridItem>
      </Grid>
      <Description fontSize="12px" color="gray">
        {t(
          'Returns are calculated based on current rates, assuming daily compounding. Estimated returns are not guaranteed and are provided for convenience only.',
        )}
      </Description>
      <Flex justifyContent="center">
        <StyledText
          onClick={() =>
            showLiquidity(
              jungleFarm.lpTokens.token.address[chainId],
              jungleFarm.lpTokens.quoteToken.symbol === 'BNB' ? 'ETH' : jungleFarm.lpTokens.quoteToken.address[chainId],
              jungleFarm,
            )
          }
          sx={{ '&:hover': { textDecoration: 'underline', cursor: 'pointer' } }}
        >
          {t('GET LP')}
        </StyledText>
      </Flex>
    </Modal>
  )
}

export default ApyCalculatorModal
