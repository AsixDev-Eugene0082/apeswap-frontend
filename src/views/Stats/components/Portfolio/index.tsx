import React from 'react'
import { useStats } from 'state/statsPage/hooks'
import { Container } from './styles'
import ProductCard from './components/ProductCard'

const Portfolio: React.FC = () => {
  const { portfolioData } = useStats()

  return (
    <Container>
      {portfolioData.map((data) => (
        <ProductCard key={data.type} productData={data} />
      ))}
    </Container>
  )
}

export default React.memo(Portfolio)
