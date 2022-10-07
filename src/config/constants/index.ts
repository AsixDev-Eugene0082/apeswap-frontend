import { JSBI, Percent, Token, ChainId, WETH } from '@ape.swap/sdk'

export enum RouterTypes {
  APE = 'APE',
  SMART = 'SMART',
  BONUS = 'BONUS',
}

export const NetworkContextName = 'NETWORK'

export const BIG_INT_ZERO = JSBI.BigInt(0)

export const WRAPPED_NATIVE_ONLY: ChainTokenList = {
  [ChainId.MAINNET]: [WETH[ChainId.MAINNET]],
  [ChainId.MATIC]: [WETH[ChainId.MATIC]],
  [ChainId.MATIC_TESTNET]: [WETH[ChainId.MATIC_TESTNET]],
  [ChainId.BSC]: [WETH[ChainId.BSC]],
  [ChainId.BSC_TESTNET]: [WETH[ChainId.BSC_TESTNET]],
}

export const MIN_BNB: JSBI = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(16)) // .01 BNB

// Default Ethereum chain tokens
export const DAI = new Token(ChainId.MAINNET, '0x6B175474E89094C44Da98b954EedeAC495271d0F', 18, 'DAI', 'Dai Stablecoin')
export const USDC = new Token(ChainId.MAINNET, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 6, 'USDC', 'USD Coin')
export const USDT = new Token(ChainId.MAINNET, '0xdAC17F958D2ee523a2206206994597C13D831ec7', 6, 'USDT', 'Tether USD')
export const AMPL = new Token(ChainId.MAINNET, '0xD46bA6D942050d489DBd938a2C909A5d5039A161', 9, 'AMPL', 'Ampleforth')
export const WBTC = new Token(ChainId.MAINNET, '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', 8, 'WBTC', 'Wrapped BTC')
export const RUNE = new Token(ChainId.MAINNET, '0x3155BA85D5F96b2d030a4966AF206230e46849cb', 18, 'RUNE', 'RUNE.ETH')
export const NFTX = new Token(ChainId.MAINNET, '0x87d73E916D7057945c9BcD8cdd94e42A6F47f776', 18, 'NFTX', 'NFTX')
export const STETH = new Token(ChainId.MAINNET, '0xDFe66B14D37C77F4E9b180cEb433d1b164f0281D', 18, 'stETH', 'stakedETH')

export const BSC: { [key: string]: Token } = {
  DAI: new Token(ChainId.BSC, '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3', 18, 'DAI', 'Dai Stablecoin'),
  USD: new Token(ChainId.BSC, '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56', 18, 'BUSD', 'Binance USD'),
  USDC: new Token(ChainId.BSC, '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d', 18, 'USDC', 'USD Coin'),
  USDT: new Token(ChainId.BSC, '0x55d398326f99059fF775485246999027B3197955', 18, 'USDT', 'Tether USD'),
  BTCB: new Token(ChainId.BSC, '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c', 18, 'BTCB', 'Bitcoin'),
  BANANA: new Token(ChainId.BSC, '0x603c7f932ED1fc6575303D8Fb018fDCBb0f39a95', 18, 'BANANA', 'ApeSwapFinance BANANA'),
  FRM: new Token(ChainId.BSC, '0xa719b8ab7ea7af0ddb4358719a34631bb79d15dc', 18, 'FRM', 'Ferrum Network Token'),
  FRMX: new Token(ChainId.BSC, '0x8523518001ad5d24b2a04e8729743c0643a316c0', 18, 'FRMX', 'FRMx Token'),
}

