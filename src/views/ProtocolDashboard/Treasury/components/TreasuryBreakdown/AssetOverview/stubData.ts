interface TotalValueLockedInterface {
  type: 'Farms' | 'Pools' | 'Jungle Farms' | 'Lending' | 'Maximizers'
  amount: number
  color: string
}

const stubData: TotalValueLockedInterface[] = [
  {
    type: 'Farms',
    amount: 123456,
    color: 'rgba(244, 190, 55, 1)',
  },
  {
    type: 'Pools',
    amount: 66456,
    color: 'rgba(84, 141, 225, 1)',
  },
  {
    type: 'Jungle Farms',
    amount: 182456,
    color: 'rgba(231, 79, 79, 1)',
  },
  {
    type: 'Lending',
    amount: 65456,
    color: 'rgba(144, 51, 246, 1)',
  },
  {
    type: 'Maximizers',
    amount: 123456,
    color: 'rgba(105, 165, 136, 1)',
  },
]

export default stubData
