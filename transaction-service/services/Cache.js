const NodeCache = require("node-cache");
const transactionCache = new NodeCache();
const priceCache = new NodeCache();

module.exports = { transactionCache, priceCache };
