/** @jsxImportSource theme-ui */
import React, { useState } from 'react'
import { Flex } from '@apeswapfinance/uikit'
import { Modal, ModalProvider } from '@ape.swap/uikit'
import ServiceTokenDisplay from 'components/ServiceTokenDisplay'
import { Bills } from 'state/types'
import getTimePeriods from 'utils/getTimePeriods'
import ReactPlayer from 'react-player'
import { useTranslation } from 'contexts/Localization'
import {
  ActionButtonsContainer,
  BillDescriptionContainer,
  BillsImage,
  BillTitleContainer,
  ModalBodyContainer,
  StyledExit,
  StyledHeadingText,
  TopDescriptionText,
} from './styles'
import UserBillModalView from './UserBillModalView'
import { getFirstNonZeroDigits } from 'utils/roundNumber'
import Buy from '../Actions/Buy'

interface BillModalProps {
  onDismiss: () => void
  bill: Bills
}

const BuyBillModalView: React.FC<BillModalProps> = ({ onDismiss, bill }) => {
  const { t } = useTranslation()
  const { token, quoteToken, earnToken, billType, lpToken, discount, earnTokenPrice } = bill
  const discountEarnTokenPrice = earnTokenPrice - earnTokenPrice * (parseFloat(discount) / 100)

  const [billId, setBillId] = useState('')
  const [loading, setLoading] = useState(false)
  const vestingTime = getTimePeriods(parseInt(bill.vestingTime), true)

  const onHandleReturnedBillId = async (id: string) => {
    setBillId(id)
  }

  return (
    <ModalProvider>
      <Modal onDismiss={onDismiss} maxWidth="1200px" minWidth="350px" zIndex={98}>
        {billId ? (
          <UserBillModalView bill={bill} billId={billId} onDismiss={onDismiss} />
        ) : (
          <ModalBodyContainer>
            <StyledExit onClick={onDismiss}>x</StyledExit>
            <Flex alignItems="center" justifyContent="center">
              {loading && !billId ? (
                <BillsImage>
                  <ReactPlayer playing muted loop url="videos/bills-video.mp4" height="100%" width="100%" playsInline />
                </BillsImage>
              ) : (
                <BillsImage image="images/hidden-bill.png" />
              )}
            </Flex>
            <BillDescriptionContainer p="0">
              <Flex flexDirection="column">
                <BillTitleContainer>
                  <TopDescriptionText>{billType}</TopDescriptionText>
                  <Flex alignItems="center">
                    <ServiceTokenDisplay
                      token1={token.symbol}
                      token2={quoteToken.symbol}
                      token3={earnToken.symbol}
                      billArrow
                      stakeLp
                    />
                    <Flex flexDirection="column">
                      <StyledHeadingText ml="10px" bold>
                        {lpToken.symbol}
                      </StyledHeadingText>
                      <TopDescriptionText ml="12px">
                        {t('Vesting Term')}: {`${vestingTime.days}d, ${vestingTime.minutes}h, ${vestingTime.seconds}m`}
                      </TopDescriptionText>
                    </Flex>
                  </Flex>
                </BillTitleContainer>
                <Flex flexDirection="column" my={10}>
                  <Flex style={{ width: '250px' }}>
                    <TopDescriptionText>
                      {earnToken.symbol} {t('Market Price')}{' '}
                      <span style={{ textDecoration: 'line-through' }}>${getFirstNonZeroDigits(earnTokenPrice)}</span>
                    </TopDescriptionText>
                  </Flex>
                  <Flex alignItems="center">
                    <ServiceTokenDisplay token1={earnToken.symbol} />
                    <StyledHeadingText ml="10px" bold>
                      ${getFirstNonZeroDigits(discountEarnTokenPrice)} ({discount}% Discount)
                    </StyledHeadingText>
                  </Flex>
                </Flex>
              </Flex>
              <Flex flexDirection="column">
                <ActionButtonsContainer>
                  <Buy
                    bill={bill}
                    onBillId={onHandleReturnedBillId}
                    onTransactionSubmited={(trxSent) => setLoading(trxSent)}
                  />
                </ActionButtonsContainer>
              </Flex>
            </BillDescriptionContainer>
          </ModalBodyContainer>
        )}
      </Modal>
    </ModalProvider>
  )
}

export default React.memo(BuyBillModalView)
