const { ethers } = require('hardhat')

async function main() {
  const USDC = await ethers.getContractFactory('MintableERC20')

  // Deploying faucet contract
  const usdc = await USDC.deploy('USD Coin', 'USDC', 6)
  await usdc.deployed()
  console.log('USDC deployed:', usdc.address)

  // const WETH9Mocked = await ethers.getContractFactory("WETH9Mocked");
  // // Deploying sleep contract
  // const weth = await WETH9Mocked.deploy();
  // await weth.deployed();
  // console.log("weth Faucet:", weth.address);
  // const sleepContract = sleep.address;
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
