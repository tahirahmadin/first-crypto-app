const NETWORK_RPC = {
  1: 'https://rpc.ankr.com/eth',
  97: 'https://rpc.ankr.com/bsc_testnet_chapel',
  8001: 'https://rpc.ankr.com/polygon_mumbai',
  137: 'https://polygon.llamarpc.com',
  5: 'https://ethereum-goerli.publicnode.com'
}

const CONTRACT_ADDRESSES = {
  FIRST_CRYPTO: {
    137: '0xe83C2b017449F5105656199bA34E40A646F96C33',
    5: '0x8d5Ff28faDe46A2f41D38cC1854E11c958211792'
  },
  USDC: {
    137: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
    5: '0xBD4B78B3968922e8A53F1d845eB3a128Adc2aA12'
  }
}

const TOKENS = {
  137: {
    USDC: '',
    USDT: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
    WMATIC: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
    WBTC: '0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6',
    DAI: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
    WETH: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619'
  },
  5: {
    USDC: '0xBD4B78B3968922e8A53F1d845eB3a128Adc2aA12',
    USDT: '',
    WBTC: '',
    DAI: ''
  }
}

module.exports = {
  NETWORK_RPC,
  CONTRACT_ADDRESSES,
  TOKENS
}
