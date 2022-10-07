/** @jsxImportSource theme-ui */
import React, { useCallback } from 'react'
import styled from 'styled-components'
import { FixedSizeList } from 'react-window'
import LpRow from './LPRow'
import { Token } from '@ape.swap/sdk'

interface LpListProps {
  tokens: { currencyA: Token; currencyB: Token }[]
  onSelect: (currencyA: Token, currencyB: Token) => void
}

const CustomFixedList = styled(FixedSizeList)`
  border-radius: 10px 0px 0px 10px;
`

const LpList: React.FC<LpListProps> = ({ tokens, onSelect }) => {
  const Row = useCallback(
    ({ data, index, style }) => {
      const tokens: { currencyA: Token; currencyB: Token } = data[index]
      const handleSelect = () => onSelect(tokens.currencyA, tokens.currencyB)
      return <LpRow style={style} tokens={tokens} onLpSelect={handleSelect} />
    },
    [onSelect],
  )

  return (
    <CustomFixedList height={300} width="100%" itemData={tokens} itemCount={tokens.length} itemSize={45}>
      {Row}
    </CustomFixedList>
  )
}

export default React.memo(LpList)
