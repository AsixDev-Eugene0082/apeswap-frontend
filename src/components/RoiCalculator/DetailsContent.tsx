/** @jsxImportSource theme-ui */
import React, { useEffect, useState } from 'react'
import { Flex, Text, Box, Link } from 'theme-ui'
import { Button, Svg, useModal } from '@ape.swap/uikit'
import { DropDownIcon } from 'components/ListView/styles'
import { useTranslation } from 'contexts/Localization'
import { useBananaAddress, useGoldenBananaAddress } from 'hooks/useAddress'
import { Field, selectCurrency } from 'state/swap/actions'
import { useAppDispatch } from 'state'
import { FarmButton } from 'views/Farms/components/styles'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { DualFarm, Farm } from 'state/types'
import { tokenInfo, tokenListInfo } from './tokenInfo'
import styles from './styles'
import DualLiquidityModal from '../DualAddLiquidity/DualLiquidityModal'
import { selectOutputCurrency } from 'state/zap/actions'
import { ChainId } from '@ape.swap/sdk'

interface DetailsContentProps {
  onDismiss?: () => void
  label?: string
  rewardTokenName?: string
  rewardTokenPrice?: number
  apr?: number
  lpApr?: number
  apy?: number
  lpAddress?: string
  tokenAddress?: string
  quoteTokenAddress?: string
  isLp?: boolean
  farm?: Farm
  liquidityUrl?: string
  dualFarm?: DualFarm
}

const DetailsContent: React.FC<DetailsContentProps> = ({
  apr,
  lpApr,
  isLp,
  label,
  tokenAddress,
  quoteTokenAddress,
  apy,
  liquidityUrl,
  rewardTokenName,
  farm,
  dualFarm,
}) => {
  const [expanded, setExpanded] = useState(false)
  const [link, setLink] = useState('')
  const { chainId } = useActiveWeb3React()
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const banana = useBananaAddress()
  const gnana = useGoldenBananaAddress()

  const [onPresentDualLiquidityModal] = useModal(<DualLiquidityModal />, true, true, 'liquidityWidgetModal')

  useEffect(() => {
    if (!isLp) {
      if (tokenAddress?.toLowerCase() === banana.toLowerCase()) {
        setLink('swap')
      }
      if (tokenAddress?.toLowerCase() === gnana.toLowerCase()) {
        setLink('gnana')
      }
    }
  }, [chainId, tokenAddress, isLp, banana, gnana])

  const showLiquidity = (token?, quoteToken?) => {
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
    if (chainId === ChainId.BSC) {
      dispatch(
        selectOutputCurrency({
          currency1: farm?.tokenAddresses[chainId],
          currency2: farm?.quoteTokenAdresses[chainId],
        }),
      )
    }
    if (chainId === ChainId.MATIC) {
      dispatch(
        selectOutputCurrency({
          currency1: dualFarm.stakeTokens.token1.address[ChainId.MATIC],
          currency2: dualFarm.stakeTokens.token0.address[ChainId.MATIC],
        }),
      )
    }
    onPresentDualLiquidityModal()
  }

  return (
    <>
      <Flex
        sx={{ justifyContent: 'center', alignItems: 'center', columnGap: '10px', marginBottom: '15px' }}
        onClick={() => setExpanded((prev) => !prev)}
      >
        <Text
          sx={{
            fontWeight: 600,
            fontSize: '14px',
            '&:hover': {
              cursor: 'pointer',
            },
          }}
        >
          {t('Details')}
        </Text>
        <DropDownIcon width="10px" open={expanded} />
      </Flex>
      <Box sx={styles.detailContainer(!expanded)}>
        <Flex sx={styles.detailRow}>
          {isLp ? (
            <Text>{t('APR (incl. LP rewards)')}</Text>
          ) : (
            <Text>
              {t('APR')} - {rewardTokenName} {t('rewards')}
            </Text>
          )}
          <Text>{(apr + (lpApr || 0)).toFixed(2)}%</Text>
        </Flex>

        {isLp &&
          tokenInfo.map((item) => {
            return (
              <Flex key={item.value} sx={styles.detailRow}>
                <Text>{t(`${item.text}`)}</Text>
                <Text>{item.value === 'apr' ? apr.toFixed(2) : apy.toFixed(2)}%</Text>
              </Flex>
            )
          })}

        <ul>
          {tokenListInfo[isLp ? 'lpPair' : 'notLpPair']?.map((item) => (
            <li key={item}>
              <Text sx={styles?.text} dangerouslySetInnerHTML={{ __html: t(item) }} />
            </li>
          ))}
        </ul>

        <Flex sx={{ marginTop: '25px', justifyContent: 'center' }}>
          {isLp && !liquidityUrl && (
            <FarmButton onClick={() => showLiquidity(tokenAddress, quoteTokenAddress)}>
              {t('GET')} {label} <Svg icon="ZapIcon" />
            </FarmButton>
          )}
          {isLp && liquidityUrl && (
            <Link
              href={liquidityUrl}
              target="_blank"
              sx={{
                '&:hover': {
                  textDecoration: 'none',
                },
              }}
            >
              <Button style={{ fontSize: '16px' }}>
                {t('GET')} {label}
              </Button>
            </Link>
          )}
          {!isLp && (
            <Link
              href={link}
              target="_blank"
              sx={{
                '&:hover': {
                  textDecoration: 'none',
                },
              }}
            >
              <Button style={{ fontSize: '16px' }}>
                {t('GET')} {label} <Svg icon="ZapIcon" />
              </Button>
            </Link>
          )}
        </Flex>
      </Box>
    </>
  )
}
export default React.memo(DetailsContent)
