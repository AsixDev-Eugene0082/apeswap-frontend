import erc20ABI from 'config/abi/erc20.json'
import billAbi from 'config/abi/bill.json'
import { BillsConfig } from 'config/constants/types'
import multicall from 'utils/multicall'
import BigNumber from 'bignumber.js'
import { UserBill } from 'state/types'
import getBillNftData from './getBillNftData'

export const fetchBillsAllowance = async (chainId: number, account: string, bills: BillsConfig[]) => {
  const calls = bills.map((b) => ({
    address: b.lpToken.address[chainId],
    name: 'allowance',
    params: [account, b.contractAddress[chainId]],
  }))
  const allowances = await multicall(chainId, erc20ABI, calls)
  return bills.reduce((acc, bill, index) => ({ ...acc, [bill.index]: new BigNumber(allowances[index]).toString() }), {})
}

export const fetchUserBalances = async (chainId: number, account: string, bills: BillsConfig[]) => {
  const calls = bills.map((b) => ({
    address: b.lpToken.address[chainId],
    name: 'balanceOf',
    params: [account],
  }))
  const tokenBalancesRaw = await multicall(chainId, erc20ABI, calls)
  const tokenBalances = bills.reduce(
    (acc, bill, index) => ({ ...acc, [bill.index]: new BigNumber(tokenBalancesRaw[index]).toString() }),
    {},
  )

  return tokenBalances
}

export const fetchUserOwnedBillNftData = async (ownedBillsData: { id: string; billNftAddress: string }[], chainId) => {
  const billNftData = ownedBillsData?.map(async ({ id, billNftAddress }) => {
    return { id, data: await getBillNftData(id, billNftAddress, chainId) }
  })
  return Promise.all(billNftData)
}

export const fetchUserOwnedBills = async (
  chainId: number,
  account: string,
  bills: BillsConfig[],
): Promise<UserBill[]> => {
  const billIdCalls = bills.map((b) => ({
    address: b.contractAddress[chainId],
    name: 'getBillIds',
    params: [account],
  }))
  const billIds = await multicall(chainId, billAbi, billIdCalls)
  const billsPendingRewardCall = []
  const billDataCalls = []
  billIds.map((idArray, index) =>
    idArray[0].map(
      (id: BigNumber) =>
        id.gt(0) &&
        (billDataCalls.push({ address: bills[index].contractAddress[chainId], name: 'billInfo', params: [id] }),
        billDataCalls.push({ address: bills[index].contractAddress[chainId], name: 'billNft' }),
        billsPendingRewardCall.push({
          address: bills[index].contractAddress[chainId],
          name: 'pendingPayoutFor',
          params: [id],
        })),
    ),
  )
  const billData = await multicall(chainId, billAbi, billDataCalls)
  const pendingRewardsCall = await multicall(chainId, billAbi, billsPendingRewardCall)

  const result = []

  for (let i = 0; i < billsPendingRewardCall.length; i++) {
    const billDataPos = i === 0 ? 0 : i * 2
    const data = {
      address: billsPendingRewardCall[i].address,
      id: billsPendingRewardCall[i].params[0].toString(),
      payout: billData[billDataPos][0].toString(),
      billNftAddress: billData[billDataPos + 1][0].toString(),
      vesting: billData[billDataPos][1].toString(),
      lastBlockTimestamp: billData[billDataPos][2].toString(),
      truePricePaid: billData[billDataPos][3].toString(),
      pendingRewards: pendingRewardsCall[i][0].toString(),
    }
    result.push(data)
  }

  return result
}
