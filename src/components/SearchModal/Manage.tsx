/** @jsxImportSource theme-ui */
import React, { useState } from 'react'
import { Token } from '@ape.swap/sdk'
import { Flex, Svg, Text, Toggle } from '@ape.swap/uikit'
import { TokenList } from '@uniswap/token-lists'
import { textUnderlineHover } from 'views/Dex/styles'
import { useTranslation } from 'contexts/Localization'
import ManageLists from './ManageLists'
import ManageTokens from './ManageTokens'
import { CurrencyModalView } from './types'

export default function Manage({
  setModalView,
  setImportList,
  setImportToken,
  setListUrl,
}: {
  setModalView: (view: CurrencyModalView) => void
  setImportToken: (token: Token) => void
  setImportList: (list: TokenList) => void
  setListUrl: (url: string) => void
}) {
  const [showLists, setShowLists] = useState(true)
  const { t } = useTranslation()
  return (
    <div>
      <Flex sx={{ alignItems: 'center', margin: '10px 0px 20px 0px' }}>
        <Flex
          sx={{ cursor: 'pointer', position: 'relative', width: 'fit-content', ...textUnderlineHover }}
          onClick={() => setModalView(CurrencyModalView.search)}
        >
          <Svg icon="caret" direction="left" width="8px" />
          <Text size="14px" ml="5px">
            Back
          </Text>
        </Flex>
        <Toggle
          labels={[t('LIST'), t('TOKENS')]}
          checked={!showLists}
          onChange={() => setShowLists((prev) => !prev)}
          sx={{ ml: '20px' }}
        />
      </Flex>
      {showLists ? (
        <ManageLists setModalView={setModalView} setImportList={setImportList} setListUrl={setListUrl} />
      ) : (
        <ManageTokens setModalView={setModalView} setImportToken={setImportToken} />
      )}
    </div>
  )
}
