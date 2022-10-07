/** @jsxImportSource theme-ui */
// @ts-nocheck
// ChartJS has borderRadius in vs 3^, but react-chartjs does not have the type for it
import { ApeSwapTheme, Flex, Text } from '@ape.swap/uikit'
import React, { useMemo } from 'react'
import { Doughnut } from 'react-chartjs-2'
import { styles } from './styles'
import CountUp from 'react-countup'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'
import { BananaIcon } from 'components/Icons'
import { useFetchOverviewBananaDistribution } from 'state/protocolDashboard/hooks'
import { OverviewBananaDistributionInterface } from 'state/protocolDashboard/types'
import { usePriceGnanaBusd } from 'state/tokenPrices/hooks'
import useIsMobile from 'hooks/useIsMobile'

const doughnutLabelsLine = {
  id: 'doughnutLabelsLine',
  beforeDraw(chart) {
    const {
      ctx,
      chartArea: { width, height },
    } = chart
    chart.data.datasets.forEach((dataset, i) => {
      const totalBanana = dataset.data.reduce((a, b) => a + b, 0)
      chart.getDatasetMeta(i).data.forEach((datapoint, j) => {
        const { x, y } = datapoint.tooltipPosition()
        const halfWidth = width / 2
        const halfHeight = height / 2
        const xLine = x >= halfWidth ? x + 30 : x - 30
        const yLine = y >= halfHeight ? y + 30 : y - 30
        const extraLine = x >= halfWidth ? 20 : -20
        // Line
        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(xLine, yLine)
        ctx.lineTo(xLine + extraLine, yLine)
        ctx.strokeStyle = 'rgba(205, 205, 205, 1)'
        ctx.stroke()
        // Text
        const percent = ` ${((dataset.data[j] / totalBanana) * 100).toFixed(2)}% `
        const label = chart.data.labels[j]
        const textAlignPos = x >= halfWidth ? 'left' : 'right'
        ctx.font = '600 14px Poppins'
        ctx.textBaseline = 'bottom'
        ctx.fillStyle = dataset.backgroundColor
        ctx.textAlign = textAlignPos
        ctx.fillText(percent, xLine + extraLine, yLine)
        ctx.fillText(label, xLine + extraLine, yLine + 15)
      })
    })
  },
}

const setData = (bananaSupply: OverviewBananaDistributionInterface, theme: ApeSwapTheme) => {
  return {
    labels: bananaSupply?.distribution?.map((data) => data.description),
    datasets: [
      {
        data: bananaSupply?.distribution?.map((data) => data.amount),
        backgroundColor: theme.colors.text,
        hoverOffset: 4,
      },
    ],
  }
}

const BananaSupplyDistribution: React.FC = () => {
  const bananaSupply = useFetchOverviewBananaDistribution()
  const gnanaPrice = usePriceGnanaBusd()?.toNumber()
  const isMobile = useIsMobile()
  const { t } = useTranslation()
  const { theme } = useTheme()
  const data = useMemo(() => setData(bananaSupply, theme), [bananaSupply, theme])
  return (
    <Flex sx={styles.cardContainer}>
      <Flex sx={{ flexDirection: 'column', textAlign: 'center', mb: '5px' }}>
        <Text size="22px" weight={700} mb="5px">
          {t('BANANA Supply Distribution')}
        </Text>
        <Text size="16px" weight={500}>
          {bananaSupply?.total && (
            <>
              <CountUp end={bananaSupply?.total} decimals={2} duration={1} separator="," />
            </>
          )}
        </Text>
      </Flex>
      <Flex sx={{ width: '100%', justifyContent: 'space-around', alignItems: 'center', flexWrap: 'wrap' }}>
        {bananaSupply && (
          <>
            <Flex sx={{ width: '100%', height: '225px', overflow: 'visible', zIndex: 1 }}>
              <Doughnut
                data={data}
                options={{
                  maintainAspectRatio: false,
                  layout: {
                    padding: isMobile ? 22.5 : 20,
                  },
                  elements: {
                    arc: {
                      borderWidth: 4,
                      borderColor: theme.colors.white2,
                    },
                  },

                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      enabled: true,
                      mode: 'nearest',
                      displayColors: false,
                      callbacks: {
                        title: (title) => {
                          return title.map((ti) => {
                            return ti.label
                          })
                        },
                        label: (context) => {
                          return `Amount: ${context.parsed.toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}`
                        },
                        afterLabel: (context) => {
                          return `Value: ${(parseFloat(context.parsed) * gnanaPrice).toLocaleString('en-US', {
                            style: 'currency',
                            currency: 'USD',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          })}\nRatio: ${((parseFloat(context.parsed) / bananaSupply.total) * 100).toFixed(2)}%`
                        },
                      },
                      titleFont: { family: 'poppins', weight: '700', size: 16 },
                      bodyFont: { family: 'poppins', weight: '500', size: 16 },
                      titleColor: theme.colors.text,
                      backgroundColor: theme.colors.white2,
                      boxPadding: 5,
                      bodyColor: theme.colors.text,
                      borderColor: theme.colors.inputBorder,
                      bodySpacing: 10,
                      borderWidth: 1,
                      caretSize: 8,
                      cornerRadius: 10,
                      padding: 15,
                    },
                  },
                  borderRadius: 8,
                }}
                plugins={[doughnutLabelsLine]}
              />
            </Flex>
            <Flex
              sx={{
                position: 'absolute',
                alignItems: 'center',
                justifyContent: 'center',
                mr: '5px',
                zIndex: 0,
              }}
            >
              <BananaIcon />
            </Flex>
          </>
        )}
      </Flex>
    </Flex>
  )
}

export default React.memo(BananaSupplyDistribution)
