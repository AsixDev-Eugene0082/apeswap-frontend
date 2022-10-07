/** @jsxImportSource theme-ui */
import { Flex, Tab, Tabs, Text } from '@ape.swap/uikit'
import { Select, SelectItem } from '@apeswapfinance/uikit'
import React, { useMemo, useState } from 'react'
import { Line } from 'react-chartjs-2'
import useTheme from 'hooks/useTheme'
import { styles } from './styles'
import { useTranslation } from 'contexts/Localization'
import { useFetchOverviewProtocolMetrics, useFetchTreasuryHistory } from 'state/protocolDashboard/hooks'
import useIsMobile from 'hooks/useIsMobile'

const setData = (data: any, theme: any) => {
  return {
    labels: data?.history?.map((history) => history.time * 1000),
    datasets: [
      {
        data: data?.history?.map((history) => history.amount),
        fill: false,
        borderColor: theme.colors.text,
        backgroundColor: theme.colors.text,
        tension: 0.3,
      },
    ],
  }
}

const ProtocolMetricsGraph: React.FC = () => {
  const currentDate = new Date()
  const minDateMap = {
    '180d': new Date(currentDate.getTime() - 180 * 24 * 60 * 60 * 1000).getTime(),
    '7d': new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000).getTime(),
    '30d': new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000).getTime(),
  }
  const metrics = useFetchOverviewProtocolMetrics()
  // Using this endpoint for pol until the original gets fixed
  const polHistory = useFetchTreasuryHistory()
  const bananaHolders = metrics?.filter((data) => data.description === 'Banana Holders')[0]
  const marketCap = metrics?.filter((data) => data.description === 'Market Cap')[0]
  const bananaBurned = metrics?.filter((data) => data.description === 'Banana Burned')[0]
  // Using this until POL endpoint gets fixed
  // Replace with this:  metrics?.filter((data) => data.description === 'POL')[0]
  const pol = useMemo(() => {
    return {
      history: polHistory?.map((hist) => {
        return { amount: hist.polValue, time: hist.timestamp }
      }),
    }
  }, [polHistory])
  const listOfMetrics = useMemo(
    () => [bananaHolders, marketCap, bananaBurned, pol],
    [bananaHolders, marketCap, bananaBurned, pol],
  )
  const [activeCatTab, setActiveCatTab] = useState(1)
  const [activeTime, onSetTime] = useState('30d')
  const { t } = useTranslation()
  const { theme } = useTheme()
  const isMobile = useIsMobile()
  const data = useMemo(() => setData(listOfMetrics[activeCatTab], theme), [listOfMetrics, activeCatTab, theme])
  const categories = ['Banana Holders', 'Market Cap', 'Burned', 'POL']

  const switchCatTab = (index) => {
    isMobile ? setActiveCatTab(categories.indexOf(index)) : setActiveCatTab(index)
  }

  return (
    <Flex sx={styles.cardContainer}>
      <Flex sx={{ marginBottom: '10px', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <Flex sx={{ width: 'fit-content' }}>
          {!isMobile ? (
            <Tabs activeTab={activeCatTab} size="sm" variant="centered" sx={{ mb: '5px' }}>
              {/* <Tab
                index={0}
                size="sm"
                label={t('Holders')}
                activeTab={activeCatTab}
                variant="centered"
                onClick={switchCatTab}
              /> */}
              <Tab
                index={1}
                size="sm"
                label={t('Market Cap')}
                variant="fullWidth"
                activeTab={activeCatTab}
                onClick={switchCatTab}
              />
              <Tab
                index={2}
                size="sm"
                label={t('Burned')}
                variant="centered"
                activeTab={activeCatTab}
                onClick={switchCatTab}
              />
              <Tab
                index={3}
                size="sm"
                label={t('POL')}
                variant="centered"
                activeTab={activeCatTab}
                onClick={switchCatTab}
              />
            </Tabs>
          ) : (
            <Select
              size="sm"
              width="140px"
              onChange={(e) => switchCatTab(e.target.value)}
              active={categories[activeCatTab]}
            >
              {/* <SelectItem size="sm" value="Holders" key="holders">
                <Text sx={{ lineHeight: '20px' }}>{t('Holders')}</Text>
              </SelectItem> */}
              <SelectItem size="sm" value="Market Cap" key="marketCap">
                <Text sx={{ lineHeight: '20px' }}>{t('Market Cap')}</Text>
              </SelectItem>
              <SelectItem size="sm" value="Burned" key="burned">
                <Text sx={{ lineHeight: '20px' }}>{t('Burned')}</Text>
              </SelectItem>
              <SelectItem size="sm" value="POL" key="pol">
                <Text sx={{ lineHeight: '20px' }}>{t('POL')}</Text>
              </SelectItem>
            </Select>
          )}
        </Flex>
        <Flex sx={{ height: '40px' }}>
          <Select size="sm" width="126px" onChange={(e) => onSetTime(e.target.value)} active={activeTime}>
            <SelectItem size="sm" value="7d" key="7d">
              <Text sx={{ lineHeight: '20px' }}>{t('7d')}</Text>
            </SelectItem>
            <SelectItem size="sm" value="30d" key="30d">
              <Text sx={{ lineHeight: '20px' }}>{t('30d')}</Text>
            </SelectItem>
            <SelectItem size="sm" value="180d" key="total">
              <Text sx={{ lineHeight: '20px' }}>{t('180d')}</Text>
            </SelectItem>
          </Select>
        </Flex>
      </Flex>
      <Flex sx={{ maxWidth: '100%', width: '99%', height: '200px' }}>
        {data && (
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
                  grid: { color: theme.colors.white4, drawBorder: false },
                  ticks: { stepSize: 20, color: theme.colors.text, font: { family: 'poppins', weight: '500' } },
                },

                x: {
                  type: 'time',
                  min: minDateMap[activeTime],
                  grid: { display: false, drawBorder: false },
                  ticks: {
                    color: theme.colors.text,
                    font: { family: 'poppins', weight: '500' },
                  },
                  time: {
                    unit: activeTime === 'total' ? 'month' : activeTime === '24h' ? 'hour' : 'day',
                  },
                },
              },

              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false,
                },
                tooltip: {
                  enabled: true,
                  mode: 'nearest',
                  intersect: false,
                  callbacks: {
                    label: (context) => {
                      return `${activeCatTab === 1 || activeCatTab === 3 ? '$' : ''}${context.formattedValue}`
                    },
                  },
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
        )}
      </Flex>
    </Flex>
  )
}

export default React.memo(ProtocolMetricsGraph)
