const { ethers } = require('ethers')
const { NETWORK_RPC } = require('../constants')

const { BigNumber } = require('bignumber.js')

function distributeValue(total, ratios) {
  // Convert total to a BigNumber
  const totalBN = new BigNumber(total)

  // Convert ratios to BigNumbers
  const ratiosBN = ratios.map((ratio) => new BigNumber(ratio))

  // Calculate the sum of ratios
  const sumRatios = ratiosBN.reduce((acc, ratio) => acc.plus(ratio), new BigNumber(0))

  // Calculate proportional shares without rounding
  const shares = ratiosBN.map((ratio) =>
    ratio.times(totalBN).dividedBy(sumRatios).integerValue(BigNumber.ROUND_FLOOR)
  )

  // Calculate the remainder for adjustment
  let remainder = totalBN.minus(shares.reduce((acc, share) => acc.plus(share), new BigNumber(0)))

  // Adjust shares based on remainder
  for (let i = 0; i < remainder.toNumber(); i++) {
    shares[i % shares.length] = shares[i % shares.length].plus(1)
  }

  return shares.map((share) => share.toNumber())
}

async function transferTokensWithRetry(tokenContract, from, to, amount, maxRetries) {
  let retries = 0

  let success = false
  while (retries <= maxRetries) {
    try {
      // Estimate gas for the transfer function
      const estimatedGas = await tokenContract.estimateGas.transfer(to, amount)

      // Increase gas limit (e.g., 10% buffer)
      const gasLimit = estimatedGas.mul(110).div(100)

      // Call the ERC-20 transfer function with gas limit
      const transferTx = await tokenContract.transfer(to, amount, { gasLimit })

      // Wait for the transaction to be mined
      await transferTx.wait()

      console.log(`Transferred ${amount} tokens from ${from} to ${to}`)
      success = true
      return
    } catch (error) {
      success = false

      console.error(`Error transferring tokens from ${from} to ${to}:`, error.message)

      // Retry after 5 seconds
      console.log(`Retrying in 5 seconds...`)
      await new Promise((resolve) => setTimeout(resolve, 5000))

      retries++
    }
  }

  console.error(`Max retries reached. Could not complete the transfer.`)
  return success
}

// Example usage
async function runBatchTransfer(wallets, amounts, tokenAddress, chainId) {
  const nodeUrl = NETWORK_RPC[chainId]
  const provider = new ethers.providers.JsonRpcProvider(nodeUrl)
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider)

  const tokenContract = new ethers.Contract(
    tokenAddress,
    ['function transfer(address to, uint256 amount)'],
    wallet
  )

  const from = wallet.address
  //   const to = '0xRecipientAddress'
  //   const amount = 100
  const maxRetries = 3 // Set your desired max retries

  let transfers = 0

  while (transfers <= wallets?.length) {
    const result = await transferTokensWithRetry(
      tokenContract,
      from,
      wallets[transfers],
      amounts[transfers],
      maxRetries
    )
    console.log('trenafer status ', result)
    transfers += 1
    console.log('transfered wallets  ', transfers)
    console.log('remaining wallets ', wallets.length - transfers)

    if (transfers === wallets.length) {
      break
    }
  }

  console.log('batch transfer success')
}

module.exports = { runBatchTransfer, distributeValue }
