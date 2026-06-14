const coinbase = require('coinbase-commerce-node');
const { Client } = coinbase;

Client.init(process.env.COINBASE_COMMERCE_API_KEY);

module.exports = coinbase;
