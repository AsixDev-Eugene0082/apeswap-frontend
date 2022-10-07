import { PageMeta } from './types'

export const DEFAULT_META: PageMeta = {
  title: 'ApeSwap : Your One-Stop DeFi Hub',
  description:
    'ApeSwap is a DeFi Hub on BNB Chain, Polygon, & Ethereum. Swap, stake, and lend cryptocurrencies, from stablecoins to altcoins - all in one place.',
  image: 'https://apeswap.finance/logo.png',
}

export const customMeta: { [key: string]: PageMeta } = {
  '/': {
    title: 'Home Page | ApeSwap: Your One-Stop DeFi Hub',
    description:
      'ApeSwap is a DeFi Hub on BNB Chain, Polygon, & Ethereum. Swap, stake, and lend cryptocurrencies, from stablecoins to altcoins - all in one place.',
  },
  '/swap': {
    title: 'Swap | ApeSwap : Your One-Stop DeFi Hub',
    description: 'Swap between hundreds of crypto tokens using our decentralized exchange.',
  },
  '/apestats': {
    title: 'ApeStats | ApeSwap : Your One-Stop DeFi Hub',
    description: 'Track your portfolio on ApeSwap using our custom dashboard.',
  },
  '/nft': {
    title: 'Non Fungible Apes | ApeSwap : Your One-Stop DeFi Hub',
    description: 'Buy and sell ApeSwap NFTs and join our NFT community.',
  },
  '/banana-farms': {
    title: 'BANANA Farms | ApeSwap : Your One-Stop DeFi Hub',
    description: 'Stake your liquidity provider (LP) tokens in BANANA Farms to earn BANANA.',
  },
  '/jungle-farms': {
    title: 'Jungle Farms | ApeSwap : Your One-Stop DeFi Hub',
    description: 'Stake your liquidity provider (LP) tokens to earn partner project tokens.',
  },
  '/pools': {
    title: 'Staking Pools | ApeSwap : Your One-Stop DeFi Hub',
    description: 'Stake BANANA in Staking Pools to earn partner project tokens.',
  },
  '/liquidity': {
    title: 'Liquidity | ApeSwap : Your One-Stop DeFi Hub',
    description: 'Add liquidity to the ApeSwap decentralized exchange to create LPs and earn trading fees.',
  },
  '/add-liquidity': {
    title: 'Liquidity | ApeSwap : Your One-Stop DeFi Hub',
    description: 'Add liquidity to the ApeSwap decentralized exchange to create LPs and earn trading fees.',
  },
  '/iao': {
    title: 'Initial Ape Offerings | ApeSwap : Your One-Stop DeFi Hub',
    description: 'Launch your crypto project with ApeSwap, or commit into Initial Ape Offerings.',
  },
  '/gnana': {
    title: 'GNANA | ApeSwap : Your One-Stop DeFi Hub',
    description: 'Convert your BANANA to GNANA to gain exclusive access to governance, pools, and more.',
  },
  '/maximizers': {
    title: 'BANANA Maximizers | ApeSwap : Your One-Stop DeFi Hub',
    description: 'Stake your liquidity provider (LP) tokens in auto-compounding vaults to earn BANANA.',
  },
  '/auction': {
    title: 'Auction | ApeSwap : Your One-Stop DeFi Hub',
  },
  '/staking': {
    title: 'NFA Staking | ApeSwap : Your One-Stop DeFi Hub',
  },
  '/treasury-bills': {
    title: 'Treasury Bills | ApeSwap : Your One-Stop DeFi Hub',
    description: 'Get BANANA and partner project tokens at a discount using your liquidity provider (LP) tokens.',
  },
  '/limit-orders': {
    title: 'Limit Orders | ApeSwap : Your One-Stop DeFi Hub',
    description: 'Trade crypto tokens at the price you want using limit orders on the ApeSwap DEX.',
  },
}
