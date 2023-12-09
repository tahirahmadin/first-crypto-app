const { ethers } = require("ethers");

async function getCurrentBlockTimestamp() {
  const polygonNodeUrl = "https://polygon-rpc.com"; // Replace with your Infura project ID or your Polygon node URL
  const provider = new ethers.providers.JsonRpcProvider(polygonNodeUrl);

  // Get the current block number
  const currentBlockNumber = await provider.getBlockNumber();

  // Get the current block
  const currentBlock = await provider.getBlock(currentBlockNumber);

  // Get the timestamp of the current block
  const currentBlockTimestamp = currentBlock.timestamp;

  return currentBlockTimestamp;
}

// Usage
getCurrentBlockTimestamp()
  .then((timestamp) => {
    console.log("Current Block Timestamp:", timestamp);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
