const { ethers } = require("hardhat");
const { toWei } = require('./helpers')

// prepare dummy contract data
async function deployFixture() {
  const usdtFact = await ethers.getContractFactory('FaucetToken')
  const usdtContract = await usdtFact.deploy()
  await usdtContract.deployed()

  const sleepFact = await ethers.getContractFactory('FaucetToken')
  const sleepContract = await sleepFact.deploy()
  await sleepContract.deployed()

  await sleepContract.mint(toWei('1000000'))
  await usdtContract.mint(toWei('1000000'))

  console.log('usdt contrac ', usdtContract.address)

  const accumulationFactory = await ethers.getContractFactory('FirstCrypto')

  const [owner, addr1, addr2, addr3, addr4] = await ethers.getSigners()

  const accumulationContract = await accumulationFactory.deploy(usdtContract.address)

  await accumulationContract.deployed()

  // transfer 1000 usdt to addr1
  await usdtContract.transfer(addr1.address, toWei('1000'))
  await usdtContract.transfer(addr2.address, toWei('1000'))
  await usdtContract.transfer(addr3.address, toWei('1000'))
  await usdtContract.transfer(addr4.address, toWei('1000'))

  return {
    accumulationContract,
    usdtContract,
    sleepContract,
    owner,
    addr1,
    addr2,
    addr3, 
    addr4
  }
}

module.exports = { deployFixture };
