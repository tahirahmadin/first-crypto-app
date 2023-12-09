const { ethers } = require('ethers')

async function transferTokensWithRetry(tokenContract, from, to, amount, maxRetries) {
  let retries = 0

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
      return // Exit the function if the transfer is successful
    } catch (error) {
      console.error(`Error transferring tokens from ${from} to ${to}:`, error.message)

      // Retry after 5 seconds
      console.log(`Retrying in 5 seconds...`)
      await new Promise((resolve) => setTimeout(resolve, 5000))

      retries++
    }
  }

  console.error(`Max retries reached. Could not complete the transfer.`)
}

// Example usage
async function main() {
  const provider = new ethers.providers.JsonRpcProvider('YOUR_ETH_NODE_URL')
  const privateKey = 'YOUR_PRIVATE_KEY'
  const wallet = new ethers.Wallet(privateKey, provider)

  const tokenAddress = 'YOUR_TOKEN_CONTRACT_ADDRESS'
  const tokenContract = new ethers.Contract(
    tokenAddress,
    ['function transfer(address to, uint256 amount)'],
    wallet
  )

  const from = wallet.address
  const to = '0xRecipientAddress'
  const amount = 100
  const maxRetries = 3 // Set your desired max retries

  await transferTokensWithRetry(tokenContract, from, to, amount, maxRetries)
}

main()
