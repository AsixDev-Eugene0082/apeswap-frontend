import React, { useState } from 'react'
import { Flex, Text } from '@apeswapfinance/uikit'

import useIsMobile from 'hooks/useIsMobile'
import getTimePeriods from 'utils/getTimePeriods'

import { Position } from 'state/statsPage/types'
import { PortfolioData } from 'state/statsPage/mappings'

import { ProductCardHeader } from './ProductCardHeader'
import ProductChainList from './ProductChainList'
import CardValue from '../../../CardValue'

import { CardInfo, Content, LargeDiv, MediumDiv, TableHeader } from '../../styles'
import { useStats } from 'state/statsPage/hooks'

interface ProductCardProps {
  productData: PortfolioData
}

const ProductCard: React.FC<ProductCardProps> = ({ productData }) => {
  const isMobile = useIsMobile()
  const {
    stats: { bananaPrice },
  } = useStats()
  const [isOpen, setIsOpen] = useState(true)

  const toogle = () => {
    setIsOpen(!isOpen)
  }

  const isBillsOrIAOs = productData.type === 'bills' || productData.type === 'iaos'

  const displayFirstLabel = (type: string) => {
    if (type === 'farms' || type === 'jungleFarms') return 'Liquidity Pool'

    if (type === 'pools' || type === 'lending' || type === 'iaos') return 'Token'

    if (type === 'maximizers') return 'Vault'

    if (type === 'bills') return 'Bill'

    return ''
  }

  const displaySecondLabel = (type: string) => {
    if (type === 'lending') return 'Supplied'

    if (isBillsOrIAOs) return 'Fully Vested'

    return 'Balance'
  }

  const displayLabels = (productType: string) => {
    return (
      <>
        <Text>{displayFirstLabel(productType)}</Text>
        <Flex
          justifyContent="space-between"
          style={{ width: '100%', marginLeft: `${productType === 'lending' ? '-64px' : 0}` }}
        >
          <Text style={{ maxWidth: '150px', width: '100%' }}>{displaySecondLabel(productType)}</Text>
          {productType === 'lending' ? <Text style={{ maxWidth: '150px', width: '100%' }}>Borrowed</Text> : null}
          {productType === 'lending' ? (
            <>
              <Text style={{ maxWidth: '100px', width: '100%' }}>Supply APY</Text>
              <Text style={{ maxWidth: '100px', width: '100%' }}>Borrow APY</Text>
            </>
          ) : isBillsOrIAOs ? null : (
            <Text style={{ maxWidth: '80px', width: '100%' }}>{productType === 'maximizers' ? 'APY' : 'APR'}</Text>
          )}
          {productType === 'lending' ? null : (
            <Text style={{ maxWidth: '150px', width: '100%' }}>{isBillsOrIAOs ? 'Claimable' : 'Reward'}</Text>
          )}
          <Text
            style={{
              textAlign: 'end',
              width: '100%',
              maxWidth: isBillsOrIAOs ? '150px' : '110px',
            }}
          >
            {isBillsOrIAOs ? 'Pending' : 'Value'}
          </Text>
        </Flex>
      </>
    )
  }

  const displayBalanceSection = (position: Position) => {
    if (isMobile)
      return (
        <div>
          <Text fontSize="12px" style={{ opacity: 0.5 }}>
            {productData.type === 'lending' ? 'Supplied' : 'Balance'}
          </Text>
          <CardValue
            value={productData.type === 'lending' ? position.supplyBalance : position.balance}
            fontSize="14px"
            fontWeight={700}
            suffix={position.isLp ? 'LP' : position.tokens.token1}
          />
        </div>
      )

    if (productData.type === 'lending')
      return (
        <LargeDiv style={{ marginLeft: '-64px' }}>
          <CardValue fontSize="16px" fontWeight={700} value={position.supplyBalance} suffix={position.tokens.token1} />
          <CardValue fontSize="12px" fontWeight={500} value={position.value} prefix="$" />
        </LargeDiv>
      )

    return (
      <LargeDiv>
        <CardValue
          fontSize="16px"
          fontWeight={700}
          value={position.balance}
          suffix={position.isLp ? 'LP' : position.tokens.token1}
        />
        <CardValue fontSize="12px" fontWeight={500} value={position.value} prefix="$" />
      </LargeDiv>
    )
  }

  const displayVestingRemainingSection = (position: Position) => {
    const timeUntilEnd = getTimePeriods(position.vestingTimeRemaining, true)

    if (isMobile)
      return (
        <>
          <div>
            <Text fontSize="12px" style={{ opacity: 0.5 }}>
              Fully Vested
            </Text>
            <Text fontSize="14px" fontWeight={700}>
              {timeUntilEnd.days}d {timeUntilEnd.hours}h {timeUntilEnd.minutes}m
            </Text>
          </div>
          <div>
            <Text fontSize="12px" style={{ opacity: 0.5 }}>
              Total Payout
            </Text>
            <CardValue
              fontSize="14px"
              fontWeight={700}
              value={position.totalPayout}
              suffix={position.rewardToken.symbol}
            />
          </div>
        </>
      )

    return (
      <LargeDiv>
        <Text fontWeight={700}>
          {timeUntilEnd.days}d {timeUntilEnd.hours}h {timeUntilEnd.minutes}m
        </Text>
        <CardValue fontSize="12px" fontWeight={500} value={position.totalPayout} suffix={position.rewardToken.symbol} />
      </LargeDiv>
    )
  }

  const displayBorrowedSection = (position: Position) => {
    if (isMobile)
      return (
        <div>
          <Text fontSize="12px" style={{ opacity: 0.5 }}>
            Borrowed
          </Text>
          <CardValue
            value={position.borrowBalance}
            fontSize="14px"
            fontWeight={700}
            suffix={position.stakedToken.symbol}
          />
        </div>
      )

    return (
      <LargeDiv>
        <CardValue
          fontSize="16px"
          fontWeight={700}
          value={position.borrowBalance}
          suffix={position.stakedToken.symbol}
        />
        <CardValue
          fontSize="12px"
          fontWeight={500}
          value={position.borrowBalance * position.stakedToken.price}
          prefix="$"
        />
      </LargeDiv>
    )
  }

  const displayAprSection = (position: Position) => {
    if (isMobile)
      return productData.type === 'lending' ? (
        <>
          <div>
            <Text fontSize="12px" style={{ opacity: 0.5 }}>
              Supply APY
            </Text>
            <Text fontSize="14px" fontWeight={700}>
              {position.supplyApy}%
            </Text>
          </div>
          <div>
            <Text fontSize="12px" style={{ opacity: 0.5 }}>
              Borrow APY
            </Text>
            <Text fontSize="14px" fontWeight={700}>
              {position.borrowApy}%
            </Text>
          </div>
        </>
      ) : (
        <div>
          <Text fontSize="12px" style={{ opacity: 0.5 }}>
            {productData.type === 'maximizers' ? 'APY' : 'APR'}
          </Text>
          <Text fontSize="14px" fontWeight={700}>
            {position.apr}%
          </Text>
        </div>
      )

    if (productData.type === 'lending')
      return (
        <>
          <Text fontWeight={700} style={{ maxWidth: '100px', width: '100%' }}>
            {position.supplyApy}%
          </Text>
          <Text fontWeight={700} style={{ maxWidth: '100px', width: '100%' }}>
            {position.borrowApy}%
          </Text>
        </>
      )

    return (
      <Text fontWeight={700} style={{ maxWidth: '80px', width: '100%' }}>
        {position.apr}%
      </Text>
    )
  }

  const displayRewardSection = (position: Position) => {
    if (productData.type === 'lending') return <></>

    if (isMobile)
      return (
        <div>
          <Text fontSize="12px" style={{ opacity: 0.5 }}>
            {isBillsOrIAOs ? 'Claimable' : 'Reward'}
          </Text>
          {position.isAuto ? (
            <Text fontSize="14px" fontWeight={700}>
              AUTO
            </Text>
          ) : (
            <CardValue
              value={position.rewardBalance}
              fontSize="14px"
              fontWeight={700}
              suffix={position.rewardToken ? position.rewardToken.symbol : 'BANANA'}
            />
          )}
          {position.secondaryRewardBalance ? (
            <CardValue
              fontSize="14px"
              fontWeight={700}
              value={position.secondaryRewardBalance}
              suffix={position.tokens.token4}
              prefix="+"
            />
          ) : null}
        </div>
      )

    return (
      <LargeDiv>
        {position.isAuto ? (
          <Text fontSize="16px" fontWeight={700}>
            AUTO
          </Text>
        ) : (
          <>
            <CardValue
              fontSize="16px"
              fontWeight={700}
              value={position.rewardBalance}
              suffix={position.rewardToken ? position.rewardToken.symbol.toUpperCase() : 'BANANA'}
            />
            {position.secondaryRewardBalance ? (
              <CardValue
                fontSize="14px"
                fontWeight={700}
                value={position.secondaryRewardBalance}
                suffix={position.tokens.token4}
                prefix="+"
              />
            ) : null}
            <CardValue
              fontSize="12px"
              fontWeight={500}
              value={
                position.rewardToken
                  ? position.rewardBalance * position.rewardToken.price
                  : position.secondaryRewardValue
                  ? position.rewardBalance * bananaPrice + position.secondaryRewardValue
                  : position.rewardBalance * bananaPrice
              }
              prefix="$"
            />
          </>
        )}
      </LargeDiv>
    )
  }

  const displayValueSection = (position: Position) => {
    if (isMobile)
      return isBillsOrIAOs ? (
        <div>
          <Text fontSize="12px" style={{ opacity: 0.5 }}>
            Pending
          </Text>
          {position.pendingVesting > 0 && position.vestingTimeRemaining > 0 ? (
            <CardValue
              value={position.pendingVesting}
              fontSize="14px"
              fontWeight={700}
              suffix={position.rewardToken.symbol}
            />
          ) : (
            <Text fontSize="14px" fontWeight={700}>
              Fully Vested
            </Text>
          )}
        </div>
      ) : (
        <div>
          <Text fontSize="12px" style={{ opacity: 0.5 }}>
            Value
          </Text>
          <CardValue value={position.value} fontSize="14px" fontWeight={700} prefix="$" />
        </div>
      )

    if (isBillsOrIAOs)
      return (
        <LargeDiv style={{ textAlign: 'end' }}>
          {position.pendingVesting > 0 && position.vestingTimeRemaining > 0 ? (
            <>
              <CardValue
                fontSize="16px"
                fontWeight={700}
                value={position.pendingVesting}
                suffix={position.rewardToken.symbol}
              />
              <CardValue
                fontSize="12px"
                fontWeight={500}
                value={position.pendingVesting * position.rewardToken.price}
                prefix="$"
              />
            </>
          ) : (
            <Text fontWeight={700}>Fully Vested</Text>
          )}
        </LargeDiv>
      )

    return (
      <MediumDiv style={{ textAlign: 'end' }}>
        <CardValue fontSize="16px" fontWeight={700} value={position.value} prefix="$" />
      </MediumDiv>
    )
  }

  return (
    <CardInfo>
      <ProductCardHeader
        onClick={toogle}
        isOpen={isOpen}
        type={productData.type}
        totalValue={productData.totalValue}
        totalEarnings={productData.totalEarnings}
      />
      <Content isOpen={isOpen}>
        {isMobile ? null : <TableHeader>{displayLabels(productData.type)}</TableHeader>}
        <div style={{ width: '100%', marginTop: '10px', borderRadius: '10px', overflow: 'hidden' }}>
          {Object.entries(productData.chainData).map(([chain, products], index) => (
            <ProductChainList
              key={index}
              chain={chain}
              listViews={products
                .sort((a, b) =>
                  isBillsOrIAOs
                    ? a.vestingTimeRemaining > b.vestingTimeRemaining
                      ? -1
                      : 1
                    : a.value > b.value
                    ? -1
                    : 1,
                )
                .map((position) => {
                  return {
                    id: position.id,
                    title: (
                      <Text fontWeight={700} fontSize={isMobile ? '12px' : '16px'}>
                        {position.title}
                      </Text>
                    ),
                    tokens: position.tokens,
                    stakeLp: position.isLp ? true : null,
                    earnLp: position.tokens.token4 ? true : null,
                    billArrow: isBillsOrIAOs,
                    cardContent: isMobile ? null : (
                      <>
                        {isBillsOrIAOs ? displayVestingRemainingSection(position) : displayBalanceSection(position)}
                        {productData.type === 'lending' ? displayBorrowedSection(position) : null}
                        {isBillsOrIAOs ? null : displayAprSection(position)}
                        {displayRewardSection(position)}
                        {displayValueSection(position)}
                      </>
                    ),
                    expandedContent: (
                      <Flex flexDirection="column" padding="16px" style={{ gap: '16px', width: '100%' }}>
                        {isBillsOrIAOs ? displayVestingRemainingSection(position) : displayBalanceSection(position)}
                        {productData.type === 'lending' ? displayBorrowedSection(position) : null}
                        {isBillsOrIAOs ? null : displayAprSection(position)}
                        {displayRewardSection(position)}
                        {displayValueSection(position)}
                      </Flex>
                    ),
                  }
                })}
            />
          ))}
        </div>
      </Content>
    </CardInfo>
  )
}

export default React.memo(ProductCard)
