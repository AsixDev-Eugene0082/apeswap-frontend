import React from 'react'
import { Text } from '@apeswapfinance/uikit'
import Image from 'views/Nft/components/Image'
import { StyledCard, StyledText } from '../styles'

interface NFTProps {
  id: number
  name: string
  imageUrl: string
  rarityRank?: number
  rarityTier?: number
}

export const NFTCard: React.FC<NFTProps> = ({ id, name, imageUrl, rarityRank, rarityTier }) => {
  return (
    <StyledCard>
      <div style={{ width: '100%', padding: '16px' }}>
        <Image src={imageUrl} rarityTier={rarityTier} borderRadius="6px" imageBorderRadius={false} hideTier />
      </div>
      <div style={{ width: '100%', height: '100%', padding: '10px 16px', gap: '12px' }}>
        <Text bold>{name}</Text>
        <StyledText>
          Token ID {id} {rarityRank ? `| Rarity Rank ${rarityRank}` : null}
        </StyledText>
      </div>
    </StyledCard>
  )
}
