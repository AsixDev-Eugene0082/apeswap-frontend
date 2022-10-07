/** @jsxImportSource theme-ui */
import React, { useState } from 'react'
import { escapeRegExp } from 'utils'
import { Text, Flex, Input as NewInput } from '@ape.swap/uikit'
import { Input } from '@apeswapfinance/uikit'
import { useUserSlippageTolerance, useUserTransactionTTL } from 'state/user/hooks'
import { useTranslation } from 'contexts/Localization'
import styled from '@emotion/styled'

enum SlippageError {
  InvalidInput = 'InvalidInput',
  RiskyLow = 'RiskyLow',
  RiskyHigh = 'RiskyHigh',
}

enum DeadlineError {
  InvalidInput = 'InvalidInput',
}

const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`) // match escaped "." characters via in a non-capturing group

interface SlippageTabsProps {
  zapSettings?: boolean
}

const SlippageTabs: React.FC<SlippageTabsProps> = ({ zapSettings }) => {
  const [userSlippageTolerance, setUserSlippageTolerance] = useUserSlippageTolerance(zapSettings)
  const [ttl, setTtl] = useUserTransactionTTL()
  const [slippageInput, setSlippageInput] = useState('')
  const [deadlineInput, setDeadlineInput] = useState('')
  const { t } = useTranslation()

  const slippageInputIsValid =
    slippageInput === '' || (userSlippageTolerance / 100).toFixed(2) === Number.parseFloat(slippageInput).toFixed(2)
  const deadlineInputIsValid = deadlineInput === '' || (ttl / 60).toString() === deadlineInput

  let slippageError: SlippageError | undefined
  if (slippageInput !== '' && !slippageInputIsValid) {
    slippageError = SlippageError.InvalidInput
  } else if (slippageInputIsValid && userSlippageTolerance < 50) {
    slippageError = SlippageError.RiskyLow
  } else if (slippageInputIsValid && userSlippageTolerance > 500) {
    slippageError = SlippageError.RiskyHigh
  } else {
    slippageError = undefined
  }

  let deadlineError: DeadlineError | undefined
  if (deadlineInput !== '' && !deadlineInputIsValid) {
    deadlineError = DeadlineError.InvalidInput
  } else {
    deadlineError = undefined
  }

  const parseCustomSlippage = (value: string) => {
    if (value === '' || inputRegex.test(escapeRegExp(value))) {
      setSlippageInput(value)

      try {
        const valueAsIntFromRoundedFloat = Number.parseInt((Number.parseFloat(value) * 100).toString())
        if (!Number.isNaN(valueAsIntFromRoundedFloat) && valueAsIntFromRoundedFloat < 5000) {
          setUserSlippageTolerance(valueAsIntFromRoundedFloat)
        }
      } catch (error) {
        console.error(error)
      }
    }
  }

  const parseCustomDeadline = (value: string) => {
    setDeadlineInput(value)

    try {
      const valueAsInt: number = Number.parseInt(value) * 60
      if (!Number.isNaN(valueAsInt) && valueAsInt > 0) {
        setTtl(valueAsInt)
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Flex sx={{ flexDirection: 'column' }}>
      <Flex sx={{ flexDirection: 'column', mb: '5px' }}>
        <Flex mb="12px">
          <Text weight={500}>{t('Slippage Tolerance')}</Text>
        </Flex>
        <Flex flexWrap="wrap">
          <SelectButton
            sx={{ background: userSlippageTolerance === 10 ? 'yellow' : 'white3' }}
            onClick={() => {
              setSlippageInput('')
              setUserSlippageTolerance(10)
            }}
          >
            <Text weight={700} sx={{ lineHeight: '0px' }}>
              0.1%
            </Text>
          </SelectButton>
          <SelectButton
            sx={{ background: userSlippageTolerance === 50 ? 'yellow' : 'white3' }}
            onClick={() => {
              setSlippageInput('')
              setUserSlippageTolerance(50)
            }}
          >
            <Text weight={700} sx={{ lineHeight: '0px' }}>
              0.5%
            </Text>
          </SelectButton>
          <SelectButton
            sx={{ background: userSlippageTolerance === 100 ? 'yellow' : 'white3' }}
            onClick={() => {
              setSlippageInput('')
              setUserSlippageTolerance(100)
            }}
          >
            <Text weight={700} sx={{ lineHeight: '0px' }}>
              1.0%
            </Text>
          </SelectButton>
          <Flex sx={{ alignItems: 'center' }}>
            <Flex sx={{ alignItems: 'center', position: 'relative' }}>
              <StyledInput
                inputMode="decimal"
                pattern="^[0-9]*[.,]?[0-9]{0,2}$"
                placeholder={(userSlippageTolerance / 100).toFixed(2)}
                value={slippageInput}
                onBlur={() => {
                  parseCustomSlippage((userSlippageTolerance / 100).toFixed(2))
                }}
                onChange={(event) => {
                  if (event.currentTarget.validity.valid) {
                    parseCustomSlippage(event.target.value.replace(/,/g, '.'))
                  }
                }}
                isWarning={!slippageInputIsValid}
              />
              <Text color="yellow" weight={700} style={{ position: 'absolute', right: '10px' }}>
                %
              </Text>
            </Flex>
          </Flex>
        </Flex>
        {!!slippageError && (
          <Text weight={500} color={slippageError === SlippageError.InvalidInput ? 'error' : 'error'} mt="8px">
            {slippageError === SlippageError.InvalidInput
              ? t('Enter a valid slippage percentage')
              : slippageError === SlippageError.RiskyLow
              ? t('Your transaction may fail')
              : t('Your transaction may be frontrun')}
          </Text>
        )}
      </Flex>
      <Flex sx={{ justifyContent: 'space-between', alignItems: 'center', margin: '5px 0px' }}>
        <Text weight={500}>{t('Tx deadline (mins)')}</Text>
        <NewInput
          inputMode="numeric"
          pattern="^[0-9]+$"
          color={deadlineError && 'red'}
          onBlur={() => {
            parseCustomDeadline((ttl / 60).toString())
          }}
          sx={{
            width: '91px',
            height: '36px',
            borderRadius: '10px',
            borderColor: 'yellow',
            color: 'yellow',
            fontWeight: '700',
            textAlign: 'center',
          }}
          placeholder={(ttl / 60).toString()}
          value={deadlineInput}
          onChange={(event) => {
            if (event.currentTarget.validity.valid) {
              parseCustomDeadline(event.target.value)
            }
          }}
        />
      </Flex>
    </Flex>
  )
}

const StyledInput = styled(Input)`
  width: 100%;
  height: 36px;
  font-weight: 700;
  color: ${(props) => props.theme.colors.yellow};
  border-color: ${(props) => props.theme.colors.yellow};
`
const SelectButton = styled(Flex)`
  width: 64.67px;
  min-width: 57px;
  height: 36px;
  radius: 10px;
  color: primaryBright;
  border-radius: 10px;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  margin-right: 5px;
`

export default SlippageTabs
