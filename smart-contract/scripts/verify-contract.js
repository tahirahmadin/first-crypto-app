const hre = require('hardhat')

// deploy and verify rsi contract
async function main() {
  const deployParams = []

  // verify rsi contract

  // latest deployed
  // goerli : 0xcF1E289f63E9cc7BFA92bC2FAfD9E76A25b491Ce
  // scrollsepolia:   0x46b2b0eEfd25251f38f289e7a5F52D282D411FBD
  // arbitrum-goerli 421613 :0xF307473cb72BDcB6aDbeFDd82199ba316dA4F51e
  // polygon:  0xe83C2b017449F5105656199bA34E40A646F96C33
  // mentle: 0xd594b2e664fA78AC60b8D56f3095220F1ccd2355
  const deployedAddress = '0xe83C2b017449F5105656199bA34E40A646F96C33'

  await hre.run('verify:verify', {
    address: deployedAddress,
    constructorArguments: [...deployParams]
  })
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
