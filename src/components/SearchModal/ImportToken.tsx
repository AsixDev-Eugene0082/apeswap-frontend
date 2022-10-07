/** @jsxImportSource theme-ui */
import React, { useState } from 'react'
import { Box } from 'theme-ui'
import { Token, Currency } from '@ape.swap/sdk'
import { Link, Tag } from '@apeswapfinance/uikit'
import { Text, Flex, Button, Checkbox, ErrorIcon } from '@ape.swap/uikit'
import { useAddUserToken } from 'state/user/hooks'
import { getEtherscanLink } from 'utils'
import truncateHash from 'utils/truncateHash'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useCombinedInactiveList } from 'state/lists/hooks'
import { ListLogo } from 'components/Logo'
import { useTranslation } from 'contexts/Localization'
import { EXTENDED_LIST_DETAILS } from 'config/constants/lists'

interface ImportProps {
  tokens: Token[]
  handleCurrencySelect?: (currency: Currency) => void
}

function ImportToken({ tokens, handleCurrencySelect }: ImportProps) {
  const { chainId } = useActiveWeb3React()

  const [confirmed, setConfirmed] = useState(false)

  const addToken = useAddUserToken()

  // use for showing import source on inactive tokens
  const inactiveTokenList = useCombinedInactiveList()

  const { t } = useTranslation()

  return (
    <Box className="boxCon" sx={{ padding: '20px 20px 20px 20px' }}>
      <Flex sx={{ flexDirection: 'column' }}>
        <Text sx={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '26px', color: 'red', lineHeight: '35px' }}>{t('Trade at your own risk!')}</h1>
          <br />
          {t(
            'The ApeSwap DEX is decentralized, meaning that anyone can create or add liquidity for a token. Unlisted tokens have not been reviewed by ApeSwap or passed our due diligence process. Unlisted tokens may present scam risks, including the loss of funds.',
          )}
          <br />
          <br />
          {t('Want to see your crypto project listed? ')}
          <br />
          <br />
          <a
            href="https://apeswap.click/partnership"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'underline' }}
          >
            {t('Apply to be listed today!')}
          </a>
        </Text>

        {tokens.map((token) => {
          const list = chainId && inactiveTokenList?.[chainId]?.[token.address]?.list
          // Extended doesn't need to be defined for each list
          const extendedLogo = EXTENDED_LIST_DETAILS[list?.name]?.logo
          const extendedName = EXTENDED_LIST_DETAILS[list?.name]?.name
          const address = token.address ? `${truncateHash(token.address)}` : null
          return (
            <Box key={token.address} sx={{ marginTop: '24px' }}>
              {list !== undefined ? (
                <Tag
                  variant="success"
                  outline
                  startIcon={
                    (list.logoURI || extendedLogo) && (
                      <ListLogo
                        logoURI={extendedLogo || list.logoURI}
                        size="12px"
                        style={{ borderRadius: '6px', marginRight: '5px' }}
                      />
                    )
                  }
                >
                  via {extendedName || list.name}
                </Tag>
              ) : (
                <Tag variant="danger" outline startIcon={<ErrorIcon color="error" />}>
                  {t('Unknown Source')}
                </Tag>
              )}
              <Flex alignItems="center">
                <Text mr="8px">{token.name}</Text>
                <Text>({token.symbol})</Text>
              </Flex>
              {chainId && (
                <Flex>
                  <Text mr="10px">{address}</Text>
                  <Link href={getEtherscanLink(token.address, 'address', chainId)} external>
                    <Text weight="bold">{t('View on explorer')}</Text>
                  </Link>
                </Flex>
              )}
            </Box>
          )
        })}

        <Flex sx={{ justifyContent: 'space-between', alignItems: 'center', marginTop: '24px' }}>
          <Flex sx={{ alignItems: 'center' }} onClick={() => setConfirmed(!confirmed)}>
            <Checkbox
              scale="sm"
              name="confirmed"
              type="checkbox"
              checked={confirmed}
              onChange={() => setConfirmed(!confirmed)}
            />
            <Text ml="8px" sx={{ userSelect: 'none' }}>
              {t('I understand')}
            </Text>
          </Flex>
          <Button
            variant="danger"
            disabled={!confirmed}
            onClick={() => {
              tokens.map((token) => addToken(token))
              if (handleCurrencySelect) {
                handleCurrencySelect(tokens[0])
              }
            }}
            className=".token-dismiss-button"
          >
            {t('Import')}
          </Button>
        </Flex>
      </Flex>
    </Box>
  )
}

export default ImportToken
