/** @jsxImportSource theme-ui */
import { Token } from '@ape.swap/sdk'
import React, { useCallback } from 'react'
import LpList from './LpList'

interface DisplayRowsProps {
  tokens?: { currencyA: Token; currencyB: Token }[]
  onSelect: (currencyA: Token, currencyB: Token) => void
}

const DisplayRows: React.FC<DisplayRowsProps> = ({ tokens, onSelect }) => {
  const getLPListRows = useCallback(() => {
    return <LpList tokens={tokens} onSelect={onSelect} />
  }, [onSelect, tokens])

  return <>{getLPListRows()}</>
}

export default React.memo(DisplayRows)
