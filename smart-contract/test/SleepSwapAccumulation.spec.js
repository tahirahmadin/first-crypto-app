const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers')
const { expect } = require('chai')
const BigNumber = require('bignumber.js')
const { toWei, fromWei, MIN_AMOUNT } = require('./helpers')
const { deployFixture } = require('./deployFixture')
const { ethers } = require('hardhat')

// const usdtFaucet = "0xE118429D095de1a93951c67D04B523fE5cbAB62c";
// const routerAddress = "0xE592427A0AEce92De3Edee1F18E0157C05861564"; // unswap router
// const sleepToken = "0xb94d207a3fBdb312cef2e5dBEb7C22A76516BE37";

// test cases for the contract

// start order and funds transferred correctly
// upi update functions
// order status update functions


describe('Start order ', function () {
  it('Initialize ', async function () {
    const { accumulationContract, owner } = await loadFixture(deployFixture)

    console.log('contract ', accumulationContract.address)
    console.log('owner ', owner.address)
    const isManager = await accumulationContract.managers(owner.address)

    expect(isManager.toString()).to.equal('1')
  })

  it('new account can start strategy', async function () {
    const { sleepContract, owner, addr1, accumulationContract, usdtContract } = await loadFixture(
      deployFixture
    )

    await usdtContract.transfer(addr1.address, toWei('1000'))
    await usdtContract.connect(addr1).approve(accumulationContract.address, toWei('1000'))

    const ownerUsdtBalBefore = await usdtContract.balanceOf(owner.address)

    console.log('owner balance before  ', fromWei(ownerUsdtBalBefore.toString()))
    const trx = await accumulationContract
      .connect(addr1)
      .startStrategy(sleepContract.address, toWei('10'), 5)
    const userOrder = await accumulationContract.orders(1)
    const count = await accumulationContract.ordersCount()

    const ownerUsdtBalAfter = await usdtContract.balanceOf(owner.address)

    console.log('owner balance after  ', fromWei(ownerUsdtBalAfter.toString()))
    console.log(
      'owner bal diff',
      new BigNumber(ownerUsdtBalAfter.toString()).minus(ownerUsdtBalBefore.toString()).toString()
    )

    console.log('order created ', userOrder)
    console.log('total orders ', count)

    const userOrders = await accumulationContract.getUserOrders(addr1.address, usdtContract.address);
    console.log('user order ', userOrders)
    const userOrders2 = await accumulationContract.getUserOrders(owner.address, usdtContract.address );
    console.log('user order2 ', userOrders2);

  // Get the current block number

    const blockNumber = await ethers.provider.getBlockNumber();

    // Get the block information
    const block = await ethers.provider.getBlock(blockNumber);

    // Retrieve the timestamp from the block
    const timestamp = block.timestamp;
    console.log('timestamp ', timestamp);
    const filteredOrders = await accumulationContract.getPendingOrders(timestamp);
    console.log('filtered orders ', filteredOrders)


  })

  it('multiple accounts can start strategy', async function () {
    const { sleepContract, owner, addr1,addr2,addr3,addr4 ,   accumulationContract, usdtContract } = await loadFixture(
      deployFixture
    )

    await usdtContract.transfer(addr1.address, toWei('1000'))
    await usdtContract.connect(addr1).approve(accumulationContract.address, toWei('1000'))
    await usdtContract.connect(addr2).approve(accumulationContract.address, toWei('1000'))
    await usdtContract.connect(addr3).approve(accumulationContract.address, toWei('1000'))
    await usdtContract.connect(addr4).approve(accumulationContract.address, toWei('1000'))

    const ownerUsdtBalBefore = await usdtContract.balanceOf(owner.address)

    console.log('owner balance before  ', fromWei(ownerUsdtBalBefore.toString()))
    const trx = await accumulationContract
      .connect(addr1)
      .startStrategy(sleepContract.address, toWei('10'), 5)
      const trx2 = await accumulationContract
      .connect(addr2)
      .startStrategy(sleepContract.address, toWei('10'), 5)
      const trx3 = await accumulationContract
      .connect(addr3)
      .startStrategy(sleepContract.address, toWei('10'), 5)
      const trx4 = await accumulationContract
      .connect(addr4)
      .startStrategy(sleepContract.address, toWei('10'), 5)
    const userOrder = await accumulationContract.orders(1)
    const count = await accumulationContract.ordersCount()

    const ownerUsdtBalAfter = await usdtContract.balanceOf(owner.address)

    console.log('owner balance after  ', fromWei(ownerUsdtBalAfter.toString()))
    console.log(
      'owner bal diff',
      new BigNumber(ownerUsdtBalAfter.toString()).minus(ownerUsdtBalBefore.toString()).toString()
    )

    console.log('order created ', userOrder)
    console.log('total orders ', count)

    const userOrders = await accumulationContract.getUserOrders(addr1.address, usdtContract.address);
    console.log('user order ', userOrders)
    const userOrders2 = await accumulationContract.getUserOrders(owner.address, usdtContract.address );
    console.log('user order2 ', userOrders2);

  // Get the current block number

    const blockNumber = await ethers.provider.getBlockNumber();

    // Get the block information
    const block = await ethers.provider.getBlock(blockNumber);

    // Retrieve the timestamp from the block
    const timestamp = block.timestamp;
    console.log('timestamp ', timestamp);
    const filteredOrders = await accumulationContract.getPendingOrders(timestamp);
    console.log('filtered orders ', filteredOrders)


  })

  it('manager can update order status in batch', async function () {
    const { sleepContract, owner, addr1,addr2,addr3,addr4 ,   accumulationContract, usdtContract } = await loadFixture(
      deployFixture
    )

    await usdtContract.transfer(addr1.address, toWei('1000'))
    await usdtContract.connect(addr1).approve(accumulationContract.address, toWei('1000'))
    await usdtContract.connect(addr2).approve(accumulationContract.address, toWei('1000'))
    await usdtContract.connect(addr3).approve(accumulationContract.address, toWei('1000'))
    await usdtContract.connect(addr4).approve(accumulationContract.address, toWei('1000'))

    const ownerUsdtBalBefore = await usdtContract.balanceOf(owner.address)

    // console.log('owner balance before  ', fromWei(ownerUsdtBalBefore.toString()))
    const trx = await accumulationContract
      .connect(addr1)
      .startStrategy(sleepContract.address, toWei('10'), 5)
      const trx2 = await accumulationContract
      .connect(addr2)
      .startStrategy(sleepContract.address, toWei('10'), 5)
      const trx3 = await accumulationContract
      .connect(addr3)
      .startStrategy(sleepContract.address, toWei('10'), 5)
      const trx4 = await accumulationContract
      .connect(addr4)
      .startStrategy(sleepContract.address, toWei('10'), 5)
    const userOrder = await accumulationContract.orders(1)
    const count = await accumulationContract.ordersCount()


    console.log('order created ', userOrder)
    console.log('total orders ', count)

    const blockNumber = await ethers.provider.getBlockNumber();

    // Get the block information
    const block = await ethers.provider.getBlock(blockNumber);

    // Retrieve the timestamp from the block
    const timestamp = block.timestamp;
    console.log('timestamp ', timestamp);
    const filteredOrders = await accumulationContract.getPendingOrders(timestamp);
    console.log('filtered orders ', filteredOrders)

    // execute first 2 orders once
   await accumulationContract
    .connect(owner)
    .updateOrderStatus([1,3])

    const filteredOrders2 = await accumulationContract.getPendingOrders(timestamp);
    console.log('filtered orders after update ', filteredOrders2)



        // execute first 2 orders 4 times
   await accumulationContract
   .connect(owner)
   .updateOrderStatus([1,3])
   await accumulationContract
   .connect(owner)
   .updateOrderStatus([1,3])
   await accumulationContract
   .connect(owner)
   .updateOrderStatus([1,3])
   await accumulationContract
   .connect(owner)
   .updateOrderStatus([1,3])  

   const filteredOrders3 = await accumulationContract.getPendingOrders(timestamp);
   console.log('filtered orders after update ', filteredOrders3)

  })

  it('upi update functions', async function () {
    const { addr1, accumulationContract } = await loadFixture(deployFixture)
    const trx = await accumulationContract.connect(addr1).updateUpi('8355038184@paytm')

    const updatedUpi = await accumulationContract.addressToUpi(addr1.address)
    const upiAddress = await accumulationContract.upiToAddress('8355038184@paytm')

    console.log('updated ', { updatedUpi, upiAddress })
    expect(updatedUpi.toString()).to.equal('8355038184@paytm')
    expect(upiAddress.toString()).to.equal(addr1.address)
  })
})
