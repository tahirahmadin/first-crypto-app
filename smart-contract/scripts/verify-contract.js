
const hre = require('hardhat')

// deploy and verify rsi contract
async function main() {

  const usdc = '0xBD4B78B3968922e8A53F1d845eB3a128Adc2aA12';
  const deployParams = [usdc];

  // verify rsi contract
  const deployedAddress = '0x78ccc7e50c7fda32CdbAa75D60EccB182cFC45C6'

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
