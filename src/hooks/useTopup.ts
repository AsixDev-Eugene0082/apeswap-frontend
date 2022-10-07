import { useCallback } from 'react'
import track from 'utils/track'
import Torus, { PaymentParams } from '@toruslabs/torus-embed'
import { useToast } from 'state/hooks'
import useActiveWeb3React from './useActiveWeb3React'

const useTopup = () => {
  const { toastError, toastSuccess } = useToast()
  const { account, chainId } = useActiveWeb3React()

  const handleTopup = useCallback(async () => {
    const torus = new Torus({})
    await torus.init({
      enableLogging: false,
      showTorusButton: false,
      network: { host: 'bsc_mainnet' },
    })
    const paymentParams: PaymentParams = {
      selectedCryptoCurrency: 'BNB_BSC',
      fiatValue: 100,
    }
    if (account) paymentParams.selectedAddress = account
    try {
      // const paymentStatus = await torus.initiateTopup('moonpay', paymentParams)
      toastSuccess('Successful topup')
      track({
        event: 'topup',
        chain: chainId,
        data: {
          account,
          cat: 'moonpay',
        },
      })
    } catch (e: any) {
      toastError(e.message)
    }
  }, [account, chainId, toastError, toastSuccess])

  return { onTopup: handleTopup }
}

export default useTopup
