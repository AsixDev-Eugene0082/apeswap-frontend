import React, { useState } from 'react'
import { BNB, Flex, POLYGON, Text } from '@apeswapfinance/uikit'
import useIsMobile from 'hooks/useIsMobile'
import { AnimatedArrow, ChainDisplay } from '../../styles'
import ListView from '../ListView'
import { ExtendedListViewProps } from '../ListView/types'

interface ProductChainListProps {
  chain: string
  listViews: ExtendedListViewProps[]
}

const ProductChainList: React.FC<ProductChainListProps> = ({ chain, listViews }) => {
  const isMobile = useIsMobile()
  const [isOpen, setIsOpen] = useState(true)

  const toogle = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      <ChainDisplay onClick={toogle}>
        <Flex alignItems="center">
          {chain === '56' ? <BNB width={22} /> : <POLYGON width={22} />}
          <Text
            fontWeight={500}
            marginLeft={isMobile ? '10px' : '12px'}
            textTransform="uppercase"
            fontSize={isMobile ? '12px' : '16px'}
          >
            {chain === '56' ? 'BNB Chain' : 'Polygon Chain'}
          </Text>
        </Flex>
        <AnimatedArrow height={8} isOpen={isOpen} />
      </ChainDisplay>
      <ListView listViews={listViews} isOpen={isOpen} />
    </>
  )
}

export default React.memo(ProductChainList)
