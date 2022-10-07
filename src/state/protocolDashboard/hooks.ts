import useRefresh from 'hooks/useRefresh'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { State } from 'state/types'
import {
  fetchOverviewTvl,
  fetchOverviewVolume,
  fetchOverviewBananaDistribution,
  fetchOverviewProtocolMetrics,
  fetchTreasuryAssetOverview,
  fetchTreasuryBreakdown,
  fetchTreasuryHistory,
  fetchOverviewMcapTvlRatio,
} from '.'

export const useFetchOverviewTvl = () => {
  const dispatch = useAppDispatch()
  const { slowRefresh } = useRefresh()

  useEffect(() => {
    dispatch(fetchOverviewTvl())
  }, [slowRefresh, dispatch])

  return useSelector((state: State) => state.protocolDashboard.overviewTvl)
}

export const useFetchOverviewVolume = () => {
  const dispatch = useAppDispatch()
  const { slowRefresh } = useRefresh()

  useEffect(() => {
    dispatch(fetchOverviewVolume())
  }, [slowRefresh, dispatch])
  return useSelector((state: State) => state.protocolDashboard.overviewVolume)
}

export const useFetchOverviewBananaDistribution = () => {
  const dispatch = useAppDispatch()
  const { slowRefresh } = useRefresh()

  useEffect(() => {
    dispatch(fetchOverviewBananaDistribution())
  }, [slowRefresh, dispatch])
  return useSelector((state: State) => state.protocolDashboard.overviewBananaDistribution)
}

export const useFetchOverviewProtocolMetrics = () => {
  const dispatch = useAppDispatch()
  const { slowRefresh } = useRefresh()

  useEffect(() => {
    dispatch(fetchOverviewProtocolMetrics())
  }, [slowRefresh, dispatch])
  return useSelector((state: State) => state.protocolDashboard.overviewProtocolMetrics)
}

export const useFetchOverviewMcapTvlRatio = () => {
  const dispatch = useAppDispatch()
  const { slowRefresh } = useRefresh()

  useEffect(() => {
    dispatch(fetchOverviewMcapTvlRatio())
  }, [slowRefresh, dispatch])
  return useSelector((state: State) => state.protocolDashboard.overviewMcapTvlRatio)
}

export const useFetchTreasuryAssetOverview = () => {
  const dispatch = useAppDispatch()
  const { slowRefresh } = useRefresh()

  useEffect(() => {
    dispatch(fetchTreasuryAssetOverview())
  }, [slowRefresh, dispatch])
  return useSelector((state: State) => state.protocolDashboard.treasuryAssetOverview)
}

export const useFetchTreasuryBreakdown = () => {
  const dispatch = useAppDispatch()
  const { slowRefresh } = useRefresh()

  useEffect(() => {
    dispatch(fetchTreasuryBreakdown())
  }, [slowRefresh, dispatch])
  return useSelector((state: State) => state.protocolDashboard.treasuryBreakdown)
}

export const useFetchTreasuryHistory = () => {
  const dispatch = useAppDispatch()
  const { slowRefresh } = useRefresh()

  useEffect(() => {
    dispatch(fetchTreasuryHistory())
  }, [slowRefresh, dispatch])
  return useSelector((state: State) => state.protocolDashboard.treasuryHistory)
}
