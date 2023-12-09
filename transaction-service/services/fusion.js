const { default: Web3 } = require('web3')
const { NETWORK_RPC } = require('../constants')
const {
  PrivateKeyProviderConnector,
  FusionSDK,
  NetworkEnum,
  FusionOrder,
  AuctionSalt,
  AuctionSuffix
} = require('@1inch/fusion-sdk')
const { PresetEnum } = require('@1inch/fusion-sdk/api')

const makerPrivateKey = process.env.PRIVATE_KEY
const makerAddress = '0x8BD0e959E9a7273D465ac74d427Ecc8AAaCa55D8'

function fusionSdk(chainId) {
  const nodeUrl = NETWORK_RPC[137] //NETWORK_RPC[chainId];
  // console.log("private key ", makerPrivateKey);
  const blockchainProvider = new PrivateKeyProviderConnector(makerPrivateKey, new Web3(nodeUrl))

  // console.log("sdk params ", {
  //   url: "https://api.1inch.dev/fusion",
  //   network: chainId,
  //   blockchainProvider,
  //   authKey: process.env.FUSION_AUTH_KEY,
  //   makerPrivateKey,
  //   // web3: new Web3(nodeUrl),
  // });
  const sdk = new FusionSDK({
    url: 'https://api.1inch.dev/fusion',
    network: chainId,
    blockchainProvider,
    authKey: process.env.FUSION_AUTH_KEY
  })

  return sdk
}

async function createFusionOrder(chainId, fromToken, toToken, amount) {
  const sdk = fusionSdk(chainId)

  const order = await sdk.placeOrder({
    fromTokenAddress: fromToken, // WETH
    toTokenAddress: toToken, // USDC
    amount: amount, // 0.05 ETH
    walletAddress: makerAddress,
    preset: PresetEnum.fast
  })

  return order
}

async function createFusionOrderWithRetry(
  chainId,
  fromToken,
  toToken,
  amount,
  maxRetries = 3,
  delay = 5000
) {
  let retries = 0

  while (retries <= maxRetries) {
    try {
      const order = await createFusionOrder(chainId, fromToken, toToken, amount)
      if (order) {
        return order
      }
    } catch (error) {
      console.error(`Error creating Fusion order (Retry ${retries + 1}):`, error.message)
    }

    // Retry after a delay (e.g., 5 seconds)
    console.log(`Retrying in 5 seconds...`)
    await new Promise((resolve) => setTimeout(resolve, delay))

    retries++
  }

  console.error(`Max retries reached. Could not create Fusion order.`)
  return null
}

// async function buildFusionOrder(chainId, fromToken, toToken, amount) {
//   try {
//     const sdk = fusionSdk(chainId)

//     const quote = await sdk.getQuote({
//       fromTokenAddress: fromToken,
//       toTokenAddress: toToken,
//       amount: amount
//     })

//     console.log('quote ', quote)
//     const quoteId = quote.quoteId

//     const salt = new AuctionSalt({
//       duration: 180,
//       auctionStartTime: 1673548149,
//       initialRateBump: 50000,
//       bankFee: '0'
//     })

//     const suffix = new AuctionSuffix({
//       points: [
//         {
//           coefficient: 20000,
//           delay: 12
//         }
//       ],
//       whitelist: [
//         {
//           address: makerAddress,
//           allowance: 0
//         }
//       ]
//     })

//     const order = new FusionOrder(
//       {
//         makerAsset: fromToken,
//         takerAsset: toToken,
//         makingAmount: amount,
//         takingAmount: quote.toTokenAmount,
//         maker: makerAddress
//       },
//       salt,
//       suffix,
//       {
//         postInteraction: '0x'
//       }
//     )

//     const orderBuild = order.build()
//     console.log('order build ', orderBuild)
//   } catch (error) {
//     console.log('failed to create fusion order ', error)
//     return null
//   }
// }

async function getOrderQuote(chainId, fromToken, toToken, amount) {
  try {
    const sdk = fusionSdk(chainId)

    const order = await sdk.getQuote({
      fromTokenAddress: fromToken, // WETH
      toTokenAddress: toToken, // USDC
      amount: amount // 0.05 ETH
    })
    return order
  } catch (error) {
    console.log('failed to create fusion order ', error)
    return null
  }
}
async function retry(fn, maxRetries, retryInterval) {
  let retries = 0

  async function attempt() {
    try {
      return await fn()
    } catch (error) {
      retries++
      if (retries <= maxRetries) {
        console.error('Error:', error.message)
        console.log(
          `Retrying in ${retryInterval / 1000} seconds (Attempt ${retries}/${maxRetries})...`
        )
        await new Promise((resolve) => setTimeout(resolve, retryInterval))
        return attempt() // Retry the function call
      } else {
        throw new Error(`Max retries (${maxRetries}) reached. Last error: ${error.message}`)
      }
    }
  }

  return attempt()
}

async function watchOrderStatus(orderHash, chainId) {
  const sdk = fusionSdk(chainId)

  const response = await sdk.getOrderStatus(orderHash)
  // console.log("current order status ", response.status);
  if (response.status !== 'filled') {
    // wait for 10 sec for next update
    console.log('waiting for next status check')
    await new Promise((resolve) => setTimeout(resolve, 10000))
    console.log('retrying for status update')
    watchOrderStatus(orderHash, chainId)
  }
  return response
}

module.exports = {
  createFusionOrder,
  watchOrderStatus,
  getOrderQuote,
  createFusionOrderWithRetry
}
