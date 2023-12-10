const CronJob = require('node-cron')

const { getCurrentBlockTimestampWithRetry, toWei } = require('./helper')

const {
  getOrderQuote,
  createFusionOrder,
  createFusionOrderWithRetry,
  watchOrderStatus
} = require('./fusion')
const { TOKENS } = require('../constants')
const { getPendingOrders } = require('./contractReads')
const { distributeValue, runBatchTransfer } = require('./transfer')
const { batchTransfer, updateOrders } = require('./Transaction')

exports.initScheduledJobs = async () => {
  console.log('starting cron srevice')
  // cron job runs on every 1 minute to filter orders to execute based on current price
  const schedule = '*/3 * * * *' //!process.env.CRON_SCHEDULE ? '*/3 * * * *' : process.env.CRON_SCHEDULE
  const scheduledJobFunction = CronJob.schedule(schedule, async () => {
    console.log('add scheduled jobs here')

    // steps to settle the DCA strategy
    // 1. fetch pending orders
    // 2. combine all orders inputs into signle swap input amount
    // 3. run the swap on fusion api
    // 4. wait for fusion order success and find recieved token amounts
    // 5. devide recieved tokens based on ratio of input tokens and prepare aaray for batch transfer
    // 6. run batch transfer to send tokens back to users.
    // 7. update order status on smart contract

    // 1. fetch pending orders
    const currentChainId = process.env.CURRENT_CHAIN
    const toTokenAddress = TOKENS?.[currentChainId].WBTC

    console.log('current chain id ', currentChainId)

    const pendingOrders = await getPendingOrders(currentChainId)

    console.log('pendingOrders', pendingOrders)

    if (!pendingOrders || pendingOrders?.length === 0) {
      console.log('No pending orders to settle 🍺 😛')
      return
    }

    const orderIds = pendingOrders?.map((ele) => ele?.orderId)
    const users = pendingOrders?.map((ele) => ele?.user)
    const inputAmounts = pendingOrders?.map((ele) => ele?.fiatOrderAmount)

    console.log('details ', { orderIds, users, inputAmounts })

    // 2. combine all orders inputs into signle swap input amount
    const totalInputAmount = inputAmounts?.reduce((sum, current) => sum + current, 0)

    console.log('totalInputAmount', totalInputAmount)
    const fromToken = pendingOrders[0]?.tokenAddress

    // 3. run the swap on fusion api: mainnet only
    const maxRetries = 5
    const delay = 10000
    const fusionOrder = await createFusionOrderWithRetry(
      currentChainId,
      fromToken,
      toTokenAddress,
      totalInputAmount,
      maxRetries,
      delay
    )

    // 4. wait for fusion order success and find recieved token amounts: mainnet  only
    const orderHash = fusionOrder?.orderHash
    if (!orderHash) {
      console.log('failed to create fusion order retry in 10 seconds...')
    }

    // 4. wait for fusion order success and find recieved token amounts
    const fusionOrderStatus = await watchOrderStatus(orderHash)
    console.log('Fusion order filled 🍺')

    // 5. devide recieved tokens based on ratio of input tokens and prepare aaray for batch transfer
    const takingAmount = fusionOrderStatus?.order?.takingAmount

    const amountsToSend = distributeValue(toWei(takingAmount, 5), inputAmounts)
    console.log('takingAmount ', takingAmount)
    console.log('distributed amounts ', amountsToSend)

    // 6. run batch transfer to send tokens back to users.
    await runBatchTransfer(users, amountsToSend, TOKENS[5].USDC, currentChainId)

    // 7. update order status on smart contract
    await updateOrders(orderIds, currentChainId)
  })

  scheduledJobFunction.start()
}
