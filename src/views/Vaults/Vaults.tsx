/** @jsxImportSource theme-ui */
import React, { useState, useRef, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import BigNumber from 'bignumber.js'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { Flex } from '@apeswapfinance/uikit'
import orderBy from 'lodash/orderBy'
import { useTranslation } from 'contexts/Localization'
import Banner from 'components/Banner'
import ListViewLayout from 'components/layout/ListViewLayout'
import partition from 'lodash/partition'
import { useFetchFarmLpAprs } from 'state/hooks'
import { useVaults, usePollVaultsData, useSetVaults } from 'state/vaults/hooks'
import { Vault } from 'state/types'
import DisplayVaults from './components/DisplayVaults'
import VaultMenu from './components/Menu'
import { useSetZapOutputList } from 'state/zap/hooks'

const NUMBER_OF_VAULTS_VISIBLE = 12

const Vaults: React.FC = () => {
  useSetVaults()
  usePollVaultsData()
  const { chainId } = useActiveWeb3React()
  useFetchFarmLpAprs(chainId)
  const { t } = useTranslation()
  const [stakedOnly, setStakedOnly] = useState(false)
  const [vaultType, setVaultType] = useState('allTypes')
  const [observerIsSet, setObserverIsSet] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOption, setSortOption] = useState('hot')
  const [numberOfVaultsVisible, setNumberOfVaultsVisible] = useState(NUMBER_OF_VAULTS_VISIBLE)
  const { pathname } = useLocation()
  const { search } = window.location
  const { vaults: initVaults } = useVaults()
  const params = new URLSearchParams(search)
  const urlSearchedVault = parseInt(params.get('id'))
  const [allVaults, setAllVaults] = useState(initVaults)
  const isActive = !pathname.includes('history')
  const loadMoreRef = useRef<HTMLDivElement>(null)

  const handleChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
  }

  useEffect(() => {
    setAllVaults(initVaults)
  }, [initVaults])

  useEffect(() => {
    const showMorePools = (entries) => {
      const [entry] = entries
      if (entry.isIntersecting) {
        setNumberOfVaultsVisible((vaultsCurrentlyVisible) => vaultsCurrentlyVisible + NUMBER_OF_VAULTS_VISIBLE)
      }
    }

    if (!observerIsSet) {
      const loadMoreObserver = new IntersectionObserver(showMorePools, {
        rootMargin: '0px',
        threshold: 1,
      })
      loadMoreObserver.observe(loadMoreRef.current)
      setObserverIsSet(true)
    }
  }, [observerIsSet])

  const [inactiveVaults, activeVaults] = partition(allVaults, (vault) => vault.inactive)

  const stakedOnlyVaults = activeVaults.filter(
    (vault) => vault.userData && new BigNumber(vault.userData.stakedBalance).isGreaterThan(0),
  )

  const vaultsHasRewards = stakedOnlyVaults.filter((vault) =>
    new BigNumber(vault.userData.pendingRewards).isGreaterThan(0),
  )

  const stakedInactiveVaults = inactiveVaults.filter(
    (vault) => vault.userData && new BigNumber(vault.userData.stakedBalance).isGreaterThan(0),
  )

  const sortVaults = (vaultsToSort: Vault[]) => {
    switch (sortOption) {
      case 'apy':
        // Ternary is needed to prevent pools without APR (like MIX) getting top spot
        return orderBy(vaultsToSort, (vault: Vault) => vault?.apy?.daily, 'desc')
      case 'totalStaked':
        return orderBy(vaultsToSort, (vault: Vault) => parseInt(vault?.totalStaked) * vault?.stakeTokenPrice, 'desc')
      default:
        return orderBy(vaultsToSort, (vault: Vault) => vault.platform, 'asc')
    }
  }

  const renderVaults = (): Vault[] => {
    let chosenVaults = isActive ? activeVaults : inactiveVaults

    if (urlSearchedVault) {
      const vaultCheck =
        activeVaults?.find((vault) => {
          return vault.id === urlSearchedVault
        }) !== undefined
      if (vaultCheck) {
        chosenVaults = [
          activeVaults?.find((vault) => {
            return vault.id === urlSearchedVault
          }),
          ...activeVaults?.filter((vault) => {
            return vault.id !== urlSearchedVault
          }),
        ]
      }
    }

    if (stakedOnly) {
      chosenVaults = isActive ? stakedOnlyVaults : stakedInactiveVaults
    }

    if (vaultType !== 'allTypes') {
      chosenVaults = chosenVaults.filter((vault) => vault.type === vaultType.toUpperCase())
    }

    if (searchQuery) {
      const lowercaseQuery = searchQuery.toLowerCase()
      chosenVaults = chosenVaults.filter((vault) =>
        `${vault?.stakeToken?.symbol.toLowerCase()}-${vault?.rewardToken?.symbol.toLowerCase()}`.includes(
          lowercaseQuery,
        ),
      )
    }
    return sortVaults(chosenVaults).slice(0, numberOfVaultsVisible)
  }

  useSetZapOutputList(
    activeVaults?.slice(1).map((vault) => {
      return { currencyIdA: vault?.token?.address[chainId], currencyIdB: vault?.quoteToken?.address[chainId] }
    }),
  )

  return (
    <>
      <Flex
        flexDirection="column"
        justifyContent="center"
        mb="100px"
        style={{ position: 'relative', top: '30px', width: '100%' }}
      >
        <ListViewLayout>
          <Banner
            title={t('BANANA Maximizers')}
            banner="banana-maximizers"
            link="https://apeswap.gitbook.io/apeswap-finance/product-and-features/stake/vaults"
            titleColor="primaryBright"
            maxWidth={1130}
          />
          <VaultMenu
            onHandleQueryChange={handleChangeQuery}
            onSetSortOption={setSortOption}
            onSetStake={setStakedOnly}
            onSetVaultType={setVaultType}
            vaults={vaultsHasRewards}
            activeOption={sortOption}
            activeVaultType={vaultType}
            stakedOnly={stakedOnly}
            query={searchQuery}
          />
          <DisplayVaults vaults={renderVaults()} openId={urlSearchedVault} />
        </ListViewLayout>
        <div ref={loadMoreRef} />
      </Flex>
    </>
  )
}

export default Vaults
