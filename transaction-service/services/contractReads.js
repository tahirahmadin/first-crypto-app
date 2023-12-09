const { ethers } = require("ethers");
const { CONTRACT_ADDRESSES, AIRNODE, NETWORK_RPC } = require("../constants");
const firstCryptoABi = require("../abis/firstCrypto.json");



const getPendingOrders = async (chainId) => {
  try {
    // const pendingTransaction = transactionCache.get("pending_transaction");

    // if (pendingTransaction === "running") {
    //   return {
    //     success: false,
    //     hash: null,
    //     message: "already running",
    //   };
    // }
    // transactionCache.set("pending_transaction", "running", 1 * 60 * 60);

    // Create a provider and wallet (signer)
    const nodeUrl = NETWORK_RPC[chainId];
    const provider = new ethers.providers.JsonRpcProvider(nodeUrl);
    // const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    const contract = new ethers.Contract(
      CONTRACT_ADDRESSES.FIRST_CRYPTO?.[chainId],
      firstCryptoABi,
      provider
    );

    //: add blocktime stamp to apply filters based on timestamp on orders
    const blockTimestamp = 0;


    const pendingOrders = await contract.getPendingOrders(blockTimestamp);
    console.log('orders ', pendingOrders);

    // end transaction

    return pendingOrders;
  } catch (error) {
    console.log('pending orders error ', error)

   
    return [];
  }
};

module.exports = { getPendingOrders};
