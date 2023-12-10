const { ethers } = require('hardhat')
const { config } = require('../configs/config')

// deploy and verify accumulation contract
async function main() {
  const accumulationFactory = await ethers.getContractFactory('FirstCrypto')

  // token addresses
  const usdc = '0xBD4B78B3968922e8A53F1d845eB3a128Adc2aA12'
  const usdcPolygon = '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359'
  const usdcScroll = '0xA804CA195cAa81EE8caD0FCc33a6e1961eE096c4'
  const usdcArbitrum = '0x94Fcc9C543220544301d10cA10b9b1a4dF0eaf1F'
  const usdcMentle = '0x6A671C92762561d8Df0C2eD1EE0570FC0e3c0188'

  // contract addresses
  const goerli = '0xcF1E289f63E9cc7BFA92bC2FAfD9E76A25b491Ce'
  const scrollsepolia = '0x46b2b0eEfd25251f38f289e7a5F52D282D411FBD'
  const arbitrum = '0xF307473cb72BDcB6aDbeFDd82199ba316dA4F51e'
  const mentle = '0xd594b2e664fA78AC60b8D56f3095220F1ccd2355'
  const polygon = '0xe83C2b017449F5105656199bA34E40A646F96C33'

  // const deployParams = []
  // const accumulation = await accumulationFactory.deploy(...deployParams)
  // const tx1 = await accumulation.deployed()
  // await tx1.wait(1)
  // console.log('FirstCrypto:', accumulation.address)

  const contract = accumulationFactory.attach(mentle)

  const tx = await contract.startStrategy(usdcMentle, '100000000', 5)
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
