/** @jsxImportSource theme-ui */
import { Flex, Text } from '@ape.swap/uikit'
import React, { useMemo } from 'react'
import { Line } from 'react-chartjs-2'
import useTheme from 'hooks/useTheme'
import CountUp from 'react-countup'
import { useTranslation } from 'contexts/Localization'
import { useFetchOverviewVolume } from 'state/protocolDashboard/hooks'
import { styles } from './styles'
import { useHomepageStats } from 'state/hooks'
import { OverviewVolumeInterface } from 'state/protocolDashboard/types'
import { orderBy } from 'lodash'

const BACKGROUND_COLORS = {
  Ethereum: 'rgba(98, 126, 234, .8)',
  Polygon: 'rgba(130, 71, 229, .8)',
  'BNB Chain': 'rgba(243, 186, 47, .8)',
}
const BORDER_COLORS = {
  Ethereum: 'rgba(98, 126, 234, 1)',
  Polygon: 'rgba(130, 71, 229, 1)',
  'BNB Chain': 'rgba(243, 186, 47, 1)',
}

const setData = (tradeVolume: OverviewVolumeInterface[]) => {
  return {
    labels: tradeVolume?.[0]?.history.map((hist) => hist.time * 1000),
    datasets: tradeVolume?.map((data, i) => {
      return {
        label: data.description,
        data: data.history?.map((hist) => hist.amount),
        backgroundColor: BACKGROUND_COLORS[data.description],
        borderColor: BORDER_COLORS[data.description],
        lineTension: 0.3,
        fill: true,
      }
    }),
  }
}

const TotalTradeVolume: React.FC = () => {
  const tradeVolume = useFetchOverviewVolume()
  const totalVolume = useHomepageStats()?.totalVolume
  const sortTradeVol = orderBy(tradeVolume, (vol) => vol.history?.[vol.history.length - 1].amount, 'asc')
  const { theme } = useTheme()
  const data = useMemo(() => setData(sortTradeVol), [sortTradeVol])
  const { t } = useTranslation()

  return (
    <Flex sx={styles.cardContainer}>
      <Flex sx={{ flexDirection: 'column', textAlign: 'center', marginBottom: '10px' }}>
        <Text size="22px" weight={700} mb="10px">
          {t('Total Trade Volume')}
        </Text>
        <Text size="16px" weight={500}>
          {totalVolume && (
            <>
              $<CountUp end={totalVolume} decimals={0} duration={1} separator="," />
            </>
          )}
        </Text>
      </Flex>
      <Flex sx={styles.graphContainer}>
        {data && (
          <Line
            data={data}
            options={{
              elements: {
                point: {
                  radius: 0,
                },
              },
              color: theme.colors.text,
              scales: {
                y: {
                  type: 'linear',
                  grid: { color: theme.colors.white4, drawBorder: false },
                  ticks: {
                    color: theme.colors.text,
                    font: { family: 'poppins', weight: '500' },
                    autoSkip: true,
                    callback: function (value) {
                      return value.toLocaleString('en-US', { style: 'currency', currency: 'USD', notation: 'compact' })
                    },
                    maxTicksLimit: 5,
                  },
                },
                x: {
                  grid: { display: false, drawBorder: false },
                  ticks: {
                    color: theme.colors.text,
                    font: { family: 'poppins', weight: '500' },
                    autoSkip: true,
                    maxTicksLimit: 5,
                  },
                  type: 'time',
                  time: {
                    unit: 'month',
                    displayFormats: {
                      month: 'MMM YY',
                    },
                  },
                },
              },
              plugins: {
                legend: {
                  display: false,
                },
                tooltip: {
                  enabled: true,
                  mode: 'nearest',
                  intersect: false,
                  titleFont: { family: 'poppins', weight: '700', size: 16 },
                  bodyFont: { family: 'poppins', weight: '500', size: 14 },
                  titleColor: theme.colors.text,
                  backgroundColor: theme.colors.white2,
                  boxPadding: 5,
                  bodyColor: theme.colors.text,
                  borderColor: theme.colors.inputBorder,
                  bodySpacing: 20,
                  borderWidth: 1,
                  cornerRadius: 10,
                  caretSize: 8,
                  padding: 15,
                },
              },
              responsive: true,
              maintainAspectRatio: false,
            }}
          />
        )}
      </Flex>
      <Flex
        sx={{
          margin: '5px 0px 10px 0px',
          height: '70px',
          alignItems: 'center',
          justifyContent: 'space-around',
          flexWrap: 'wrap',
        }}
      >
        {sortTradeVol?.reverse()?.map((data, i) => {
          const totalVolume = data.history[data.history.length - 1].amount
          return (
            <Flex key={data.description} sx={{ alignItems: 'center', flexWrap: 'no-wrap', margin: '5px 5px' }}>
              <Flex
                sx={{
                  background: BORDER_COLORS[data.description],
                  width: '25px',
                  height: '10px',
                  borderRadius: '10px',
                  mr: '5px',
                }}
              />
              <Flex sx={{ alignItems: 'center', justifyContnet: 'center' }}>
                <Text size="12px" weight={700} mr="5px" sx={{ lineHeight: '10px' }}>
                  {data.description}
                </Text>
                <Text size="12px" sx={{ lineHeight: '10px' }}>
                  $<CountUp end={totalVolume} decimals={0} duration={1} separator="," />
                </Text>
              </Flex>
            </Flex>
          )
        })}
      </Flex>
    </Flex>
  )
}

export default React.memo(TotalTradeVolume)
