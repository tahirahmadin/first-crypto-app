// configs for testnet and mainnet contract deployments
const config = {

  contractAddresses: {
    testnet: {
      USDC: '0xE118429D095de1a93951c67D04B523fE5cbAB62c',
      FIRST_CRYPTO: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
    },
    mainnet: {
      USDC: '',
      FIRST_CRYPTO: '',
    }
  }
}

module.exports = { config }