export const MATIC: { [key: string]: Token } = {
  USDC: new Token(ChainId.MATIC, '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', 6, 'USDC', 'USD Coin'),
  WBTC: new Token(ChainId.MATIC, '0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6', 8, 'WBTC', 'Wrapped Bitcoin'),
  DAI: new Token(ChainId.MATIC, '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063', 18, 'DAI', 'Dai Stablecoin'),
  WETH: new Token(ChainId.MATIC, '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619', 18, 'WETH', 'Wrapped Ether'),
  USDT: new Token(ChainId.MATIC, '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', 6, 'USDT', 'Tether USD'),
  TEL: new Token(ChainId.MATIC, '0xdF7837DE1F2Fa4631D716CF2502f8b230F1dcc32', 2, 'TEL', 'Telcoin'),
  SUSHI: new Token(ChainId.MATIC, '0x0b3F868E0BE5597D5DB7fEB59E1CADBb0fdDa50a', 18, 'SUSHI', 'SushiToken'),
  BANANA: new Token(ChainId.MATIC, '0x5d47bAbA0d66083C52009271faF3F50DCc01023C', 18, 'BANANA', 'BananaToken'),
  AAVE: new Token(ChainId.MATIC, '0xD6DF932A45C0f255f85145f286eA0b292B21C90B', 18, 'AAVE', 'Aave'),
  FRAX: new Token(ChainId.MATIC, '0x104592a158490a9228070E0A8e5343B499e125D0', 18, 'FRAX', 'Frax'),
  FXS: new Token(ChainId.MATIC, '0x3e121107F6F22DA4911079845a470757aF4e1A1b', 18, 'FXS', 'Frax Share'),
}

export const CHAIN_USD: { [key: number]: Token } = {
  [ChainId.BSC]: BSC.USD,
  [ChainId.MATIC]: MATIC.USDC,
  [ChainId.MAINNET]: USDC,
}

export const ZERO_PERCENT = new Percent('0')
export const ONE_HUNDRED_PERCENT = new Percent('1')

// a list of tokens by chain
type ChainTokenList = {
  readonly [chainId in ChainId]: Token[]
}

export const BIPS_BASE = JSBI.BigInt(10000)
export const BETTER_TRADE_LESS_HOPS_THRESHOLD = new Percent(JSBI.BigInt(50), BIPS_BASE)

export const PINNED_PAIRS: { readonly [chainId in ChainId]?: [Token, Token][] } = {
  [ChainId.MAINNET]: [
    [
      new Token(ChainId.MAINNET, '0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643', 8, 'cDAI', 'Compound Dai'),
      new Token(ChainId.MAINNET, '0x39AA39c021dfbaE8faC545936693aC917d5E7563', 8, 'cUSDC', 'Compound USD Coin'),
    ],
    [USDC, USDT],
    [DAI, USDT],
  ],
}

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
  ...WRAPPED_NATIVE_ONLY,
  [ChainId.BSC]: [...WRAPPED_NATIVE_ONLY[ChainId.BSC], BSC.USD, BSC.USDT],
  [ChainId.MATIC]: [...WRAPPED_NATIVE_ONLY[ChainId.MATIC], MATIC.USDC],
  [ChainId.MAINNET]: [...WRAPPED_NATIVE_ONLY[ChainId.MAINNET], DAI],
}

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  ...WRAPPED_NATIVE_ONLY,
  [ChainId.MATIC]: [...WRAPPED_NATIVE_ONLY[ChainId.MATIC], MATIC.USDC, MATIC.WBTC, MATIC.DAI, MATIC.WETH, MATIC.USDT],
  [ChainId.BSC]: [
    ...WRAPPED_NATIVE_ONLY[ChainId.BSC],
    BSC.DAI,
    BSC.USD,
    BSC.USDC,
    BSC.USDT,
    BSC.BTC,
    BSC.BANANA,
    BSC.FRM,
    BSC.FRMX,
  ],
  [ChainId.MAINNET]: [...WRAPPED_NATIVE_ONLY[ChainId.MAINNET], DAI, USDC, USDT, WBTC],
}

export const CUSTOM_BASES: { [chainId in ChainId]?: { [tokenAddress: string]: Token[] } } = {
  [ChainId.MAINNET]: {
    [AMPL.address]: [DAI, WETH[ChainId.MAINNET]],
  },
  [ChainId.MATIC]: {
    [MATIC.TEL.address]: [MATIC.SUSHI, MATIC.AAVE],
    [MATIC.FXS.address]: [MATIC.FRAX],
  },
}
/**
 * Addittional bases for specific tokens
 * @example { [WBTC.address]: [renBTC], [renBTC.address]: [WBTC] }
 */
export const ADDITIONAL_BASES: { [chainId in ChainId]?: { [tokenAddress: string]: Token[] } } = {
  [ChainId.MAINNET]: {},
}

