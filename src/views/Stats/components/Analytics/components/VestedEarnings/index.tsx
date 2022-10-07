import React from 'react'
import { Flex, Svg, Text } from '@apeswapfinance/uikit'

import { useTranslation } from 'contexts/Localization'
import { useStats } from 'state/statsPage/hooks'
import useIsMobile from 'hooks/useIsMobile'

import getTimePeriods from 'utils/getTimePeriods'

import { Tooltip } from '../../../Tooltip'
import CardValue from '../../../CardValue'
import { NoContentPlaceholder } from 'views/Stats/components/NoContentPlaceholder'

import { StyledTable, TableContainer, TableHeading } from '../../styles'

export const VestedEarnings: React.FC = () => {
  const isMobile = useIsMobile()
  const { t } = useTranslation()
  const { stats } = useStats()

  const vestedProducts = stats.userStats
    .reduce((acc, curr) => {
      curr?.bills && acc.push(...curr.bills)
      curr?.iaos && acc.push(...curr.iaos)

      return acc
    }, [])
    .sort((a, b) => (a.vestingTimeRemaining > b.vestingTimeRemaining ? -1 : 1))

  return vestedProducts?.length ? (
    <>
      <TableHeading>
        <Text>{t('Product')}</Text>
        <Flex alignItems="center" justifyContent="center" style={{ gap: '8px' }}>
          {t('Vesting Time')}
          <Tooltip content={t('Time remaining until an asset is fully vested.')}>
            <Svg icon="question" color="text" width={12} />
          </Tooltip>
        </Flex>
        <Text>{t('Claimable')}</Text>
      </TableHeading>

      <TableContainer>
        <StyledTable>
          <tbody style={{ fontWeight: 500, lineHeight: '20px', fontSize: isMobile && '10px' }}>
            {vestedProducts.map((vesting) => {
              const timeUntilEnd =
                vesting.vestingTimeRemaining > 0 ? getTimePeriods(vesting.vestingTimeRemaining, true) : null

              return (
                <tr key={'billId' in vesting ? vesting.billId : vesting.id}>
                  <td>
                    {'billId' in vesting
                      ? `${vesting.type} Bill #${vesting.billId}`
                      : `${vesting.earnToken?.symbol} IAO (${vesting.type})`}
                  </td>
                  <td>
                    {timeUntilEnd
                      ? `${timeUntilEnd.days}d ${timeUntilEnd.hours}h ${timeUntilEnd.minutes}m`
                      : 'Fully Vested'}
                  </td>
                  <td>
                    <CardValue
                      fontSize={isMobile ? '10px' : '12px'}
                      fontWeight={500}
                      value={vesting.earnedBalance}
                      suffix={vesting.earnToken?.symbol}
                    />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </StyledTable>
      </TableContainer>
    </>
  ) : (
    <NoContentPlaceholder mt="36px" />
  )
}
