const { ethers } = require("ethers");
const BigNumber = require("bignumber.js");

async function getCurrentBlockTimestampWithRetry() {
  const polygonNodeUrl = "https://polygon-rpc.com"; // Replace with your Polygon node URL
  const provider = new ethers.providers.JsonRpcProvider(polygonNodeUrl);

  async function getTimestamp() {
    try {
      const currentBlockNumber = await provider.getBlockNumber();
      const currentBlock = await provider.getBlock(currentBlockNumber);
      return currentBlock.timestamp;
    } catch (error) {
      throw error; // Propagate the error to trigger retry
    }
  }

  // Retry logic with a delay of 5 seconds
  async function retry() {
    try {
      return await getTimestamp();
    } catch (error) {
      console.error("Error:", error.message);
      console.log("Retrying in 5 seconds...");
      await new Promise((resolve) => setTimeout(resolve, 3000)); // 3 seconds delay
      return retry(); // Retry the function call
    }
  }

  return retry();
}

async function retry(fn, maxRetries, retryInterval) {
  let retries = 0;

  async function attempt() {
    try {
      return await fn();
    } catch (error) {
      retries++;
      if (retries <= maxRetries) {
        console.error("Error:", error.message);
        console.log(
          `Retrying in ${
            retryInterval / 1000
          } seconds (Attempt ${retries}/${maxRetries})...`
        );
        await new Promise((resolve) => setTimeout(resolve, retryInterval));
        return attempt(); // Retry the function call
      } else {
        throw new Error(
          `Max retries (${maxRetries}) reached. Last error: ${error.message}`
        );
      }
    }
  }

  return attempt();
}

const BN = (value) => {
  try {
    return !value ? new BigNumber("0") : new BigNumber(value);
  } catch (error) {
    console.log("BN error", error);
    return new BigNumber("0");
  }
};

const fromWei = (tokens, decimals = 18) => {
  return BN(tokens).div(BN(10).exponentiatedBy(decimals)).toString();
};

const toWei = (tokens, decimals = 18) => {
  return BN(tokens).multipliedBy(BN(10).exponentiatedBy(decimals)).toString();
};

module.exports = { getCurrentBlockTimestampWithRetry, retry, fromWei, toWei };
