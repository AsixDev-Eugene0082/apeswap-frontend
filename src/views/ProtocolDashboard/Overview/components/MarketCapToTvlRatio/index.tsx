/** @jsxImportSource theme-ui */
import { Flex, Text } from '@ape.swap/uikit'
import React, { useMemo } from 'react'
import { Line } from 'react-chartjs-2'
import useTheme from 'hooks/useTheme'
import { styles } from './styles'
import { useTranslation } from 'contexts/Localization'
import CountUp from 'react-countup'
import { OverviewMcapTvlRatioInterface } from 'state/protocolDashboard/types'
import { useFetchOverviewMcapTvlRatio } from 'state/protocolDashboard/hooks'

const setData = (data: OverviewMcapTvlRatioInterface[], theme: any) => {
  return {
    labels: data?.map((curr) => curr.timestamp * 1000),
    datasets: [
      {
        data: data?.map((curr) => curr.ratio),
        fill: false,
        borderColor: theme.colors.text,
        backgroundColor: theme.colors.text,
        tension: 0.3,
      },
    ],
  }
}

const MarketCapToTvlRatio: React.FC = () => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const mcapTvlData = useFetchOverviewMcapTvlRatio()
  const data = useMemo(() => setData(mcapTvlData, theme), [mcapTvlData, theme])
  return (
    <Flex sx={styles.cardContainer}>
      <Flex sx={{ flexDirection: 'column', textAlign: 'center', marginBottom: '10px' }}>
        <Text size="22px" weight={700} mb="10px">
          {t('Market Cap to TVL Ratio')}
        </Text>
        {mcapTvlData?.length > 0 && (
          <Text size="16px" weight={500}>
            <CountUp end={mcapTvlData[mcapTvlData.length - 1].ratio} decimals={2} duration={1} separator="," />
          </Text>
        )}
      </Flex>
      {mcapTvlData?.length > 0 && (
        <Flex sx={{ maxWidth: '100%', width: '99%', height: '200px' }}>
          <Line
            data={data}
            options={{
              elements: {
                point: {
                  radius: 0,
                },
              },
              scales: {
                y: {
                  position: 'right',
                  type: 'linear',
                  grid: { color: theme.colors.white4, drawBorder: false },
                  ticks: {
                    color: theme.colors.text,
                    font: { family: 'poppins', weight: '500' },
                    autoSkip: true,
                    maxTicksLimit: 5,
                  },
                },
                x: {
                  grid: { display: false, drawBorder: false },
                  min: new Date(new Date().getTime() - 180 * 24 * 60 * 60 * 1000).getTime(),
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
              responsive: true,
              maintainAspectRatio: false,
              color: 'red',
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
            }}
          />
        </Flex>
      )}
    </Flex>
  )
}

export default React.memo(MarketCapToTvlRatio)
