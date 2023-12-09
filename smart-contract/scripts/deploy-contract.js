const { ethers } = require('hardhat')
const { config } = require('../configs/config')

// deploy and verify accumulation contract
async function main() {
  const accumulationFactory = await ethers.getContractFactory('FirstCrypto')

  const usdc = '0xBD4B78B3968922e8A53F1d845eB3a128Adc2aA12'
  const deployParams = [usdc]
  const accumulation = await accumulationFactory.deploy(...deployParams)
  await accumulation.deployed()
  console.log('FirstCrypto:', accumulation.address)

  // await hre.run('verify:verify', {
  //   address: accumulation.address,
  //   constructorArguments: [...deployParams]
  // })
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
