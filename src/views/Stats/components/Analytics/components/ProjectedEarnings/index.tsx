import React, { useEffect, useRef, useState } from 'react'
import { Flex, Text } from '@apeswapfinance/uikit'
import useIsMobile from 'hooks/useIsMobile'
import { useStats } from 'state/statsPage/hooks'
import { ProjectedData } from 'state/statsPage/mappings'
import { useTranslation } from 'contexts/Localization'
import { ChevronLeft, ChevronRight } from 'react-feather'
import CardValue from '../../../CardValue'

import { StyledTable, TableHeading } from '../../styles'
import { FlexScroll, Indicator, ScrollMenu, Tab } from './styles'

const tabOptions = ['Total', 'BANANA Farms', 'Pools', 'Jungle Farms', 'Lending', 'Maximizers']

export const ProjectedEarnings: React.FC = () => {
  const { t } = useTranslation()
  const isMobile = useIsMobile()
  const { projectedData } = useStats()
  const [selectedTab, setSelectedTab] = useState('Total')
  const [filteredProjected, setFilteredProjected] = useState<ProjectedData>(
    projectedData.find((product) => product.type.toLowerCase() === 'total'),
  )
  const [width, setWidth] = useState(0)
  const [left, setLeft] = useState(0)
  const refs = useRef([])

  const handleActiveTab = (el: HTMLDivElement, tab: string) => {
    setLeft(el.offsetLeft)
    setWidth(el.offsetWidth)
    el.focus()
    setSelectedTab(tab)
    setFilteredProjected(projectedData.find((product) => product.type === tab.toLowerCase()))
  }

  const handleNavigateRight = (currentTab: string) => {
    const currentIndex = tabOptions.findIndex((tab) => tab === currentTab)
    if (currentIndex < 5) handleActiveTab(refs.current[currentIndex + 1], tabOptions[currentIndex + 1])
  }

  const handleNavigateLeft = (currentTab: string) => {
    const currentIndex = tabOptions.findIndex((tab) => tab === currentTab)
    if (currentIndex > 0) handleActiveTab(refs.current[currentIndex - 1], tabOptions[currentIndex - 1])
  }

  useEffect(() => {
    setLeft(refs.current[0].offsetLeft)
    setWidth(refs.current[0].offsetWidth)
  }, [])

  return (
    <>
      <FlexScroll>
        <ChevronLeft strokeWidth={3} cursor="pointer" onClick={() => handleNavigateLeft(selectedTab)} />
        <ScrollMenu>
          <Indicator style={{ left, width }} />
          {tabOptions.map((tab, index) => (
            <Tab
              key={tab}
              ref={(element: HTMLDivElement) => {
                refs.current[index] = element
              }}
              onClick={() => handleActiveTab(refs.current[index], tab)}
              autoFocus
              tabIndex={-1}
            >
              {tab}
            </Tab>
          ))}
        </ScrollMenu>
        <ChevronRight strokeWidth={3} cursor="pointer" onClick={() => handleNavigateRight(selectedTab)} />
      </FlexScroll>

      <>
        <Flex flexDirection="column" marginTop={isMobile ? '16px' : '6px'} alignItems="center" justifyContent="center">
          <Text fontSize="12px" fontWeight={500} style={{ opacity: 0.6 }}>
            {t('Amount Staked')}
          </Text>
          <CardValue
            fontSize="22px"
            fontWeight={700}
            decimals={2}
            value={filteredProjected?.amountStaked || 0}
            prefix="$"
          />
        </Flex>

        <TableHeading>
          <Text>{t('Timeframe')}</Text>
          <Text>{t('Return')}</Text>
          <Text>{t('Estimated Earnings')}</Text>
        </TableHeading>

        <StyledTable>
          <tbody>
            <tr>
              <td>1d</td>
              <td>
                <CardValue
                  fontSize="12px"
                  fontWeight={700}
                  decimals={2}
                  value={filteredProjected?.roi.daily > 10000 ? 10000 : filteredProjected?.roi.daily ?? 0}
                  prefix={filteredProjected?.roi.daily > 10000 ? '>' : null}
                  suffix="%"
                />
              </td>
              <td>
                <CardValue
                  fontSize="12px"
                  fontWeight={700}
                  value={filteredProjected?.projectedEarnings.daily ?? 0}
                  prefix="$"
                />
              </td>
            </tr>
            <tr>
              <td>7d</td>
              <td>
                <CardValue
                  fontSize="12px"
                  fontWeight={700}
                  decimals={2}
                  value={filteredProjected?.roi.weekly > 1000 ? 1000 : filteredProjected?.roi.weekly ?? 0}
                  prefix={filteredProjected?.roi.weekly > 1000 ? '>' : null}
                  suffix="%"
                />
              </td>
              <td>
                <CardValue
                  fontSize="12px"
                  fontWeight={700}
                  value={filteredProjected?.projectedEarnings.weekly ?? 0}
                  prefix={filteredProjected?.projectedEarnings.weekly > 1e4 ? '> $' : '$'}
                />
              </td>
            </tr>
            <tr>
              <td>30d</td>
              <td>
                <CardValue
                  fontSize="12px"
                  fontWeight={700}
                  decimals={2}
                  value={filteredProjected?.roi.monthly > 1e4 ? 1e4 : filteredProjected?.roi.monthly ?? 0}
                  prefix={filteredProjected?.projectedEarnings.monthly > 1e4 ? '>' : null}
                  suffix="%"
                />
              </td>
              <td>
                <CardValue
                  fontSize="12px"
                  fontWeight={700}
                  value={
                    filteredProjected?.projectedEarnings.monthly > 1e4
                      ? 1e4
                      : filteredProjected?.projectedEarnings.monthly ?? 0
                  }
                  prefix={filteredProjected?.projectedEarnings.monthly > 1e4 ? '> $' : '$'}
                />
              </td>
            </tr>
            <tr>
              <td>365d</td>
              <td>
                <CardValue
                  fontSize="12px"
                  fontWeight={700}
                  decimals={2}
                  value={filteredProjected?.roi.yearly > 1e5 ? 1e5 : filteredProjected?.roi.yearly ?? 0}
                  prefix={filteredProjected?.roi.yearly > 1e5 ? '>' : null}
                  suffix="%"
                />
              </td>
              <td>
                <CardValue
                  fontSize="12px"
                  fontWeight={700}
                  value={
                    filteredProjected?.projectedEarnings.yearly > 1e6
                      ? 1e6
                      : filteredProjected?.projectedEarnings.yearly ?? 0
                  }
                  prefix={filteredProjected?.projectedEarnings.yearly > 1e6 ? '> $' : '$'}
                />
              </td>
            </tr>
          </tbody>
        </StyledTable>
      </>
    </>
  )
}
