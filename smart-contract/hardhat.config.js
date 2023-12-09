/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require('@nomicfoundation/hardhat-toolbox')
require('dotenv').config()
require('@openzeppelin/hardhat-upgrades')
require('@nomiclabs/hardhat-etherscan')
require('@nomiclabs/hardhat-solhint')

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

module.exports = {
  etherscan: {
    apiKey: process.env.etherscan_goerli
  },
  solidity: {
    compilers: [
      {
        version: '0.7.0',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      },
      {
        version: '0.8.7',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      }
    ],
    gas: 700000000,
    //  gasMultiplier:5,
    gasPrice: 5
  },

  defaultNetwork: 'hardhat',

  networks: {
    maticmain: {
      url: 'https://polygon-rpc.com/',
      accounts: [process.env.private_key],
      gas: 3000000, // <--- Twice as much
      gasPrice: 800000000000,
      timeout: 999999
    },
    matictest: {
      url: 'https://matic-mumbai.chainstacklabs.com/',
      accounts: [process.env.private_key],
      timeout: 999999
    },
    goerli: {
      url: 'https://ethereum-goerli.publicnode.com',
      accounts: [process.env.private_key],
      timeout: 999999
    }
  }
}
