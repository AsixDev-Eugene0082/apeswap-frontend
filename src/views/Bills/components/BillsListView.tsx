/** @jsxImportSource theme-ui */
import React from 'react'
import { Flex, TooltipBubble, Text, InfoIcon, useMatchBreakpoints } from '@ape.swap/uikit'
import ListView from 'components/ListView'
import { Bills } from 'state/types'
import UnlockButton from 'components/UnlockButton'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { ExtendedListViewProps } from 'components/ListView/types'
import ListViewContent from 'components/ListViewContent'
import getTimePeriods from 'utils/getTimePeriods'
import { useTranslation } from 'contexts/Localization'
import BigNumber from 'bignumber.js'
import { Container } from './styles'
import BillModal from './Modals'
import ProjectLinks from './UserBillViews/ProjectLinks'

const BillsListView: React.FC<{ bills: Bills[] }> = ({ bills }) => {
  const { account } = useActiveWeb3React()
  const { t } = useTranslation()
  const { isXl, isXxl } = useMatchBreakpoints()
  const isMobile = !isXl && !isXxl
  const billsListView = bills.map((bill) => {
    const { earnToken, token, quoteToken, maxTotalPayOut, totalPayoutGiven, earnTokenPrice } = bill
    const vestingTime = getTimePeriods(parseInt(bill.vestingTime), true)
    const available = new BigNumber(maxTotalPayOut)
      ?.minus(new BigNumber(totalPayoutGiven))
      ?.div(new BigNumber(10).pow(earnToken.decimals))

    const threshold = new BigNumber(5).div(earnTokenPrice)
    const disabled = available.lte(threshold)

    return {
      tokens: { token1: token.symbol, token2: quoteToken.symbol, token3: earnToken.symbol },
      stakeLp: true,
      id: bill.index,
      billArrow: true,
      title: (
        <ListViewContent
          title={t(bill.billType)}
          value={bill.lpToken.symbol}
          width={isMobile ? 120 : 150}
          height={45}
          ml={10}
        />
      ),
      infoContent: isMobile && <ProjectLinks website={bill?.projectLink} twitter={bill?.twitter} t={t} isMobile />,
      ttWidth: isMobile && '200px',
      toolTipIconWidth: isMobile && '20px',
      toolTipStyle: isMobile && { marginTop: '12px', marginRight: '10px' },
      infoContentPosition: 'translate(10%, 0%)',
      cardContent: (
        <>
          <ListViewContent
            title={t('Price')}
            value={disabled ? 'N/A' : `$${bill?.priceUsd}`}
            width={isMobile ? 90 : 120}
            ml={20}
            height={52.5}
            toolTip={t('This is the current discounted price of the tokens.')}
            toolTipPlacement="bottomLeft"
            toolTipTransform="translate(13%, 0%)"
          />
          <ListViewContent
            title={t('Discount')}
            valueColor={disabled ? null : parseFloat(bill?.discount) < 0 ? '#DF4141' : '#38A611'}
            value={disabled ? 'N/A' : `${bill?.discount}%`}
            width={isMobile ? 90 : 120}
            height={52.5}
            toolTip={
              parseFloat(bill?.discount) < 0
                ? t("This is the percentage discount relative to the token's current market price.")
                : t("This is the percentage discount relative to the token's current market price.")
            }
            toolTipPlacement="bottomLeft"
            toolTipTransform={parseFloat(bill?.discount) < 0 ? 'translate(25, 0%)' : 'translate(23%, 0%)'}
          />
          <ListViewContent
            title={t('Vesting Term')}
            value={`${vestingTime.days}d, ${vestingTime.minutes}h, ${vestingTime.seconds}m`}
            width={isMobile ? 120 : 120}
            height={52.5}
            toolTip={t('This is how long it will take for all tokens in the Bill to fully vest.')}
            toolTipPlacement={isMobile ? 'bottomRight' : 'bottomLeft'}
            toolTipTransform={isMobile ? 'translate(13%, 0%)' : 'translate(39%, 0%)'}
          />
          {!isMobile && (
            <>
              <Flex style={{ height: '100%', alignItems: 'center' }}>
                {account ? (
                  <BillModal
                    bill={bill}
                    buttonText={disabled ? t('SOLD OUT') : t('BUY')}
                    id={bill.index}
                    buyFlag
                    disabled={!bill.discount || bill.discount.includes('NaN') || disabled}
                  />
                ) : (
                  <UnlockButton />
                )}
              </Flex>
              <Flex sx={{ alignItems: 'center', height: '100%' }}>
                <Flex sx={{ alignItems: 'flex-start' }}>
                  <div style={{ display: 'inline-block' }}>
                    <TooltipBubble
                      placement="bottomRight"
                      transformTip="translate(8%, -2%)"
                      body={<ProjectLinks website={bill?.projectLink} twitter={bill?.twitter} t={t} />}
                    >
                      <InfoIcon width="24px" />
                    </TooltipBubble>
                  </div>
                </Flex>
              </Flex>
            </>
          )}
        </>
      ),
      expandedContentSize: 100,
      expandedContent: isMobile && (
        <Flex sx={{ alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%' }}>
          {account ? (
            <BillModal
              bill={bill}
              buttonText={disabled ? t('SOLD OUT') : t('BUY')}
              id={bill.index}
              buyFlag
              disabled={!bill.discount || bill.discount.includes('NaN') || disabled}
            />
          ) : (
            <UnlockButton />
          )}
        </Flex>
      ),
    } as ExtendedListViewProps
  })

  return (
    <Container>
      <Text margin="20px 10px">{t('Available Treasury Bills')}</Text>
      <ListView listViews={billsListView} />
    </Container>
  )
}

export default React.memo(BillsListView)
