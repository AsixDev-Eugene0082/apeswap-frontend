import React from 'react'
import { Chart, ArcElement } from 'chart.js'
import { Text } from '@apeswapfinance/uikit'
import { Doughnut } from 'react-chartjs-2'

import { useStats } from 'state/statsPage/hooks'
import { useTranslation } from 'contexts/Localization'

import CardValue from '../../../CardValue'
import { NoContentPlaceholder } from 'views/Stats/components/NoContentPlaceholder'

import { circleColors, Circle, Left, Right, TableInfo, TableRowContent, StyledFlex } from './styles'

export const TVLBreakdown = () => {
  Chart.register(ArcElement)

  const {
    stats: {
      analytics: { tvl },
    },
  } = useStats()
  const { t } = useTranslation()

  const tvlList = [tvl.farms, tvl.pools, tvl.jungleFarms, tvl.lending, tvl.maximizers]

  const chartData = {
    datasets: [
      {
        data: tvlList.map((product) => product.value),
        backgroundColor: [
          circleColors.farms,
          circleColors.pools,
          circleColors.jungleFarms,
          circleColors.lending,
          circleColors.maximizer,
        ],
        borderWidth: 0,
      },
    ],
  }

  const getPercentage = (value: string): string => {
    return ((Number(value) / Number(tvl.total)) * 100).toFixed(2)
  }

  return (
    <>
      {+tvl.total > 0 ? (
        <StyledFlex>
          <div>
            <Doughnut data={chartData} height={208} width={208} options={{ maintainAspectRatio: false }} />
          </div>

          <TableInfo>
            {tvlList.map((product) => (
              <TableRow
                key={product.id}
                id={product.id}
                name={product.name === 'Farms' ? t('BANANA Farms') : t(product.name)}
                value={product.value}
                percentage={getPercentage(product.value)}
              />
            ))}
          </TableInfo>
        </StyledFlex>
      ) : (
        <NoContentPlaceholder mt="64px" />
      )}
    </>
  )
}

interface TableRowProps {
  id: string
  name: string
  value: string
  percentage?: string
}

const TableRow = ({ id, name, value, percentage }: TableRowProps) => {
  return (
    <TableRowContent>
      <Left>
        <Circle name={id} />
        <Text fontSize="12px" fontWeight={500}>
          {name}
        </Text>
      </Left>
      <Right>
        <CardValue fontSize="12px" fontWeight={700} decimals={2} value={Number(value)} prefix="$" />
        <Text fontSize="12px" fontWeight={500} style={{ width: '52px', textAlign: 'end' }}>
          {percentage} %
        </Text>
      </Right>
    </TableRowContent>
  )
}
