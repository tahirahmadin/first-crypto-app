import { ethers } from 'ethers'
import { FIRST_CRYPTO, TOKENS } from 'src/constants/addresses'
import firstCryptoAbi from '../constants/abis/firstCrypto.json'

export const getPositionInfo = async (
  provider: ethers.BrowserProvider,
  chainId: number,
  accountAddress?: string
): Promise<any> => {
  console.log('data loaded fetch ', { provider, chainId, accountAddress })
  const contract = new ethers.Contract(FIRST_CRYPTO?.[chainId], firstCryptoAbi, provider)

  const [depositBalance, orders, userUpi] = await Promise.all([
    contract.userTokenBalances(accountAddress, TOKENS.USDC?.[chainId]),
    contract.getUserOrders(accountAddress, TOKENS.USDC?.[chainId]),
    contract.addressToUpi(accountAddress)
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

  return { depositBalance: depositBalance?.toString(), formattedOrders, userUpi }
}
