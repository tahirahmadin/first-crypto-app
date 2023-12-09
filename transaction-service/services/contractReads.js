const { ethers } = require('ethers')
const { CONTRACT_ADDRESSES, NETWORK_RPC } = require('../constants')
const firstCryptoABi = require('../abis/firstCrypto.json')

const getPendingOrders = async (chainId) => {
  try {
    const nodeUrl = NETWORK_RPC[chainId]
    const provider = new ethers.providers.JsonRpcProvider(nodeUrl)
    // const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    const contract = new ethers.Contract(
      CONTRACT_ADDRESSES.FIRST_CRYPTO?.[chainId],
      firstCryptoABi,
      provider
    )

    //: add blocktime stamp to apply filters based on timestamp on orders
    const blockTimestamp = 0

    const pendingOrders = await contract.getPendingOrders(blockTimestamp)

    // end transaction
    const formattedOrders = pendingOrders?.map((ele) => {
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

    return formattedOrders
  } catch (error) {
    console.log('pending orders error ', error)

    return []
  }
}

module.exports = { getPendingOrders }