export const SUGGESTED_BASES: ChainTokenList = {
  ...WRAPPED_NATIVE_ONLY,
  [ChainId.MATIC]: [
    ...WRAPPED_NATIVE_ONLY[ChainId.MATIC],
    MATIC.USDC,
    MATIC.WBTC,
    MATIC.DAI,
    MATIC.WETH,
    MATIC.USDT,
    MATIC.BANANA,
  ],
  [ChainId.BSC]: [...WRAPPED_NATIVE_ONLY[ChainId.BSC], BSC.DAI, BSC.USD, BSC.USDC, BSC.USDT, BSC.BTCB],
  [ChainId.MAINNET]: [...WRAPPED_NATIVE_ONLY[ChainId.MAINNET], DAI, USDC, USDT, WBTC],
}

// default allowed slippage, in bips
export const INITIAL_ALLOWED_SLIPPAGE = 50
export const INITIAL_ZAP_SLIPPAGE = 100
// 20 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 20

// one basis point
export const ONE_BIPS = new Percent(JSBI.BigInt(1), JSBI.BigInt(10000))

export const ALLOWED_PRICE_IMPACT_LOW: Percent = new Percent(JSBI.BigInt(100), BIPS_BASE) // 1%
export const ALLOWED_PRICE_IMPACT_MEDIUM: Percent = new Percent(JSBI.BigInt(300), BIPS_BASE) // 3%
export const ALLOWED_PRICE_IMPACT_HIGH: Percent = new Percent(JSBI.BigInt(500), BIPS_BASE) // 5%
// if the price slippage exceeds this number, force the user to type 'confirm' to execute
export const PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN: Percent = new Percent(JSBI.BigInt(1000), BIPS_BASE) // 10%
// for non expert mode disable swaps above this
export const BLOCKED_PRICE_IMPACT_NON_EXPERT: Percent = new Percent(JSBI.BigInt(1500), BIPS_BASE) // 15%

export { default as ifosConfig } from './ifo'

// DEFAULT MODAL CONSTANTS
export const SHOW_DEFAULT_MODAL_KEY = 'SHOW_DEFAULT_MODAL'
export const SET_DEFAULT_MODAL_KEY = 'SET_DEFAULT_MODAL'

// MODALS CONSTANTS
export const MODAL_INFO = {
  sellModal: {
    title: 'Selling BANANA?',
    supporting: 'Before You Sell...',
    description: 'Have you tried these products?',
  },
  buyModal: {
    title: "You've Got BANANA!",
    supporting: "Now You're Ready...",
    description: 'Put your new BANANA to work!',
  },
  generalHarvestModal: {
    title: "You've Earned BANANA!",
    supporting: 'Did You Know?',
    description: 'You can use your BANANA to earn more rewards:',
  },
  poolHarvestModal: {
    title: "You've Earned BANANA!",
    supporting: 'Did You Know?',
    description: 'You can use your BANANA to earn more rewards:',
  },
}

// CTA CARDS INFO
export const CTA_CARD_INFO = {
  maximizers: {
    title: 'Maximizers',
    description: 'Maximize your yields automatically',
    destination: 'https://apeswap.finance/maximizers',
  },
  pools: {
    title: 'Pools',
    description: 'Discover the next gem',
    destination: 'https://apeswap.finance/pools',
  },
  lending: {
    title: 'Lending',
    description: 'Supply, borrow, and earn',
    destination: 'https://lending.apeswap.finance',
  },
  gnana: {
    title: 'Gnana',
    description: 'Unlock exclusive utility',
    destination: 'https://apeswap.finance/gnana',
  },
  compound: {
    title: 'Compound',
    description: 'Stake your rewards to earn more',
    destination: 'https://apeswap.finance/pools',
  },
}

// CTA TYPES ENUM
export enum CTA_TYPE {
  MAXIMIZERS = 'maximizers',
  LENDING = 'lending',
  POOLS = 'pools',
  GNANA = 'gnana',
  COMPOUND = 'compound',
}

// MODAL TYPES ENUM
export enum MODAL_TYPE {
  SELLING = 'sellModal',
  BUYING = 'buyModal',
  GENERAL_HARVEST = 'generalHarvestModal',
  POOL_HARVEST = 'poolHarvestModal',
}

// SHOW MODAL TYPES IN STATE
export enum SHOW_MODAL_TYPES {
  sellModal = 'showSellModal',
  buyModal = 'showBuyModal',
  poolHarvestModal = 'showPoolHarvestModal',
  generalHarvestModal = 'showGeneralHarvestModal',
}
