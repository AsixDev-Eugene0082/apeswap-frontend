/** @jsxImportSource theme-ui */
import React from 'react'
import { IconButton, Text, Flex, TagVariants, Button } from '@ape.swap/uikit'
import { Box } from 'theme-ui'
import BigNumber from 'bignumber.js'
import ListView from 'components/ListView'
import { ExtendedListViewProps } from 'components/ListView/types'
import ListViewContent from 'components/ListViewContent'
import { BASE_ADD_LIQUIDITY_URL } from 'config'
import { useLocation, useHistory } from 'react-router-dom'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import CalcButton from 'components/RoiCalculator/CalcButton'
import useIsMobile from 'hooks/useIsMobile'
import { Pool, Tag } from 'state/types'
import { getBalanceNumber } from 'utils/formatBalance'
import { NextArrow } from 'views/Farms/components/styles'
import { useTranslation } from 'contexts/Localization'
import Actions from './Actions'
import HarvestAction from './Actions/HarvestAction'
import InfoContent from '../InfoContent'
import { StyledTag, poolStyles } from './styles'

const DisplayPools: React.FC<{ pools: Pool[]; openId?: number; poolTags: Tag[] }> = ({ pools, openId, poolTags }) => {
  const { chainId } = useActiveWeb3React()
  const isMobile = useIsMobile()
  const { pathname } = useLocation()
  const { t } = useTranslation()
  const isActive = !pathname.includes('history')
  const history = useHistory()

  const poolsListView = pools.map((pool) => {
    const token1 = pool?.stakingToken?.symbol
    const token2 = pool?.rewardToken?.symbol
    const totalDollarAmountStaked = Math.round(getBalanceNumber(pool?.totalStaked) * pool?.stakingToken?.price)
    const liquidityUrl = !pool?.lpStaking
      ? pool?.stakingToken?.symbol === 'GNANA'
        ? 'https://apeswap.finance/gnana'
        : `https://apeswap.finance/swap?outputCurrency=${pool?.stakingToken?.address[chainId]}`
      : `${BASE_ADD_LIQUIDITY_URL}/${pool?.lpTokens?.token?.address[chainId]}/${pool?.lpTokens?.quoteToken?.address[chainId]}`
    const userAllowance = pool?.userData?.allowance
    const userEarnings = getBalanceNumber(
      pool?.userData?.pendingReward || new BigNumber(0),
      pool?.rewardToken?.decimals,
    )
    const userEarningsUsd = `$${(userEarnings * pool.rewardToken?.price).toFixed(2)}`
    const userTokenBalance = `${getBalanceNumber(pool?.userData?.stakingTokenBalance || new BigNumber(0))?.toFixed(6)}`
    const userTokenBalanceUsd = `$${(
      getBalanceNumber(pool?.userData?.stakingTokenBalance || new BigNumber(0)) * pool?.stakingToken?.price
    ).toFixed(2)}`

    const pTag = poolTags?.find((tag) => tag.pid === pool.sousId)
    const tagColor = pTag?.color as TagVariants

    const openLiquidityUrl = () =>
      pool?.stakingToken?.symbol === 'GNANA'
        ? history.push({ search: '?modal=gnana' })
        : window.open(liquidityUrl, '_blank')

    // Token symbol logic is here temporarily for nfty
    return {
      tag: (
        <>
          {pTag?.pid === pool.sousId && (
            <Box sx={{ marginRight: '5px', mt: '1px' }}>
              <StyledTag key={pTag?.pid} variant={tagColor}>
                {pTag?.text}
              </StyledTag>
            </Box>
          )}
        </>
      ),
      tokens: { token1, token2: token2 === 'NFTY ' ? 'NFTY2' : token2 || pool?.tokenName },
      title: <Text bold>{pool?.rewardToken?.symbol || pool?.tokenName}</Text>,
      id: pool.sousId,
      infoContent: <InfoContent pool={pool} />,
      infoContentPosition: 'translate(8%, 0%)',
      ttWidth: '250px',
      toolTipIconWidth: isMobile && '20px',
      toolTipStyle: isMobile && { marginTop: '5px', marginRight: '10px' },
      open: openId === pool.sousId,
      cardContent: (
        <>
          <Flex sx={{ width: '90px', height: '100%', alignItems: 'center', justifyContent: 'space-between' }}>
            {!isMobile && (
              <>
                <a href={pool.projectLink} target="_blank" rel="noreferrer">
                  <IconButton icon="website" color="primaryBright" width={20} style={{ padding: '8.5px 10px' }} />
                </a>
                <a href={pool?.twitter} target="_blank" rel="noreferrer">
                  <IconButton icon="twitter" color="primaryBright" width={20} />
                </a>
              </>
            )}
          </Flex>
          <ListViewContent
            title={t('APR')}
            value={`${isActive ? pool?.apr?.toFixed(2) : '0.00'}%`}
            width={isMobile ? 95 : 80}
            height={50}
            toolTip={t('APRs are calculated based on current value of the token, reward rate, and share of pool.')}
            toolTipPlacement="bottomLeft"
            toolTipTransform="translate(10%, 0%)"
            aprCalculator={
              <CalcButton
                label={pool?.stakingToken?.symbol}
                rewardTokenName={pool?.rewardToken?.symbol}
                rewardTokenPrice={pool?.rewardToken?.price}
                apr={pool?.apr}
                tokenAddress={pool.stakingToken.address[chainId]}
              />
            }
          />
          <ListViewContent
            title={t('Total Staked')}
            value={`$${totalDollarAmountStaked.toLocaleString(undefined)}`}
            width={isMobile ? 160 : 110}
            height={50}
            toolTip={t('The total value of the tokens currently staked in this pool.')}
            toolTipPlacement="bottomRight"
            toolTipTransform="translate(13%, 0%)"
          />
          <ListViewContent title={t('Earned')} value={userEarningsUsd} height={50} width={isMobile ? 80 : 150} />
        </>
      ),
      expandedContent: (
        <>
          <Flex sx={poolStyles.actionContainer}>
            {isMobile && (
              <ListViewContent
                title={`${t('Available')} ${pool?.stakingToken?.symbol}`}
                value={userTokenBalance}
                value2={userTokenBalanceUsd}
                value2Secondary
                width={190}
                height={50}
                lineHeight={15}
                ml={10}
              />
            )}
            <Button variant="primary" sx={poolStyles.styledBtn} onClick={openLiquidityUrl}>
              {t('GET')} {pool?.stakingToken?.symbol}
            </Button>
            {!isMobile && (
              <ListViewContent
                title={`${t('Available')} ${pool?.stakingToken?.symbol}`}
                value={userTokenBalance}
                value2={userTokenBalanceUsd}
                value2Secondary
                width={190}
                height={50}
                lineHeight={15}
                ml={10}
              />
            )}
          </Flex>
          {!isMobile && <NextArrow />}
          <Actions
            allowance={userAllowance?.toString()}
            stakedBalance={pool?.userData?.stakedBalance?.toString()}
            stakedTokenSymbol={pool?.stakingToken?.symbol}
            stakingTokenBalance={pool?.userData?.stakingTokenBalance?.toString()}
            stakeTokenAddress={pool?.stakingToken?.address[chainId]}
            stakeTokenValueUsd={pool?.stakingToken?.price}
            earnTokenSymbol={pool?.rewardToken?.symbol || pool?.tokenName}
            sousId={pool?.sousId}
          />
          {!isMobile && <NextArrow />}
          <HarvestAction
            sousId={pool?.sousId}
            disabled={userEarnings <= 0}
            userEarnings={userEarnings}
            earnTokenSymbol={pool?.rewardToken?.symbol || pool?.tokenName}
          />
        </>
      ),
    } as ExtendedListViewProps
  })
  return (
    <Flex sx={poolStyles.container}>
      <ListView listViews={poolsListView} />
    </Flex>
  )
}

export default React.memo(DisplayPools)
