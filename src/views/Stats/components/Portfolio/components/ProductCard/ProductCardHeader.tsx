import React from 'react'
import { Flex, LinkExternal, Text } from '@apeswapfinance/uikit'
import { ProductType } from 'state/statsPage/mappings'
import { useTranslation } from 'contexts/Localization'
import useIsMobile from 'hooks/useIsMobile'
import CardValue from '../../../CardValue'
import { AnimatedArrow, StyledDiv, StyledText } from '../../styles'

interface ProductCardHeaderProps {
  isOpen: boolean
  type: ProductType
  totalValue: number
  totalEarnings: number
  onClick: () => void
}

export const ProductCardHeader: React.FC<ProductCardHeaderProps> = ({
  isOpen,
  onClick,
  type,
  totalValue,
  totalEarnings,
}) => {
  const { t } = useTranslation()
  const isMobile = useIsMobile()

  const displayTitle = (type: ProductType) => {
    switch (type) {
      case 'farms':
        return 'BANANA Farms'

      case 'pools':
        return 'Staking Pools'

      case 'maximizers':
        return 'BANANA Maximizers'

      case 'lending':
        return 'Lending Network'

      case 'bills':
        return 'Treasury Bills'

      case 'jungleFarms':
        return 'Jungle Farms'

      case 'iaos':
        return 'Initial Ape Offerings'

      case 'vaults':
        return 'Vaults'

      default:
        return ''
    }
  }

  // Should use this directly in Portfolio Data?
  const productLink = {
    farms: 'banana-farms',
    pools: 'pools',
    maximizers: 'maximizers',
    jungleFarms: 'jungle-farms',
    bills: 'treasury-bills',
    iaos: 'iao',
  }

  return (
    <StyledDiv>
      <Flex alignItems="center" justifyContent="space-between">
        <LinkExternal
          href={type === 'lending' ? 'https://lending.apeswap.finance' : `https://apeswap.finance/${productLink[type]}`}
        >
          <Text fontSize={isMobile ? '14px' : '22px'} bold>
            {displayTitle(type)}
          </Text>
        </LinkExternal>
        <Flex alignItems="center">
          {!['bills', 'iaos'].includes(type) ? (
            <CardValue fontSize={isMobile ? '14px' : '22px'} fontWeight={700} value={totalValue} prefix="$" />
          ) : (
            <CardValue fontSize={isMobile ? '14px' : '22px'} fontWeight={700} value={totalEarnings} prefix="$" />
          )}
          <AnimatedArrow height={isMobile ? 8 : 12} marginLeft={isMobile ? 15 : 20} isOpen={isOpen} onClick={onClick} />
        </Flex>
      </Flex>
      <StyledText>
        <Text fontWeight={500} fontSize="12px" marginRight="4px">
          {`${t('Pending Rewards')}: `}
        </Text>
        <CardValue fontSize="12px" fontWeight={500} value={totalEarnings} prefix="$" />
      </StyledText>
    </StyledDiv>
  )
}
