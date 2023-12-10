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
      return res.data
    })
    .catch((err) => {
      return err
    })
  return response
}

// Get token details by addresses of the wallet
export const getTokenDetailsByAddresses = async (addresses) => {
  console.log(addresses.toString())
  const url = `http://localhost:5002/?url=https://api.1inch.dev/token/v1.2/137/custom?addresses=0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174,0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063`

  let response = axios
    .get(url, { params: { address: '1232' } })
    .then((res) => {
      return res.data
    })
    .catch((err) => {
      return err
    })
  return response
}

// Get spot price of tokens by addresses
export const getSpotPriceOfTokensByAddresses = async (addresses) => {
  let callUrl = `https://api.1inch.dev/price/v1.1/137/${addresses.toString()}`
  const url = `http://localhost:5002/?url=${callUrl}`

  const config = {
    params: {
      currency: 'USD'
    }
  }

  let response = axios
    .get(url)
    .then((res) => {
      return res.data
    })
    .catch((err) => {
      return err
    })
  return response
}
// Get spot price of tokens by addresses
export const getPortfolioGrowthChartByAddress = async (address) => {
  let callUrl =
    'https://api.1inch.dev/portfolio/v3/portfolio/overview/total_value_chart?addresses=0x87228Dd1eca832d14f4aB0CFb99c471195E7f6dB&chain_id=137&timerange=1year'
  const url = `http://localhost:5002/?url=${callUrl}`
  // Setting up headers
  const config = {
    params: {
      addresses: ['0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174'].toString(),
      chain_id: 137,
      timerange: '1month'
    }
  }
  let response = axios
    .get(url, config)
    .then((res) => {
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
