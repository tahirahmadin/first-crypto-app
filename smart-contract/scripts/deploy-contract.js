const { ethers } = require('hardhat')
const { config } = require('../configs/config')

// deploy and verify accumulation contract
async function main() {
  const accumulationFactory = await ethers.getContractFactory('FirstCrypto')

  const usdc = '0xBD4B78B3968922e8A53F1d845eB3a128Adc2aA12'
  const usdcPolygon = '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359'
  const usdcScroll = '0xA804CA195cAa81EE8caD0FCc33a6e1961eE096c4'
  const usdcArbitrum = '0x94Fcc9C543220544301d10cA10b9b1a4dF0eaf1F'
  const deployParams = []
  const accumulation = await accumulationFactory.deploy(...deployParams)
  const tx1 = await accumulation.deployed()
  // await tx1.wait(1)
  console.log('FirstCrypto:', accumulation.address)

  const contract = accumulationFactory.attach(accumulation.address)

  const tx = await contract.setInputToken(usdcPolygon)
  console.log('input token set ', tx?.hash)

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
