const { ethers } = require('ethers')
const { transactionCache } = require('./Cache')
const { CONTRACT_ADDRESSES } = require('../constants')
const sleepSwapAbi = require('../abis/sleepSwap.json')

const batchTransfer = async (users, amounts) => {
  try {
    const pendingTransaction = transactionCache.get('pending_transaction')

    // if (pendingTransaction === "running") {
    //   return {
    //     success: false,
    //     hash: null,
    //     message: "already running",
    //   };
    // }
    // transactionCache.set("pending_transaction", "running", 1 * 60 * 60);

    // // Create a provider and wallet (signer)
    // const nodeUrl = "https://polygon-rpc.com/";
    // const provider = new ethers.providers.JsonRpcProvider(nodeUrl);
    // const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    // const contract = new ethers.Contract(
    //   CONTRACT_ADDRESSES.SLEEP_SWAP[137],
    //   sleepSwapAbi,
    //   wallet
    // );

    // const connectedContract = contract.connect(wallet);

    // const estimatedGas = await connectedContract.estimateGas.executeOrders(
    //   orderIds
    // );
    // const increasedGasLimit = Math.ceil(estimatedGas.toNumber() * 2);

    // const gasPrice = await provider.getGasPrice();
    // const tx = await connectedContract.executeOrders(orderIds, {
    //   gasLimit: increasedGasLimit,
    //   gasPrice: gasPrice * 10,
    // });
    // console.log("trx sub,itted ", tx);
    // const reciept = await tx.wait(1);

    // console.log("receipt ", reciept);

    // // end transaction

    // return reciept;
  } catch (error) {
    console.log({ error })
    const result = { success: false, hash: null, message: error }
    return result
  } finally {
    transactionCache.set('pending_transaction', 'completed', 1 * 60 * 60)
  }
}

module.exports = { batchTransfer }
