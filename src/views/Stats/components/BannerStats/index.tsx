import React from 'react'
import { Flex, Link, Skeleton, Svg, Text } from '@apeswapfinance/uikit'

import useIsMobile from 'hooks/useIsMobile'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useStats } from 'state/statsPage/hooks'
import { useTranslation } from 'contexts/Localization'
import { Pacoca } from 'views/Stats/styles'

import { Tooltip } from '../Tooltip'

import {
  Container,
  GridCardsContainer,
  Header,
  HeadingContainer,
  MobileCard,
  PacocaPortfolio,
  StyledHeading,
  TranslucidCard,
  CardLabel,
  TransparentGradient,
} from './style'
import CardValue from '../CardValue'

export const BannerStats = () => {
  const { account } = useActiveWeb3React()
  const { t } = useTranslation()
  const { stats, portfolioData, loading } = useStats()
  const isMobile = useIsMobile()

  const calculateTotalEarnings = () => {
    return portfolioData.reduce((acc, curr) => acc + curr.totalEarnings, 0)
  }

  const calculateTotalPortfolio = () => {
    const filteredPortfolio = portfolioData.filter((val) => val.type !== 'bills' && val.type !== 'iaos')
    return filteredPortfolio.reduce((acc, curr) => acc + curr.totalValue, 0)
  }

  const calculateTotalHoldings = () => {
    return calculateTotalPortfolio() + calculateTotalEarnings() + stats.analytics.assets.totalWalletHoldings
  }

  return (
    <Container>
      <Header>
        <HeadingContainer>
          {isMobile ? <TransparentGradient /> : null}
          <StyledHeading>
            <Text fontSize={isMobile ? '18px' : '22px'} fontWeight={500} marginTop="32px" marginBottom="-4px">
              {t('Total Holdings')}
            </Text>
            {!account ? (
              <CardValue fontSize={isMobile ? '44px' : '54px'} fontWeight={700} value={0} decimals={2} prefix="$" />
            ) : loading ? (
              <Skeleton width={isMobile ? '254px' : '324px'} height={isMobile ? 52 : 64} margin="8px 0" />
            ) : (
              <CardValue
                fontSize={isMobile ? '44px' : '54px'}
                fontWeight={700}
                value={calculateTotalHoldings()}
                decimals={2}
                prefix="$"
              />
            )}
            <PacocaPortfolio>
              <Link
                href="https://pacoca.io/"
                target="_blank"
                style={{ fontSize: '12px', opacity: 0.8, textDecoration: 'underline' }}
              >
                View full portfolio on
              </Link>
              <Pacoca />
            </PacocaPortfolio>
          </StyledHeading>
        </HeadingContainer>

        {isMobile ? (
          <></>
        ) : (
          <GridCardsContainer>
            <TranslucidCard>
              <CardLabel>{`BANANA ${t('Balance')}`}</CardLabel>
              <Flex alignItems="center" style={{ gap: '4px' }}>
                {!account ? (
                  <CardValue fontSize="22px" fontWeight={700} value={0} color="primaryBright" decimals={2} />
                ) : loading ? (
                  <Skeleton width="144px" height={32} />
                ) : (
                  <>
                    <CardValue
                      fontSize="22px"
                      fontWeight={700}
                      value={+stats.userHoldings.banana}
                      color="primaryBright"
                      decimals={2}
                    />
                    <Svg icon="banana_token" width={20} />
                  </>
                )}
              </Flex>
            </TranslucidCard>
            <TranslucidCard>
              <Flex alignItems="center" marginBottom="2px" style={{ gap: '6px' }}>
                <CardLabel>{t('Total Staked')}</CardLabel>
                <Tooltip content="The total USD value of tokens staked across all ApeSwap products from the connected wallet.">
                  <Svg icon="question" width={12} color="primaryBright" />
                </Tooltip>
              </Flex>
              {!account ? (
                <CardValue fontSize="22px" fontWeight={700} value={0} color="primaryBright" decimals={2} prefix="$" />
              ) : loading ? (
                <Skeleton width="144px" height={32} />
              ) : (
                <CardValue
                  fontSize="22px"
                  fontWeight={700}
                  value={+stats.analytics.tvl.total}
                  color="primaryBright"
                  decimals={2}
                  prefix="$"
                />
              )}
            </TranslucidCard>
            <TranslucidCard>
              <CardLabel>{t('Pending Rewards')}</CardLabel>
              {!account ? (
                <CardValue fontSize="22px" fontWeight={700} value={0} color="primaryBright" decimals={2} prefix="$" />
              ) : loading ? (
                <Skeleton width="144px" height={32} />
              ) : (
                <CardValue
                  fontSize="22px"
                  fontWeight={700}
                  value={calculateTotalEarnings()}
                  color="primaryBright"
                  decimals={2}
                  prefix="$"
                />
              )}
            </TranslucidCard>
          </GridCardsContainer>
        )}
      </Header>

      {isMobile ? (
        <MobileCard>
          <div>
            <Text>{`BANANA ${t('Balance')}`}</Text>
            {!account ? (
              <CardValue fontSize="16px" fontWeight={700} value={0} decimals={2} />
            ) : loading ? (
              <Skeleton width="144px" height={24} />
            ) : (
              <Flex alignItems="center" justifyContent="center" style={{ gap: '4px' }}>
                <CardValue
                  fontSize="16px !important"
                  fontWeight={700}
                  value={+stats.userHoldings.banana}
                  decimals={2}
                />
                <Svg icon="banana_token" width={20} />
              </Flex>
            )}
          </div>
          <div>
            <Text>{t('Total Staked')}</Text>
            {!account ? (
              <CardValue fontSize="16px" fontWeight={700} value={0} decimals={2} prefix="$" />
            ) : loading ? (
              <Skeleton width="144px" height={24} />
            ) : (
              <CardValue fontSize="16px" fontWeight={700} value={+stats.analytics.tvl.total} decimals={2} prefix="$" />
            )}
          </div>
          <div>
            <Text>{t('Pending Rewards')}</Text>
            {!account ? (
              <CardValue fontSize="16px" fontWeight={700} value={0} decimals={2} prefix="$" />
            ) : loading ? (
              <Skeleton width="144px" height={24} />
            ) : (
              <CardValue
                fontSize="16px"
                fontWeight={700}
                value={portfolioData.reduce((acc, curr) => acc + curr.totalEarnings, 0)}
                decimals={2}
                prefix="$"
              />
            )}
          </div>
        </MobileCard>
      ) : (
        <></>
      )}
    </Container>
  )
}
