/** @jsxImportSource theme-ui */
import { Svg, Text, useModal } from '@ape.swap/uikit'
import BigNumber from 'bignumber.js'
import ListView from 'components/ListView'
import { ExtendedListViewProps } from 'components/ListView/types'
import ListViewContent from 'components/ListViewContent'
import { useLocation } from 'react-router-dom'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { Box } from 'theme-ui'
import useIsMobile from 'hooks/useIsMobile'
import { useAppDispatch } from 'state'
import { Field, selectCurrency } from 'state/swap/actions'
import React from 'react'
import { useTranslation } from 'contexts/Localization'
import { Vault } from 'state/types'
import { getBalanceNumber } from 'utils/formatBalance'
import { NextArrow } from 'views/Farms/components/styles'
import { Container, StyledButton, ActionContainer, StyledTag } from './styles'
import { vaultTokenDisplay } from '../helpers'
import Actions from './Actions'
import HarvestAction from './Actions/HarvestAction'
import InfoContent from './InfoContent'
import DualLiquidityModal from 'components/DualAddLiquidity/DualLiquidityModal'
import { selectOutputCurrency } from '../../../state/zap/actions'

const DisplayVaults: React.FC<{ vaults: Vault[]; openId?: number }> = ({ vaults, openId }) => {
  const { chainId } = useActiveWeb3React()
  const dispatch = useAppDispatch()
  const isMobile = useIsMobile()
  const { pathname } = useLocation()
  const isActive = !pathname.includes('history')
  const { t } = useTranslation()

  const [onPresentAddLiquidityWidgetModal] = useModal(<DualLiquidityModal />, true, true, 'dualLiquidityModal')

  const showLiquidity = (token, quoteToken, vault) => {
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
        currency1: vault.token.address[chainId],
        currency2: vault.quoteToken.address[chainId],
      }),
    )
    onPresentAddLiquidityWidgetModal()
  }

  const vaultsListView = vaults.map((vault) => {
    const totalDollarAmountStaked = Math.round(parseFloat(vault?.totalStaked) * vault?.stakeTokenPrice * 100) / 100
    const liquidityUrl = `https://apeswap.finance/swap/`
    const userAllowance = vault?.userData?.allowance
    const userEarnings = getBalanceNumber(new BigNumber(vault?.userData?.pendingRewards) || new BigNumber(0))
    const userEarningsUsd = `$${(
      (getBalanceNumber(new BigNumber(vault?.userData?.pendingRewards)) || 0) * vault.rewardTokenPrice
    ).toFixed(2)}`
    const userTokenBalance = (getBalanceNumber(new BigNumber(vault?.userData?.tokenBalance)) || 0).toFixed(4)
    const userTokenBalanceUsd = `$${(parseFloat(userTokenBalance || '0') * vault?.stakeTokenPrice).toFixed(2)}`
    const userStakedBalance = getBalanceNumber(new BigNumber(vault?.userData?.stakedBalance))
    const userStakedBalanceUsd = `$${((userStakedBalance || 0) * vault?.stakeTokenPrice).toFixed(2)}`

    const { tokenDisplay, stakeLp, earnLp } = vaultTokenDisplay(vault.stakeToken, vault.rewardToken)

    return {
      tokens: tokenDisplay,
      alignServiceTokens: true,
      stakeLp,
      earnLp,
      tag: (
        <Box sx={{ marginRight: '5px', mt: '1px' }}>
          <StyledTag key={vault?.id} variant={vault.type === 'AUTO' ? 'error' : 'success'}>
            {t(vault?.type)}
          </StyledTag>
        </Box>
      ),
      title: <Text style={{ fontSize: isMobile ? '14px' : '16px' }}>{vault.stakeToken.symbol}</Text>,
      titleContainerWidth: 400,
      id: vault.id,
      infoContent: <InfoContent vault={vault} />,
      infoContentPosition: 'translate(8%, 0%)',
      ttWidth: '250px',
      toolTipIconWidth: isMobile && '20px',
      toolTipStyle: isMobile && { marginTop: '10px', marginRight: '10px' },
      expandedContentJustified: vault.version === 'V1' && 'center',
      open: openId === vault.id,
      cardContent: (
        <>
          <ListViewContent
            title={t('Daily APY')}
            value={`${isActive ? vault?.apy?.daily?.toFixed(2) : '0.00'}%`}
            width={isMobile ? 90 : 140}
            toolTip={t(
              'Daily APY includes BANANA rewards (calculated based on token value, reward rate, and percentage of vault owned) and DEX swap fees, compounded daily.',
            )}
            toolTipPlacement="bottomLeft"
            toolTipTransform="translate(25%, 0%)"
            height={50}
          />
          <ListViewContent
            title={t('Yearly APY')}
            value={`${isActive ? vault?.apy?.yearly?.toFixed(2) : '0.00'}%`}
            width={isMobile ? 95 : 155}
            toolTip={t(
              'Annual APY includes annualized BANANA rewards (calculated based on token value, reward rate, and percentage of vault owned) and DEX swap fees, compounded daily.',
            )}
            toolTipPlacement="bottomLeft"
            toolTipTransform="translate(28%, 0%)"
            height={50}
          />
          <ListViewContent
            title={t('Total Staked')}
            value={`$${totalDollarAmountStaked.toLocaleString(undefined)}`}
            width={isMobile ? 100 : 170}
            toolTip={t('The total value of the tokens currently staked in this vault.')}
            toolTipPlacement="bottomRight"
            toolTipTransform="translate(13%, 0%)"
            height={50}
          />
          <ListViewContent
            title={vault.version === 'V1' ? t('Staked') : t('Earned')}
            value={vault.version === 'V1' ? userStakedBalanceUsd : userEarningsUsd}
            width={isMobile ? 50 : 115}
            height={50}
          />
        </>
      ),
      expandedContent: (
        <>
          <ActionContainer>
            {isMobile && (
              <ListViewContent
                title={t('Available %stakeTokenSymbol%', {
                  stakeTokenSymbol: vault.stakeToken.lpToken ? 'LP' : vault?.stakeToken?.symbol,
                })}
                value={userTokenBalance}
                value2={userTokenBalanceUsd}
                value2Secondary
                width={190}
                height={50}
                lineHeight={15}
                ml={10}
              />
            )}
            {vault.stakeToken?.lpToken ? (
              <StyledButton
                sx={{ width: '150px' }}
                onClick={() =>
                  showLiquidity(
                    vault.token.symbol === 'BNB' ? 'ETH' : vault.token.address[chainId],
                    vault.quoteToken.symbol === 'BNB' ? 'ETH' : vault.quoteToken.address[chainId],
                    vault,
                  )
                }
              >
                {t('GET LP')} <Svg icon="ZapIcon" color="primaryBright" />
              </StyledButton>
            ) : (
              <a href={liquidityUrl} target="_blank" rel="noopener noreferrer">
                <StyledButton sx={{ width: '150px' }}>GET {vault?.stakeToken?.symbol}</StyledButton>
              </a>
            )}
            {!isMobile && (
              <ListViewContent
                title={t('Available %stakeTokenSymbol%', {
                  stakeTokenSymbol: vault.stakeToken.lpToken ? 'LP' : vault?.stakeToken?.symbol,
                })}
                value={userTokenBalance}
                value2={userTokenBalanceUsd}
                value2Secondary
                width={190}
                height={50}
                lineHeight={15}
                ml={10}
              />
            )}
          </ActionContainer>
          {vault.version === 'V1' ? !isMobile && <NextArrow ml="30px" mr="50px" /> : !isMobile && <NextArrow />}
          <Actions
            allowance={userAllowance?.toString()}
            stakedBalance={vault?.userData?.stakedBalance?.toString()}
            stakedTokenSymbol={vault?.stakeToken?.symbol}
            stakingTokenBalance={vault?.userData?.tokenBalance?.toString()}
            stakeTokenAddress={vault?.stakeToken?.address[chainId]}
            stakeTokenValueUsd={vault?.stakeTokenPrice}
            withdrawFee={vault?.withdrawFee}
            pid={vault.pid}
            vaultVersion={vault.version}
          />
          {vault.version === 'V2' && !isMobile && <NextArrow />}
          {vault.version === 'V2' && (
            <HarvestAction
              pid={vault?.pid}
              disabled={userEarnings <= 0}
              userEarnings={userEarnings}
              earnTokenSymbol={vault?.rewardToken?.symbol}
            />
          )}
        </>
      ),
    } as ExtendedListViewProps
  })
  return (
    <Container>
      <ListView listViews={vaultsListView} />
    </Container>
  )
}

export default React.memo(DisplayVaults)
