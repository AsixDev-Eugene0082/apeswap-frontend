import { Flex } from '@apeswapfinance/uikit'
import { BillsArrow } from 'components/Icons'
import React from 'react'
import { EarnIcon, TokenContainer, TokenWrapper } from './styles'

interface ServiceTokenDisplayProps {
  token1: string
  token2?: string
  token3?: string
  token4?: string
  stakeLp?: boolean
  earnLp?: boolean
  noEarnToken?: boolean
  iconFill?: string
  size?: number
  billArrow?: boolean
  dualEarn?: boolean
  tokensMargin?: number
}

const setUrls = (tokenSymbol: string) => {
  return [
    `https://raw.githubusercontent.com/ApeSwapFinance/apeswap-token-lists/main/assets/${tokenSymbol?.toUpperCase()}.svg`,
    `https://raw.githubusercontent.com/ApeSwapFinance/apeswap-token-lists/main/assets/${tokenSymbol?.toUpperCase()}.png`,
  ]
}

const ServiceTokenDisplay: React.FC<ServiceTokenDisplayProps> = ({
  token1,
  token2,
  token3,
  token4,
  iconFill,
  size,
  billArrow,
  stakeLp = false,
  earnLp = false,
  noEarnToken = false,
  dualEarn = false,
  tokensMargin,
}) => {
  const token1Urls = setUrls(token1)
  const token2Urls = token2 ? setUrls(token2) : []
  const token3Urls = token3 ? setUrls(token3) : []
  const token4Urls = token4 ? setUrls(token4) : []

  const LpToken = (
    <Flex alignItems="center">
      <TokenWrapper size={size} zIndex={5}>
        <TokenContainer zIndex={1} srcs={token1Urls} size={size} />
      </TokenWrapper>
      <TokenWrapper ml={-15} size={size}>
        <TokenContainer srcs={token2Urls} size={size} />
      </TokenWrapper>
    </Flex>
  )

  const StakeTokenEarnToken = (
    <Flex alignItems="center">
      <TokenWrapper>
        <TokenContainer srcs={token1Urls} size={size} />
      </TokenWrapper>
      <EarnIcon color={iconFill} />
      <TokenWrapper>
        <TokenContainer srcs={token2Urls} size={size} />
      </TokenWrapper>
    </Flex>
  )

  const StakeLpEarnToken = (
    <Flex alignItems="center">
      <TokenWrapper zIndex={5}>
        <TokenContainer srcs={token1Urls} size={size} />
      </TokenWrapper>
      <TokenWrapper ml={tokensMargin ? tokensMargin : -15}>
        <TokenContainer srcs={token2Urls} size={size} />
      </TokenWrapper>
      {billArrow ? <BillsArrow /> : <EarnIcon color={iconFill} />}
      <TokenWrapper>
        <TokenContainer srcs={token3Urls} size={size} />
      </TokenWrapper>
    </Flex>
  )
  const StakeLpEarnLp = (
    <Flex alignItems="center">
      <TokenContainer zIndex={1} srcs={token1Urls} size={size} />
      <TokenContainer ml={tokensMargin ? tokensMargin : -15} srcs={token2Urls} size={size} />
      <EarnIcon color={iconFill} />
      <TokenContainer zIndex={1} srcs={token3Urls} size={size} />
      {token4 !== undefined && <TokenContainer ml={-15} srcs={token4Urls} size={size} />}
    </Flex>
  )
  const DualEarn = (
    <Flex alignItems="center">
      <TokenWrapper zIndex={5}>
        <TokenContainer zIndex={1} srcs={token1Urls} size={size} />
      </TokenWrapper>
      <TokenWrapper ml={tokensMargin ? tokensMargin : -15} zIndex={1}>
        <TokenContainer srcs={token2Urls} size={size} />
      </TokenWrapper>
      <EarnIcon color={iconFill} />
      <TokenWrapper mt={-20} size={25}>
        <TokenContainer srcs={token3Urls} size={25} />
      </TokenWrapper>
      <TokenWrapper mt={18} size={25}>
        <TokenContainer srcs={token4Urls} size={25} />
      </TokenWrapper>
    </Flex>
  )
  const StakeTokenEarnLp = (
    <Flex alignItems="center">
      <TokenWrapper>
        <TokenContainer srcs={token1Urls} size={size} />
      </TokenWrapper>
      <EarnIcon color={iconFill} />
      <TokenWrapper zIndex={5}>
        <TokenContainer zIndex={1} srcs={token2Urls} size={size} />
      </TokenWrapper>
      <TokenWrapper ml={tokensMargin ? tokensMargin : -15}>
        <TokenContainer srcs={token3Urls} size={size} />
      </TokenWrapper>
    </Flex>
  )
  const displayToReturn = () => {
    if (stakeLp && earnLp) {
      return StakeLpEarnLp
    }
    if (noEarnToken) {
      return LpToken
    }
    if (token1 && !token2 && !token3 && !token4) {
      return (
        <Flex alignItems="center">
          <TokenWrapper size={size}>
            <TokenContainer srcs={token1Urls} size={size} />
          </TokenWrapper>
        </Flex>
      )
    }
    if (dualEarn) {
      return DualEarn
    }
    if (!stakeLp && !earnLp) {
      return StakeTokenEarnToken
    }
    if (stakeLp && !earnLp) {
      return StakeLpEarnToken
    }
    return StakeTokenEarnLp
  }

  return displayToReturn()
}

export default React.memo(ServiceTokenDisplay)
