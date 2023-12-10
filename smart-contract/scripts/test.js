const { ethers } = require('hardhat')

// Token addresses
const usdc = '0xBD4B78B3968922e8A53F1d845eB3a128Adc2aA12'
const usdcPolygon = '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359'
const usdcScroll = '0xA804CA195cAa81EE8caD0FCc33a6e1961eE096c4'
const usdcArbitrum = '0x94Fcc9C543220544301d10cA10b9b1a4dF0eaf1F'
const usdcMentle = '0x6A671C92762561d8Df0C2eD1EE0570FC0e3c0188'

// Contract addresses
const goerli = '0xcF1E289f63E9cc7BFA92bC2FAfD9E76A25b491Ce'
const scrollsepolia = '0x46b2b0eEfd25251f38f289e7a5F52D282D411FBD'
const arbitrum = '0xF307473cb72BDcB6aDbeFDd82199ba316dA4F51e'
const mentle = '0xd594b2e664fA78AC60b8D56f3095220F1ccd2355'
const polygon = '0xe83C2b017449F5105656199bA34E40A646F96C33'

// Set up the ethers provider and signer
const provider = new ethers.providers.JsonRpcProvider('https://rpc.testnet.mantle.xyz')
const privateKey = process.env.private_key // Replace with your private key
const wallet = new ethers.Wallet(privateKey, provider)

// Contract interfaces
const strategyInterface = new ethers.utils.Interface([
  'function startStrategy(address token, uint256 amount, uint256 duration)'
])
const erc20Interface = new ethers.utils.Interface([
  'function approve(address spender, uint256 amount)'
])

// Function to approve tokens and start the strategy
async function approveAndStartStrategy(tokenAddress, amount, strategyAddress, duration) {
  const erc20Contract = new ethers.Contract(tokenAddress, erc20Interface, wallet)
  const strategyContract = new ethers.Contract(strategyAddress, strategyInterface, wallet)
  const signers = await ethers.getSigners()
  console.log(' signers ', signers[1].address)
  try {
    // Approve tokens for the strategy contract
    const approveTx = await erc20Contract.connect(signers[1]).approve(strategyAddress, amount)
    await approveTx.wait()

    // console.log('Token Approval Transaction Hash:', approveTx.hash)

    // Start the strategy after approval
    const startTx = await strategyContract
      .connect(signers[1])
      .startStrategy(tokenAddress, amount, duration)
    const startReceipt = await startTx.wait()

    console.log('Start Strategy Transaction Hash:', startTx.hash)
    console.log('Start Strategy Transaction Receipt:', startReceipt)
  } catch (error) {
    console.error('Error approving tokens and starting strategy:', error.message)
  }
}

// Example usage
const amountToApprove = '100000000'
const strategyDuration = 5

approveAndStartStrategy(usdcMentle, amountToApprove, mentle, strategyDuration)
