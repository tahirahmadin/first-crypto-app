import { ethers } from 'ethers'
import { FIRST_CRYPTO, TOKENS } from 'src/constants/addresses'
import firstCryptoAbi from '../constants/abis/firstCrypto.json'

export const getPositionInfo = async (
  provider: ethers.BrowserProvider,
  accountAddress?: string
): Promise<any> => {
  const contract = new ethers.Contract(FIRST_CRYPTO[5], firstCryptoAbi, provider)

  const [depositBalance, orders] = await Promise.all([
    contract.userTokenBalances(accountAddress, TOKENS.USDC[5]),
    contract.getUserOrders(accountAddress, TOKENS.USDC[5])
  ])

  const formattedOrders = orders?.map((ele: any) => {
    return {
      orderId: ele?.orderId?.toString(),
      user: ele?.user,
      tokenAddress: ele?.tokenAddress,
      depositAmount: ele?.depositAmount?.toString(),
      remainingAmount: ele?.remainingAmount?.toString(),
      fiatOrderAmount: ele?.fiatOrderAmount?.toString(),
      tokenAccumulated: ele?.tokenAccumulated?.toString(),
      grids: ele?.grids?.toString(),
      executedGrids: ele?.executedGrids?.toString(),
      open: ele?.open
    }
  })

  return { depositBalance: depositBalance?.toString(), formattedOrders }
}
