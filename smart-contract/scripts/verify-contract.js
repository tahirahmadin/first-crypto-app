const hre = require('hardhat')

// deploy and verify rsi contract
async function main() {
  const deployParams = []

  // verify rsi contract

  // latest deployed
  // goerli : 0x8d5Ff28faDe46A2f41D38cC1854E11c958211792
  // scrollsepolia:   0x46b2b0eEfd25251f38f289e7a5F52D282D411FBD
  // arbitrum-goerli 421613 :0xF307473cb72BDcB6aDbeFDd82199ba316dA4F51e
  const deployedAddress = '0x8d5Ff28faDe46A2f41D38cC1854E11c958211792'

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
