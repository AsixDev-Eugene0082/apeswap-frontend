import React from 'react'
import { Button, Flex, useModal } from '@apeswapfinance/uikit'
import Page from 'components/layout/Page'
import MoonPayIframe from './MoonFrame'
import MoonPayModal from './MoonpayModal'

export default function Topup() {
  const [onPresentModal] = useModal(<MoonPayModal />)

  return (
    <Page>
      <Flex justifyContent="center" mb="20px" mt="20px">
        <Button onClick={() => onPresentModal()} margin="10px">
          Modal
        </Button>
      </Flex>
      <MoonPayIframe />
    </Page>
  )
}
