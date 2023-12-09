import axios from 'axios'

// 1inch backend url
let inchUrl = 'https://api.1inch.dev'

// Get token balances of the wallet
export const getTokenBalancesOfWalletAddress = async (address) => {
  const url =
    'http://localhost:5002/?url=https://api.1inch.dev/balance/v1.2/137/balances/0x9D7117a07fca9F22911d379A9fd5118A5FA4F448'
  // Setting up headers
  const config = {
    params: {}
  }
  let response = axios
    .get(url, config)
    .then((res) => {
      console.log(res)
      return res.data
    })
    .catch((err) => {
      return err
    })
  return response
}

export const getProfileDataWeb3 = async (userAddress) => {
  let url = `https://api.web3.bio/profile/${userAddress}`
  let response = axios
    .get(url)
    .then((res) => {
      return res.data
    })
    .catch((err) => {
      return null
    })
  return response
}
