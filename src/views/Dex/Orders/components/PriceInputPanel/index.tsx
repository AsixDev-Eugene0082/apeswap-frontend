/** @jsxImportSource theme-ui */
import React from 'react'
import { Currency } from '@ape.swap/sdk'
import { Text, Flex } from '@ape.swap/uikit'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { CurrencyLogo } from 'components/Logo'
import { useTranslation } from 'contexts/Localization'
import { Input as NumericalInput } from './NumericalInput'
import { styles as tokenSelectorStyles } from '../../../components/TokenSelector/styles'
import { styles } from './styles'

interface PriceInputPanelProps {
  value: string
  currentPrice?: string
  onUserInput: (value: string) => void
  inputValue: string
  inputCurrency?: Currency | null
  outputCurrency?: Currency | null
  id: string
}
const PriceInputPanel: React.FC<PriceInputPanelProps> = ({
  value,
  onUserInput,
  inputValue,
  inputCurrency,
  outputCurrency,
  currentPrice = '0',
  id,
}) => {
  const { chainId } = useActiveWeb3React()
  const { t } = useTranslation()

  return (
    <>
      <Flex sx={styles.pricePanelContainer} id={id}>
        <Flex sx={{ flexDirection: 'column' }}>
          <Text mb="5px">{t('Price')}</Text>
          <Flex sx={styles.currentButton} onClick={() => onUserInput(currentPrice)}>
            <Text size="10px" weight={600} color="primaryBright" sx={{ lineHeight: '12px', textAlign: 'center' }}>
              {t('Use Current')}
            </Text>
          </Flex>
        </Flex>
        <Flex sx={styles.priceInputContainer}>
          <NumericalInput
            id="token-price-input"
            value={value}
            onUserInput={(val) => {
              onUserInput(val)
            }}
            align="left"
          />
          <Flex
            sx={{
              ...tokenSelectorStyles.primaryFlex,
              marginRight: '10px',
              cursor: 'default',
              '&:active': { transform: 'none' },
              ':hover': { background: 'white4' },
            }}
          >
            <CurrencyLogo currency={outputCurrency} size="30px" />
            <Text sx={tokenSelectorStyles.tokenText}>{outputCurrency?.getSymbol(chainId)}</Text>
          </Flex>
        </Flex>
      </Flex>
      <Flex sx={styles.messageContainer}>
        <Text size="14px" weight={400} sx={{ textAlign: 'center' }}>
          {' '}
          {t('When')} <span sx={{ fontWeight: 700 }}> {inputCurrency?.getSymbol(chainId)} </span> {t('equals')}{' '}
          <span sx={{ fontWeight: 700 }}>
            {' '}
            {value || '0'} {outputCurrency?.getSymbol(chainId)}
          </span>
          ,{' '}
          <span sx={{ fontWeight: 700 }}>
            {' '}
            {inputValue || '0'} {inputCurrency?.getSymbol(chainId)}{' '}
          </span>{' '}
          {t('will be swapped for')}{' '}
          <span sx={{ fontWeight: 700 }}>
            {(parseFloat(value) * parseFloat(inputValue)).toString() || '0'} {outputCurrency?.getSymbol(chainId)}
          </span>{' '}
        </Text>
      </Flex>
    </>
  )
}

export default React.memo(PriceInputPanel)
