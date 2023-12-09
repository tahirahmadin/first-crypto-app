// get the Console class
const { Console } = require("console");
// get fs module for creating write streams
const fs = require("fs");

const transactionLogFolder = "./Logs/TradeLogs";

if (!fs.existsSync(transactionLogFolder)) {
  fs.mkdirSync(transactionLogFolder);
}

const time = `${new Date().toDateString()}`;

const successTransactionLogger = new Console({
  stdout: fs.createWriteStream(
    `${transactionLogFolder}/success-transactions-${time}.txt`
  ),
});

const failedTransactionLogger = new Console({
  stdout: fs.createWriteStream(
    `${transactionLogFolder}/failed-transactions-${time}.txt`
  ),
});

module.exports = {
  successTransactionLogger,
  failedTransactionLogger,
};
