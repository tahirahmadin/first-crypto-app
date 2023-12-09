const express = require('express')
const router = express.Router()
const {
  createFusionOrder,
  watchOrderStatus,
  getOrderQuote,
  createFusionOrder2
} = require('../../services/fusion')
const { TOKENS } = require('../../constants')
const { toWei } = require('../../services/helper')
const { getPendingOrders } = require('../../services/contractReads')
const { distributeValue } = require('../../services/transfer')

router.get('/status/:orderHash', async (req, res) => {
  try {
    const orderHash = req.params.orderHash
    const orderStatus = await watchOrderStatus(orderHash, 137)

    // console.log("order status ", orderStatus);

    return res.status(200).json(orderStatus)
  } catch (error) {
    console.log('error ', error)
    return res.status(500).json({ errors: [{ msg: 'Server error' }] })
  }
})

router.get('/pending-orders', async (req, res) => {
  try {
    const orders = await getPendingOrders(5)

    console.log('orders  ', orders)

    // Example usage
    const inputs = [10, 20, 10, 30]
    const totalValue = 200

    const result = distributeValue(totalValue, inputs)
    console.log(result)

    return res.status(200).json({ orders, result })
  } catch (error) {
    console.log('error ', error)
    return res.status(500).json({ errors: [{ msg: 'Server error' }] })
  }
})

router.get('/create-order', async (req, res) => {
  try {
    // const blockTime = await getCurrentBlockTimestampWithRetry();
    // console.log("blocktime ", blockTime);
    // const orders = await queryPendingOrders(blockTime);
    // // console.log("orders ", orders);

    // // const reciept = await execute([2]);
    // const orderIds = orders?.map((ele) => parseInt(ele?.orderId));

    // testing fusion order creation and status update

    // const quote = await getOrderQuote(
    //   137,
    //   TOKENS[137].USDT,
    //   TOKENS[137].WBTC,
    //   toWei("0.2", 6)
    // );

    // const order = await createFusionOrder(
    //   137,
    //   TOKENS[137].USDT,
    //   TOKENS[137].WBTC,
    //   toWei("0.2", 6)
    // );

    const order = await createFusionOrder2(137, TOKENS[137].USDT, TOKENS[137].WBTC, toWei('0.5', 6))

    // console.log('order ')

    // if (!order?.orderHash) {
    //   console.log("failed to create order ");
    //   return res
    //     .status(401)
    //     .json({ errors: [{ msg: "failed to create order" }] });
    // }
    // console.log("waiting for order status", order.orderHash);
    // const orderStatus = await watchOrderStatus(order.orderHash, 137);

    // console.log("order status ", orderStatus);

    return res.status(200).json({ order })
  } catch (error) {
    console.log('error ', error)
    return res.status(500).json({ errors: [{ msg: 'Server error' }] })
  }
})

module.exports = router
