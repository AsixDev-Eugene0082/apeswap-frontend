import { useEffect, useMemo, useState } from 'react'
import { ChainId } from '@ape.swap/sdk'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { Toast, toastTypes } from '@apeswapfinance/uikit'
import { useSelector } from 'react-redux'
import useRefresh from 'hooks/useRefresh'
import { useAppDispatch } from 'state'
import useSwitchNetwork from 'hooks/useSelectNetwork'
import { push as pushToast, remove as removeToast, clear as clearToast } from './actions'
import {
  State,
  ProfileState,
  StatsState,
  StatsOverallState,
  FarmOverall,
  AuctionsState,
  IazosState,
  Iazo,
  HomepageData,
  LpTokenPricesState,
  NfaState,
  HomepageTokenStats,
  NewsCardType,
  LaunchCalendarCard,
  ServiceData,
  FarmLpAprsType,
} from './types'
import { fetchProfile } from './profile'
import {
  fetchFarmLpAprs,
  fetchHomepageData,
  fetchHomepageLaunchCalendar,
  fetchHomepageNews,
  fetchHomepageService,
  fetchHomepageTokenData,
  fetchLiveIfoStatus,
  fetchLiveTags,
  fetchLiveOrdering,
} from './stats'
import { fetchAuctions } from './auction'
import { setVaultsLoad } from './vaults'
import { fetchIazo, fetchIazos, fetchSettings } from './iazos'
import { fetchUserNetwork } from './network'
import { fetchAllNfas } from './nfas'
import { useFetchTokenPrices } from './tokenPrices/hooks'
import { useBabContract, useRaffleContract } from 'hooks/useContract'
import { useWeb3React } from '@web3-react/core'

// Network

export const useNetworkChainId = (): number => {
  const chainId = useSelector((state: State) => state.network.data.chainId)
  return chainId
}

export const useNetworkChainIdFromUrl = (): boolean => {
  const chainIdFromUrl = useSelector((state: State) => state.network.data.chainIdFromUrl)
  return chainIdFromUrl
}

export const useUpdateNetwork = () => {
  const dispatch = useAppDispatch()
  const { chainId, account } = useActiveWeb3React()
  const appChainId = useNetworkChainId()
  const chainIdFromUrl = useNetworkChainIdFromUrl()
  const { switchNetwork } = useSwitchNetwork()
  useEffect(() => {
    if (chainIdFromUrl) {
      switchNetwork(appChainId)
    } else {
      dispatch(fetchUserNetwork(chainId, account, appChainId))
    }
    // Load initial vault state in update netowrk to stop mount re-render
    dispatch(setVaultsLoad(false))
  }, [chainId, account, appChainId, chainIdFromUrl, switchNetwork, dispatch])
}

// Toasts
export const useToast = () => {
  const dispatch = useAppDispatch()
  const helpers = useMemo(() => {
    const push = (toast: Toast) => dispatch(pushToast(toast))

    return {
      toastError: (description: string, action?: any) => {
        return push({
          id: description,
          title: description,
          description,
          action,
          type: toastTypes.ERROR,
        })
      },
      toastInfo: (description: string, action?: any) => {
        return push({
          id: description,
          title: description,
          description,
          action,
          type: toastTypes.INFO,
        })
      },
      toastSuccess: (description: string, action?: any) => {
        return push({
          id: description,
          title: description,
          description,
          action,
          type: toastTypes.SUCCESS,
        })
      },
      toastWarning: (description: string, action?: any) => {
        return push({
          id: description,
          title: description,
          description,
          action,
          type: toastTypes.DANGER,
        })
      },
      push,
      remove: (id: string) => dispatch(removeToast(id)),
      clear: () => dispatch(clearToast()),
    }
  }, [dispatch])

  return helpers
}

// Profile

