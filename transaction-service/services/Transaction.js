const { ethers } = require('ethers')
const { transactionCache } = require('./Cache')
const { CONTRACT_ADDRESSES, NETWORK_RPC } = require('../constants')
const firstCryptoABi = require('../abis/firstCrypto.json')

const _updateOrders = async (orderIds, chainId) => {
  const pendingTransaction = transactionCache.get('pending_transaction')

  if (pendingTransaction === 'running') {
    return {
      success: false,
      hash: null,
      message: 'already running'
    }
  }
  transactionCache.set('pending_transaction', 'running', 1 * 60 * 60)

  // Create a provider and wallet (signer)
  const nodeUrl = NETWORK_RPC?.[chainId]
  const provider = new ethers.providers.JsonRpcProvider(nodeUrl)
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider)

  const contract = new ethers.Contract(
    CONTRACT_ADDRESSES.FIRST_CRYPTO?.[chainId],
    firstCryptoABi,
    wallet
  )

  const connectedContract = contract.connect(wallet)

  const estimatedGas = await connectedContract.estimateGas.updateOrderStatus(orderIds)
  const increasedGasLimit = Math.ceil(estimatedGas.toNumber() * 2)

  const gasPrice = await provider.getGasPrice()
  const tx = await connectedContract.updateOrderStatus(
    orderIds?.map((el) => parseInt(el)),
    { gasLimit: increasedGasLimit }
  )
  console.log('trx sub,itted ', tx)
  const reciept = await tx.wait(1)

  console.log('receipt ', reciept)

  return reciept
}

async function updateOrders(orderIds, chainId, maxRetries = 5, delay = 5000) {
  let retries = 0

  console.log('updating order ids ', orderIds)
  while (retries <= maxRetries) {
    try {
      const trx = await _updateOrders(orderIds, chainId)
      if (trx) {
        return trx
      }
    } catch (error) {
      console.error(`Error creating Fusion order (Retry ${retries + 1}):`, error.message)
    }

    // Retry after a delay (e.g., 5 seconds)
    console.log(`Retrying in 5 seconds...`)
    await new Promise((resolve) => setTimeout(resolve, delay))

    retries++
  }

  console.error(`Max retries reached. Could not create Fusion order.`)
  return null
}

module.exports = { updateOrders }
