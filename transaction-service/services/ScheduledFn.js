const CronJob = require("node-cron");

const { getCurrentBlockTimestampWithRetry, toWei } = require("./helper");

const { getOrderQuote } = require("./fusion");
const { TOKENS } = require("../constants");

exports.initScheduledJobs = async () => {
  console.log("starting cron srevice");
  // cron job runs on every 1 minute to filter orders to execute based on current price
  const schedule = !process.env.CRON_SCHEDULE
    ? "*/1 * * * *"
    : process.env.CRON_SCHEDULE;
  const scheduledJobFunction = CronJob.schedule(schedule, async () => {
    console.log("add scheduled jobs here");

   

    // console.log(
    //   `${currentOrders?.length} orders fetched at block time ${currentBlockTimestamp} `
    // );
  });

  scheduledJobFunction.start();

  // testing fusion order creation

  console.log("starting job");
  const quote = await getOrderQuote(
    137,
    TOKENS[137].USDT,
    TOKENS[137].WBTC,
    toWei("0.2", 6)
  );

  console.log("quote ", quote);
};