export const useFetchProfile = () => {
  const { account } = useActiveWeb3React()
  const getNfas = !!account
  useFetchNfas(getNfas)
  const dispatch = useAppDispatch()
  const chainId = ChainId.BSC
  const { slowRefresh } = useRefresh()
  const { nfas } = useNfas()

  useEffect(() => {
    if (account) {
      dispatch(fetchProfile(nfas, chainId, account))
    }
  }, [account, dispatch, nfas, slowRefresh, chainId])
}

export const useProfile = () => {
  const { isInitialized, isLoading, data }: ProfileState = useSelector((state: State) => state.profile)
  return { profile: data, hasProfile: isInitialized && data !== null, isInitialized, isLoading }
}

export const useFetchHomepageStats = (isFetching: boolean) => {
  const dispatch = useAppDispatch()
  const { slowRefresh } = useRefresh()

  useEffect(() => {
    if (isFetching) {
      dispatch(fetchHomepageData())
    }
  }, [slowRefresh, isFetching, dispatch])
}

export const useHomepageStats = (): HomepageData => {
  const homepageStats = useSelector((state: State) => state.stats.HomepageData)
  return homepageStats
}

export const useFetchHomepageServiceStats = (isFetching: boolean) => {
  const dispatch = useAppDispatch()
  const { slowRefresh } = useRefresh()

  useEffect(() => {
    if (isFetching) {
      dispatch(fetchHomepageService())
    }
  }, [slowRefresh, isFetching, dispatch])
}

export const useHomepageServiceStats = (): ServiceData[] => {
  const homepageServiceStats = useSelector((state: State) => state.stats.HomepageServiceStats)
  return homepageServiceStats
}

export const useFetchHomepageTokenStats = (isFetching: boolean, category: string) => {
  const dispatch = useAppDispatch()
  const { slowRefresh } = useRefresh()

  useEffect(() => {
    if (isFetching) {
      dispatch(fetchHomepageTokenData(category))
    }
  }, [slowRefresh, isFetching, category, dispatch])
}

export const useHomepageTokenStats = (): HomepageTokenStats[] => {
  const homepageTokenStats = useSelector((state: State) => state.stats.HomepageTokenStats)
  return homepageTokenStats
}

export const useFetchFarmLpAprs = (chainId) => {
  const dispatch = useAppDispatch()
  const { slowRefresh } = useRefresh()

  useEffect(() => {
    dispatch(fetchFarmLpAprs(chainId))
  }, [slowRefresh, chainId, dispatch])
}

export const useFarmLpAprs = (): FarmLpAprsType => {
  const farmLpAprs = useSelector((state: State) => state.stats.FarmLpAprs)
  return farmLpAprs
}

export const useFetchHomepageNews = (isFetching: boolean) => {
  const dispatch = useAppDispatch()
  const { slowRefresh } = useRefresh()

  useEffect(() => {
    if (isFetching) {
      dispatch(fetchHomepageNews())
    }
  }, [slowRefresh, isFetching, dispatch])
}

export const useHomepageLaunchCalendar = (): LaunchCalendarCard[] => {
  const homepageLaunchCalendar = useSelector((state: State) => state.stats.HomepageLaunchCalendar)
  return homepageLaunchCalendar
}

export const useFetchHomepageLaunchCalendar = (isFetching: boolean) => {
  const dispatch = useAppDispatch()
  const { slowRefresh } = useRefresh()

  useEffect(() => {
    if (isFetching) {
      dispatch(fetchHomepageLaunchCalendar())
    }
  }, [slowRefresh, isFetching, dispatch])
}

export const useHomepageNews = (): NewsCardType[] => {
  const homepageNews = useSelector((state: State) => state.stats.HomepageNews)
  return homepageNews
}

export const useFetchAuctions = () => {
  useFetchNfas()
  const dispatch = useAppDispatch()
  const { fastRefresh } = useRefresh()
  const chainId = useNetworkChainId()
  const { nfas } = useNfas()

  useEffect(() => {
    if (chainId === ChainId.BSC || chainId === ChainId.BSC_TESTNET) {
      dispatch(fetchAuctions(nfas, chainId))
    }
  }, [dispatch, fastRefresh, nfas, chainId])
}

