import { BigNumber } from 'bignumber.js'

export const BN = (value) => {
  try {
    return !value ? new BigNumber('0') : new BigNumber(value)
  } catch (error) {
    console.log('BN error', error)
    return new BigNumber('0')
  }
}

export const fromWei = (tokens, decimals = 18) => {
  return BN(tokens).div(BN(10).exponentiatedBy(decimals)).toString()
}

export const toWei = (tokens, decimals = 18) => {
  return BN(tokens).multipliedBy(BN(10).exponentiatedBy(decimals)).toString()
}
