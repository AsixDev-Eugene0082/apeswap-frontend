/** @jsxImportSource theme-ui */
import { Flex, Svg, Text, TooltipBubble } from '@ape.swap/uikit'
import React, { useMemo } from 'react'
import { Line } from 'react-chartjs-2'
import { styles } from './styles'
import useTheme from 'hooks/useTheme'
import CountUp from 'react-countup'
import { useTranslation } from 'contexts/Localization'
import { useFetchTreasuryHistory } from 'state/protocolDashboard/hooks'
import { TreasuryHistoryInterface } from 'state/protocolDashboard/types'

const setData = (treasuryHistory: TreasuryHistoryInterface[]) => {
  return {
    labels: treasuryHistory?.map((data) => data.timestamp),
    datasets: [
      {
        label: 'partnerPolValue',
        data: treasuryHistory?.map((data) => data.polValue),
        backgroundColor: 'green',
        borderColor: 'rgba(255,255,255, .5)',
        fill: true,
        lineTension: 0.3,
      },
      {
        label: 'apePolValue',
        data: treasuryHistory?.map((data) => data.polValue),
        backgroundColor: 'rgba(77, 64, 64, 1)',
        borderColor: 'rgba(255,255,255, .5)',
        fill: true,
        lineTension: 0.3,
      },
      {
        label: 'treasury',
        data: treasuryHistory?.map((data) => data.oppFundValue),
        backgroundColor: 'rgba(243, 186, 47, .6)',
        borderColor: 'rgba(255,255,255, .5)',
        fill: true,
        lineTension: 0.3,
      },
    ],
  }
}

const TreasuryHistory: React.FC = () => {
  const treasuryHistory = useFetchTreasuryHistory()
  const { theme } = useTheme()
  const data = useMemo(() => setData(treasuryHistory), [treasuryHistory])
  const totalApePol = treasuryHistory?.[treasuryHistory?.length - 1]?.apePolValue
  const totalPartnerPol = treasuryHistory?.[treasuryHistory?.length - 1]?.partnerPolValue
  const totalTreasury = treasuryHistory?.[treasuryHistory?.length - 1]?.oppFundValue

  const { t } = useTranslation()

  return (
    <Flex sx={styles.cardContainer}>
      <Flex sx={{ flexDirection: 'column', textAlign: 'center', marginBottom: '20px' }}>
        <Text size="22px" weight={700} mb="10px">
          {t('Total Funds')}
        </Text>
        {totalApePol && totalTreasury && (
          <Text size="16px" weight={500}>
            $<CountUp end={totalApePol + totalTreasury + totalPartnerPol} decimals={0} duration={1} separator="," />
          </Text>
        )}
      </Flex>

      {totalApePol && totalTreasury && totalPartnerPol && (
        <>
          <Flex sx={styles.legendContainer}>
            <Flex sx={{ alignItems: 'center', flexWrap: 'no-wrap', margin: '4px 0px' }}>
              <Flex
                sx={{
                  background: 'rgba(243, 186, 47, .5)',
                  width: '25px',
                  height: '10px',
                  borderRadius: '10px',
                  mr: '5px',
                }}
              />
              <Flex sx={{ alignItems: 'center', justifyContnet: 'center' }}>
                <Text weight={700} mr="5px" sx={{ lineHeight: '10px' }}>
                  {t('Operational Funds')}
                </Text>
                <Text sx={{ lineHeight: '10px', mr: '5px' }}>
                  $<CountUp end={totalTreasury} decimals={0} duration={1} separator="," />
                </Text>
                <TooltipBubble
                  body={<Text>{t('Capital that ApeSwap has on hand to use for DAO expenses.')}</Text>}
                  width="200px"
                  transformTip="translate(25px, 0px)"
                >
                  <Svg icon="info" width="13px" />
                </TooltipBubble>
              </Flex>
            </Flex>
            <Flex sx={{ alignItems: 'center', flexWrap: 'no-wrap', margin: '4px 0px' }}>
              <Flex
                sx={{
                  background: 'rgba(77, 64, 64, 1)',
                  width: '25px',
                  height: '10px',
                  borderRadius: '10px',
                  mr: '5px',
                }}
              />
              <Flex sx={{ alignItems: 'center', justifyContnet: 'center' }}>
                <Text weight={700} mr="5px" sx={{ lineHeight: '10px' }}>
                  Apeswap POL
                </Text>
                <Text sx={{ lineHeight: '10px', mr: '5px' }}>
                  $<CountUp end={totalApePol} decimals={0} duration={1} separator="," />
                </Text>
                <TooltipBubble
                  body={<Text>{t('Total value of the liquidity that ApeSwap owns in the form of LP tokens.')}</Text>}
                  width="180px"
                  transformTip="translate(25px, 0px)"
                >
                  <Svg icon="info" width="13px" />
                </TooltipBubble>
              </Flex>
            </Flex>
            <Flex sx={{ alignItems: 'center', flexWrap: 'no-wrap', margin: '5px 0px' }}>
              <Flex
                sx={{
                  background: 'green',
                  width: '25px',
                  height: '10px',
                  borderRadius: '10px',
                  mr: '5px',
                }}
              />
              <Flex sx={{ alignItems: 'center', justifyContnet: 'center' }}>
                <Text weight={700} mr="5px" sx={{ lineHeight: '10px' }}>
                  Partner POL
                </Text>
                <Text sx={{ lineHeight: '10px', mr: '4px' }}>
                  $<CountUp end={totalPartnerPol} decimals={0} duration={1} separator="," />
                </Text>
                <TooltipBubble
                  body={
                    <Text>{t('Total value of the liquidity that ApeSwap Partners own in the form of LP tokens.')}</Text>
                  }
                  width="180px"
                  transformTip="translate(25px, 0px)"
                >
                  <Svg icon="info" width="13px" />
                </TooltipBubble>
              </Flex>
            </Flex>
          </Flex>
        </>
      )}

      <Flex sx={{ maxWidth: '100%', width: '99%', height: '100%' }}>
        <Line
          data={data}
          options={{
            color: theme.colors.text,
            elements: {
              point: {
                radius: 0,
              },
            },
            scales: {
              y: {
                stacked: true,
                grid: { display: false, drawBorder: false },
                ticks: { display: false },
              },
              x: {
                grid: { display: false, drawBorder: false },
                ticks: { display: false },
              },
            },
            plugins: {
              legend: {
                display: false,
                position: 'bottom',
                fullSize: true,
                labels: {
                  color: theme.colors.text,
                  font: { family: 'poppins', weight: '600' },
                },
              },
              tooltip: {
                enabled: false,
              },
            },
            responsive: true,
            maintainAspectRatio: false,
          }}
        />
      </Flex>
    </Flex>
  )
}

export default React.memo(TreasuryHistory)