export const useAuctions = () => {
  const { isInitialized, isLoading, data }: AuctionsState = useSelector((state: State) => state.auctions)
  return { auctions: data, isInitialized, isLoading }
}

export const useFetchIazoSettings = () => {
  useFetchTokenPrices()
  const dispatch = useAppDispatch()
  const chainId = useNetworkChainId()
  const { slowRefresh } = useRefresh()
  useEffect(() => {
    dispatch(fetchSettings(chainId))
  }, [dispatch, slowRefresh, chainId])
}

export const useFetchIazos = () => {
  useFetchTokenPrices()
  const dispatch = useAppDispatch()
  const chainId = useNetworkChainId()
  const { slowRefresh } = useRefresh()
  useEffect(() => {
    dispatch(fetchIazos(chainId))
  }, [dispatch, slowRefresh, chainId])
}

export const useFetchIazo = (address: string) => {
  useFetchTokenPrices()
  const dispatch = useAppDispatch()
  const chainId = useNetworkChainId()
  const { fastRefresh } = useRefresh()
  useEffect(() => {
    dispatch(fetchIazo(chainId, address))
  }, [dispatch, fastRefresh, chainId, address])
}

export const useIazos = () => {
  const { isInitialized, isLoading, iazoData }: IazosState = useSelector((state: State) => state.iazos)
  return { iazos: iazoData, isInitialized, isLoading }
}

export const useIazoSettings = () => {
  const { iazoDefaultSettings }: IazosState = useSelector((state: State) => state.iazos)
  return iazoDefaultSettings
}

export const useIazoFromAddress = (address): Iazo => {
  const iazo: Iazo = useSelector((state: State) => state.iazos.iazoData.find((i) => i.iazoContractAddress === address))
  return iazo
}

export const useFetchNfas = (nafFlag = true) => {
  const dispatch = useAppDispatch()
  const chainId = useNetworkChainId()
  useEffect(() => {
    if (nafFlag) {
      dispatch(fetchAllNfas())
    }
  }, [dispatch, nafFlag, chainId])
}

export const useFetchBabToken = () => {
  const [loading, setIsLoading] = useState(true)
  const [tokenId, setTokenId] = useState(undefined)
  const [holdsBab, setHoldsBab] = useState(false)

  const { account } = useWeb3React()
  const babContract = useBabContract()

  useEffect(() => {
    setIsLoading(true)
    setHoldsBab(false)
    const fetchBabId = async () => {
      try {
        const balance = await babContract.balanceOf(account)
        if (balance > 0) {
          setHoldsBab(true)
          const tokenId = await babContract.tokenIdOf(account)
          setTokenId(tokenId)
        }
      } catch (e) {
        console.warn('Something went wrong fetching BAB balance')
      } finally {
        setIsLoading(false)
      }
    }
    if (account) fetchBabId()
    else setIsLoading(false)
  }, [babContract, account])
  return { tokenId, loading, holdsBab }
}

