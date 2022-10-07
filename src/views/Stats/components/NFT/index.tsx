import React, { useState } from 'react'
import { Flex } from '@apeswapfinance/uikit'

import { NftInfo } from 'state/statsPage/mappings/rawToNfts'
import { useStats } from 'state/statsPage/hooks'

import ListViewMenu from './components/ListViewMenu'
import { NFTCard } from './components/NFTCard'
import { BillCard } from './components/BillCard'
import { NoContentPlaceholder } from '../NoContentPlaceholder'

import { Container, ContentCard, NoContentCard } from './styles'

export const NFT = () => {
  const [filteredNfts, setFilteredNfts] = useState<NftInfo[]>([])
  const [query, setQuery] = useState('')
  const [sortOption, setSortOption] = useState('all')
  const { nfts } = useStats()

  const handleChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)

    const filteredData = nfts.filter((nft) => {
      if (nft.name.toLowerCase().includes(event.target.value.toLowerCase()) && nft.type === sortOption) return nft

      return null
    })

    setFilteredNfts(filteredData)
  }

  const handleChangeSortOption = (option: string) => {
    setSortOption(option)

    setFilteredNfts(nfts.filter((nft) => nft.type === option))
  }

  return (
    <Container>
      <Flex alignItems="center" justifyContent="center">
        <ListViewMenu
          onHandleQueryChange={handleChangeQuery}
          onSetSortOption={handleChangeSortOption}
          query={query}
          activeOption={sortOption}
        />
      </Flex>
      {nfts?.length ? (
        <ContentCard>
          {query.length > 0 || sortOption !== 'all'
            ? filteredNfts.map((nft) =>
                nft.type === 'Bill' ? (
                  <BillCard
                    key={nft.id}
                    id={nft.id}
                    imageUrl={nft.imageUrl}
                    name={nft.name}
                    tokens={nft.tokens}
                    type={nft.billType}
                    value={nft.billValue}
                    timeRemaining={nft.timeRemaining}
                  />
                ) : (
                  <NFTCard
                    key={nft.id}
                    id={nft.id}
                    imageUrl={nft.imageUrl}
                    name={nft.name}
                    rarityRank={nft.rarityRank}
                    rarityTier={nft.rarityTier}
                  />
                ),
              )
            : nfts.map((nft) =>
                nft.type === 'Bill' ? (
                  <BillCard
                    key={nft.id}
                    id={nft.id}
                    imageUrl={nft.imageUrl}
                    name={nft.name}
                    tokens={nft.tokens}
                    type={nft.billType}
                    value={nft.billValue}
                    timeRemaining={nft.timeRemaining}
                  />
                ) : (
                  <NFTCard
                    key={nft.name}
                    id={nft.id}
                    imageUrl={nft.imageUrl}
                    name={nft.name}
                    rarityRank={nft.rarityRank}
                    rarityTier={nft.rarityTier}
                  />
                ),
              )}
        </ContentCard>
      ) : (
        <NoContentCard>
          <NoContentPlaceholder mt="72px" />
        </NoContentCard>
      )}
    </Container>
  )
}