export const useClaimRaffle = () => {
  const [claiming, setIsClaiming] = useState(false)
  const [hasClaimed, setHasClaimed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { account } = useWeb3React()

  const raffleContract = useRaffleContract()
  const claim = async (tokenId: number) => {
    setIsClaiming(true)
    await raffleContract.mint(tokenId)
    setIsClaiming(false)
    setHasClaimed(true)
  }

  useEffect(() => {
    const fetchClaimed = async () => {
      try {
        setIsLoading(true)
        const balance = await raffleContract.balanceOf(account)
        setHasClaimed(balance > 0)
      } catch {
        console.warn('Something went wrong fetching Raffle balance')
      } finally {
        setIsLoading(false)
      }
    }
    if (account) fetchClaimed()
  }, [account, raffleContract])
  return { claiming, claim, hasClaimed, isLoading }
}

export const useWonRaffles = () => {
  const [claiming, setIsClaiming] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [userWins, setUserWins] = useState([])
  const [userWon, setUserWon] = useState(false)
  const [userClaimed, setUserClaimed] = useState(false)
  const { account } = useWeb3React()

  const raffleContract = useRaffleContract()
  const claim = async (winId: number) => {
    setIsClaiming(true)
    await raffleContract.claim(winId)
    setIsClaiming(false)
  }

  useEffect(() => {
    const fetchWinStatus = async () => {
      try {
        setIsLoading(true)
        const result = await raffleContract.getUserWins(account)
        if (result.length > 0) {
          const userWinsResult = [
            {
              id: result[1][0].toNumber(),
              prizeTokenId: result[0][0].prizeTokenId.toNumber(),
              claimed: result[0][0].claimed,
              tokenId: result[0][0].tokenId.toNumber(),
            },
          ]
          setUserWins(userWinsResult)
          setUserClaimed(userWinsResult[0].claimed)
        }
        setUserWon(result.length > 0)
      } catch {
        console.warn('Something went wrong fetching Raffle balance')
      } finally {
        setIsLoading(false)
      }
    }
    if (account) fetchWinStatus()
  }, [account, raffleContract])
  return { claiming, claim, userWins, isLoading, userWon, userClaimed }
}

export const useNfas = () => {
  const { isInitialized, isLoading, data }: NfaState = useSelector((state: State) => state.nfas)
  return { nfas: data, isInitialized, isLoading }
}

export const useLpTokenPrices = () => {
  const { isInitialized, isLoading, data }: LpTokenPricesState = useSelector((state: State) => state.lpTokenPrices)
  return { lpTokenPrices: data, isInitialized, isLoading }
}

export const useTokenPriceFromSymbol = (symbol: string) => {
  const tokenPrice = useSelector((state: State) =>
    state.tokenPrices.data?.find((token) => token.symbol === symbol),
  )?.price
  return tokenPrice
}

export const useTokenPriceFromAddress = (address: string) => {
  const chainId = useNetworkChainId()
  const tokenPrice = useSelector((state: State) =>
    state?.tokenPrices?.data?.find((token) => token.address[chainId].toLowerCase() === address.toLowerCase()),
  )?.price
  return tokenPrice
}

export const usePendingUsd = () => {
  const { isInitialized, isLoading, data }: StatsState = useSelector((state: State) => state.stats)
  return { pending: data?.pendingRewardUsd || 0, hasStats: isInitialized && data !== null, isInitialized, isLoading }
}

export const usePersonalTvl = () => {
  const { isInitialized, isLoading, data }: StatsState = useSelector((state: State) => state.stats)
  return { tvl: data?.tvl || 0, hasStats: isInitialized && data !== null, isInitialized, isLoading }
}

export const useGetPoolStats = (pid) => {
  let poolStats = {} as FarmOverall
  const { isInitialized, isLoading, data }: StatsOverallState = useSelector((state: State) => state.statsOverall)
  if (isInitialized) {
    if (pid === 0) poolStats = data?.pools[0]
    else poolStats = data?.incentivizedPools.find((pool) => pool.id === pid)
  }
  return { poolStats, hasStats: isInitialized && data !== null, isInitialized, isLoading }
}

export const useFetchLiveIfoStatus = () => {
  const dispatch = useAppDispatch()
  const { slowRefresh } = useRefresh()
  useEffect(() => {
    dispatch(fetchLiveIfoStatus())
  }, [dispatch, slowRefresh])
}

export const useLiveIfoStatus = () => {
  const { LiveIfo }: StatsState = useSelector((state: State) => state.stats)

  return { liveIfos: LiveIfo }
}

export const useFetchLiveTagsAndOrdering = () => {
  const dispatch = useAppDispatch()
  const { slowRefresh } = useRefresh()
  useEffect(() => {
    dispatch(fetchLiveOrdering())
    dispatch(fetchLiveTags())
  }, [dispatch, slowRefresh])
}

// TAGS
export const usePoolTags = (chainId: number) => {
  const { Tags }: StatsState = useSelector((state: State) => state.stats)
  const poolTags = Tags?.[`${chainId}`]?.pools

  return { poolTags }
}
