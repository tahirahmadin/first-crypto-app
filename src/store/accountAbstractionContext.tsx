import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { ethers } from 'ethers'

import AccountAbstraction from '@safe-global/account-abstraction-kit-poc'
import { SafeAuthInitOptions, SafeAuthPack } from '@safe-global/auth-kit'
import { MoneriumPack, StripePack } from '@safe-global/onramp-kit'
import { GelatoRelayPack } from '@safe-global/relay-kit'
import { RelayResponse as GelatoRelayResponse } from '@gelatonetwork/relay-sdk'
import Safe, { EthersAdapter, SafeAccountConfig } from '@safe-global/protocol-kit'
import { MetaTransactionData, MetaTransactionOptions } from '@safe-global/safe-core-sdk-types'

import { initialChain } from 'src/constants/chains'
import usePolling from 'src/hooks/usePolling'
import Chain from 'src/models/chain'
import { ERC20Token } from 'src/models/erc20token'
import getChain from 'src/utils/getChain'
import { getERC20Allowance, getERC20Info } from 'src/utils/getERC20Info'
import getMoneriumInfo, { MoneriumInfo } from 'src/utils/getMoneriumInfo'
import isMoneriumRedirect from 'src/utils/isMoneriumRedirect'
import { SafeFactory } from '@safe-global/protocol-kit'
import { ERC20ABI } from './abi'
import FirstCryptoABI from '../constants/abis/firstCrypto.json'
import { FIRST_CRYPTO, TOKENS } from 'src/constants/addresses'
import { BN, toWei } from 'src/utils/unitConverter'

type accountAbstractionContextValue = {
  ownerAddress?: string
  chainId: string
  safes: string[]
  tokenAddress: string
  erc20token?: ERC20Token
  chain?: Chain
  isAuthenticated: boolean
  web3Provider?: ethers.BrowserProvider
  loginWeb3Auth: () => void
  logoutWeb3Auth: () => void
  setChainId: (chainId: string) => void
  safeSelected?: string
  safeBalance?: string
  erc20Balances?: Record<string, ERC20Token>
  setSafeSelected: React.Dispatch<React.SetStateAction<string>>
  setTokenAddress: React.Dispatch<React.SetStateAction<string>>
  isRelayerLoading: boolean
  isSafeDeployed: boolean
  relayTransaction: (
    amount: string,
    steps: number,
    fromToken: string,
    toToken?: string
  ) => Promise<void>
  approveRelayTransaction: (amount: string, token: string, spender: string) => Promise<void>
  updateUpiTransaction: (upi: string) => Promise<void>
  deploySafe: () => Promise<void>
  gelatoTaskId?: string
  openStripeWidget: () => Promise<void>
  closeStripeWidget: () => Promise<void>
  startMoneriumFlow: () => Promise<void>
  closeMoneriumFlow: () => void
  moneriumInfo?: MoneriumInfo
  accountAbstractionKit?: AccountAbstraction
}

const initialState = {
  isAuthenticated: false,
  loginWeb3Auth: () => {},
  logoutWeb3Auth: () => {},
  relayTransaction: async (
    amount: string,
    steps: number,
    fromToken: string,
    toToken?: string
  ) => {},
  approveRelayTransaction: async (amount: string, token: string, spender: string) => {},
  updateUpiTransaction: async (upi: string) => {},
  deploySafe: async () => {},
  setChainId: () => {},
  setSafeSelected: () => {},
  setTokenAddress: () => {},
  onRampWithStripe: async () => {},
  safes: [],
  tokenAddress: ethers.ZeroAddress,
  chainId: initialChain.id,
  isRelayerLoading: true,
  isSafeDeployed: false,
  openStripeWidget: async () => {},
  closeStripeWidget: async () => {},
  startMoneriumFlow: async () => {},
  closeMoneriumFlow: () => {}
}

const accountAbstractionContext = createContext<accountAbstractionContextValue>(initialState)

const useAccountAbstraction = () => {
  const context = useContext(accountAbstractionContext)

  if (!context) {
    throw new Error('useAccountAbstraction should be used within a AccountAbstraction Provider')
  }

  return context
}

const MONERIUM_TOKEN = 'monerium_token'
const MONERIUM_SELECTED_SAFE = 'monerium_safe_selected'

const AccountAbstractionProvider = ({ children }: { children: JSX.Element }) => {
  // owner address from the email  (provided by web3Auth)
  const [ownerAddress, setOwnerAddress] = useState<string>('')

  // safes owned by the user
  const [safes, setSafes] = useState<string[]>([])

  // selected token to be used for fee payments (native token by default)
  const [tokenAddress, setTokenAddress] = useState<string>(ethers.ZeroAddress)

  // chain selected
  const [chainId, setChainId] = useState<string>(() => {
    // if (isMoneriumRedirect()) {
    //   return '0x5'
    // }

    return initialChain.id
  })

  // web3 provider to perform signatures
  const [web3Provider, setWeb3Provider] = useState<ethers.BrowserProvider>()

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [isSafeDeployed, setIsSafeDeployed] = useState<boolean>(false)

  const chain = getChain(chainId) || initialChain

  // reset React state when you switch the chain
  useEffect(() => {
    setOwnerAddress('')
    setSafes([])
    setChainId(chain.id)
    setWeb3Provider(undefined)
    setSafeSelected('')
  }, [chain])

  // authClient
  const [safeAuthPack, setSafeAuthPack] = useState<SafeAuthPack>()

  // onRampClient
  const [stripePack, setStripePack] = useState<StripePack>()

  useEffect(() => {
    ;(async () => {
      if (safeAuthPack) {
        safeAuthPack.destroy()
      }

      const options: SafeAuthInitOptions = {
        enableLogging: true,
        showWidgetButton: false,
        chainConfig: {
          chainId: chain.id,
          rpcTarget: chain.rpcUrl
        }
      }

      const authPack = new SafeAuthPack({
        txServiceUrl: chain.transactionServiceUrl
      })

      await authPack.init(options)

      setSafeAuthPack(authPack)

      // If the provider has an account the we can try to sign in the user
      authPack.subscribe('accountsChanged', async (accounts) => {
        if (accounts.length > 0) {
          const { safes, eoa } = await authPack.signIn()
          const provider = authPack.getProvider()

          // we set react state with the provided values: owner (eoa address), chain, safes owned & web3 provider
          setChainId(chain.id)
          setOwnerAddress(eoa)
          setSafes(safes || [])
          if (provider) {
            setWeb3Provider(new ethers.BrowserProvider(provider))
          }
          setIsAuthenticated(true)
        }
      })
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chain])

  // auth-kit implementation
  const loginWeb3Auth = useCallback(async () => {
    if (!safeAuthPack) return

    try {
      const { safes, eoa } = await safeAuthPack.signIn()
      const provider = safeAuthPack.getProvider()!

      // we set react state with the provided values: owner (eoa address), chain, safes owned & web3 provider
      setChainId(chain.id)
      setOwnerAddress(eoa)
      setSafes(safes || [])
      setWeb3Provider(new ethers.BrowserProvider(provider))
      setIsAuthenticated(true)
    } catch (error) {
      console.log('error: ', error)
    }
  }, [chain, safeAuthPack])

  const logoutWeb3Auth = () => {
    safeAuthPack?.signOut()
    setOwnerAddress('')
    setSafes([])
    setChainId(chain.id)
    setWeb3Provider(undefined)
    setSafeSelected('')
    setGelatoTaskId(undefined)
    setIsAuthenticated(false)
    closeMoneriumFlow()
  }

  // current safe selected by the user
  const [safeSelected, setSafeSelected] = useState<string>('')
  const [moneriumInfo, setMoneriumInfo] = useState<MoneriumInfo>()
  const [moneriumPack, setMoneriumPack] = useState<MoneriumPack>()

  // Initialize MoneriumPack
  useEffect(() => {
    ;(async () => {
      if (!web3Provider || !safeSelected) return

      const safeOwner = await web3Provider.getSigner()
      const ethAdapter = new EthersAdapter({ ethers, signerOrProvider: safeOwner })

      const safeSdk = await Safe.create({
        ethAdapter,
        safeAddress: safeSelected,
        isL1SafeSingleton: true
      })

      const pack = new MoneriumPack({
        clientId: process.env.REACT_APP_MONERIUM_CLIENT_ID || '',
        environment: 'sandbox'
      })

      await pack.init({
        safeSdk
      })

      setMoneriumPack(pack)
    })()
  }, [web3Provider, safeSelected])

  const startMoneriumFlow = useCallback(
    async (authCode?: string, refreshToken?: string) => {
      if (!moneriumPack) return

      localStorage.setItem(MONERIUM_SELECTED_SAFE, safeSelected)

      const moneriumClient = await moneriumPack.open({
        redirectUrl: process.env.REACT_APP_MONERIUM_REDIRECT_URL,
        authCode,
        refreshToken
      })

      if (moneriumClient.bearerProfile) {
        localStorage.setItem(MONERIUM_TOKEN, moneriumClient.bearerProfile.refresh_token)

        const authContext = await moneriumClient.getAuthContext()
        const profile = await moneriumClient.getProfile(authContext.defaultProfile)
        const balances = await moneriumClient.getBalances(authContext.defaultProfile)

        setMoneriumInfo(getMoneriumInfo(safeSelected, authContext, profile, balances))
      }
    },
    [moneriumPack, safeSelected]
  )

  const closeMoneriumFlow = useCallback(() => {
    moneriumPack?.close()
    localStorage.removeItem(MONERIUM_TOKEN)
    setMoneriumInfo(undefined)
  }, [moneriumPack])

  useEffect(() => {
    const authCode = new URLSearchParams(window.location.search).get('code') || undefined
    const refreshToken = localStorage.getItem(MONERIUM_TOKEN) || undefined

    if (authCode || refreshToken) startMoneriumFlow(authCode, refreshToken)
  }, [startMoneriumFlow])

  // TODO: add disconnect owner wallet logic ?

  const [accountAbstractionKit, setAccountAbstractionKit] = useState<AccountAbstraction>()

  // conterfactual safe Address if its not deployed yet
  useEffect(() => {
    const getSafeAddress = async () => {
      if (web3Provider) {
        const hasSafes = safes.length > 0
        const storedSafe = localStorage.getItem(MONERIUM_SELECTED_SAFE) || undefined

        const safeSelected = hasSafes
          ? storedSafe || safes[0]
          : await accountAbstractionKit?.protocolKit.getAddress()

        setSafeSelected(safeSelected || '')

        const flag = await accountAbstractionKit?.protocolKit.isSafeDeployed()

        setIsSafeDeployed(!flag ? false : flag)
      }
    }

    getSafeAddress()
  }, [accountAbstractionKit?.protocolKit, safes, web3Provider])

  useEffect(() => {
    if (!web3Provider) return
    ;(async () => {
      // Instantiate AccountAbstraction kit
      const ethAdapter = new EthersAdapter({
        ethers,
        signerOrProvider: await web3Provider.getSigner()
      })
      const safeAccountAbstraction = new AccountAbstraction(ethAdapter)
      await safeAccountAbstraction.init()
      const gelatoRelayPack = new GelatoRelayPack({
        protocolKit: safeAccountAbstraction.protocolKit
      })
      safeAccountAbstraction.setRelayKit(gelatoRelayPack)

      setAccountAbstractionKit(safeAccountAbstraction)
    })()
  }, [web3Provider])

  const [isRelayerLoading, setIsRelayerLoading] = useState<boolean>(false)
  const [gelatoTaskId, setGelatoTaskId] = useState<string>()

  // refresh the Gelato task id
  useEffect(() => {
    setIsRelayerLoading(false)
    setGelatoTaskId(undefined)
  }, [chainId])

  // relay-kit implementation using Gelat
  // const deploySafe = async () => {
  //   console.log('safe deployed ', ownerAddress)
  //   try {
  //     if (!web3Provider) {
  //       return
  //     }

  //     // // Deploy safe

  //     const safeOwner = await web3Provider.getSigner()
  //     const ethAdapter = new EthersAdapter({ ethers, signerOrProvider: safeOwner })
  //     const safeVersion = '1.4.1'
  //     const safeFactory = await SafeFactory.create({ ethAdapter, safeVersion })

  //     console.log('safe deployed ', ownerAddress)
  //     const safeAccountConfig: SafeAccountConfig = {
  //       owners: [ownerAddress],
  //       threshold: 1
  //       // to, // Optional
  //       // data, // Optional
  //       // fallbackHandler, // Optional
  //       // paymentToken, // Optional
  //       // payment, // Optional
  //       // paymentReceiver // Optional
  //     }
  //     // console.log('safe deployment started  ')
  //     const safeSdk = await safeFactory.deploySafe({ safeAccountConfig })
  //     console.log('safe test sdk deployed ', safeSdk)
  //   } catch (error) {
  //     console.log('safe deployed failed to deploy sdk ', error)
  //   }
  // }

  const enablePlugin = async () => {
    if (!web3Provider) {
      return
    }
    // const safeOwner = await web3Provider.getSigner()
    // const ethAdapter = new EthersAdapter({ ethers, signerOrProvider: safeOwner })
    // const safeSdk2 = await Safe.create({ ethAdapter, safeAddress: safeSelected })

    console.log('safe test ', await accountAbstractionKit?.protocolKit.isSafeDeployed())

    const pluginAddress = '0x09660d8Dc3369e37B6C4ef32dB6D0fB1aD0DEE52'

    const safeTransaction: any = await accountAbstractionKit?.protocolKit.createEnableModuleTx(
      pluginAddress
    )

    const txResponse = await accountAbstractionKit?.protocolKit.executeTransaction(safeTransaction)

    await txResponse?.transactionResponse?.wait(1)

    console.log('safe test enable plugin', txResponse)

    const plugins = await accountAbstractionKit?.protocolKit.getModules()
    console.log('safe test  plugins', plugins)
  }

  const transferTest = async (): Promise<GelatoRelayResponse | undefined> => {
    let response
    try {
      const erc20Interface = new ethers.Interface(ERC20ABI)

      const usdcAddress = TOKENS.USDC[137] // '0xBD4B78B3968922e8A53F1d845eB3a128Adc2aA12'
      const toAddress = '0x8BD0e959E9a7273D465ac74d427Ecc8AAaCa55D8'
      const dumpSafeTransafer: MetaTransactionData[] = [
        {
          to: usdcAddress,
          data: erc20Interface.encodeFunctionData('transfer', [toAddress, '100000000']),
          value: ethers.parseUnits('0', 'ether').toString(),
          operation: 0 // OperationType.Call,
        }
      ]

      const options: MetaTransactionOptions = {
        isSponsored: false,
        gasLimit: '600000', // in this alfa version we need to manually set the gas limit
        gasToken: tokenAddress
      }

      response = (await accountAbstractionKit?.relayTransaction(
        dumpSafeTransafer,
        options
      )) as GelatoRelayResponse
    } catch (error) {
      console.log('transferTest failed ', error)
    }
    return response
  }

  // const allowance = async (): Promise<string | undefined> => {
  //   let response
  //   try {
  //     const erc20Interface = new ethers.Interface(ERC20ABI)
  //     const inputToken = TOKENS.USDC[5]
  //     const spender = FIRST_CRYPTO[5]
  //     const dumpSafeTransafer: MetaTransactionData[] = [
  //       {
  //         to: inputToken,
  //         data: erc20Interface.encodeFunctionData('approve', [spender, '10000000']),
  //         value: ethers.parseUnits('0', 'ether').toString(),
  //         operation: 0 // OperationType.Call,
  //       }
  //     ]

  //   } catch (error) {
  //     console.log('transferTest failed ', error)
  //   }
  //   return response
  // }

  const approveTokens = async (): Promise<GelatoRelayResponse | undefined> => {
    let response
    try {
      const erc20Interface = new ethers.Interface(ERC20ABI)
      const inputToken = TOKENS.USDC[5]
      const spender = FIRST_CRYPTO[5]
      const dumpSafeTransafer: MetaTransactionData[] = [
        {
          to: inputToken,
          data: erc20Interface.encodeFunctionData('approve', [spender, '10000000']),
          value: ethers.parseUnits('0', 'ether').toString(),
          operation: 0 // OperationType.Call,
        }
      ]

      const options: MetaTransactionOptions = {
        isSponsored: false,
        gasLimit: '600000', // in this alfa version we need to manually set the gas limit
        gasToken: tokenAddress
      }

      response = (await accountAbstractionKit?.relayTransaction(
        dumpSafeTransafer,
        options
      )) as GelatoRelayResponse
    } catch (error) {
      console.log('transferTest failed ', error)
    }
    return response
  }

  const startStrategy = async (): Promise<GelatoRelayResponse | undefined> => {
    let response
    try {
      const contractInterface = new ethers.Interface(FirstCryptoABI)

      const contractAddress = FIRST_CRYPTO[5] //'0x78ccc7e50c7fda32CdbAa75D60EccB182cFC45C6'
      const inputToken = TOKENS.USDC[5] //'0xBD4B78B3968922e8A53F1d845eB3a128Adc2aA12'

      const dumpSafeTransafer: MetaTransactionData[] = [
        {
          to: contractAddress,
          data: contractInterface.encodeFunctionData('startStrategy', [inputToken, '10000000', 5]),
          value: ethers.parseUnits('0', 'ether').toString(),
          operation: 0 // OperationType.Call,
        }
      ]

      const options: MetaTransactionOptions = {
        isSponsored: false,
        gasLimit: '600000', // in this alfa version we need to manually set the gas limit
        gasToken: tokenAddress
      }

      response = (await accountAbstractionKit?.relayTransaction(
        dumpSafeTransafer,
        options
      )) as GelatoRelayResponse
    } catch (error) {
      console.log('transferTest failed ', error)
    }
    return response
  }

  const updateUpiTransaction = async (upi: string) => {
    if (web3Provider) {
      setIsRelayerLoading(true)

      const contractAddress = FIRST_CRYPTO[137]

      const contractInterface = new ethers.Interface(FirstCryptoABI)

      const dumpSafeTransafer: MetaTransactionData[] = [
        {
          to: contractAddress,
          data: contractInterface.encodeFunctionData('updateUpi', [upi]),
          value: ethers.parseUnits('0', 'ether').toString(),
          operation: 0 // OperationType.Call,
        }
      ]

      const options: MetaTransactionOptions = {
        isSponsored: false,
        gasLimit: '600000', // in this alfa version we need to manually set the gas limit
        gasToken: tokenAddress
      }

      const response = (await accountAbstractionKit?.relayTransaction(
        dumpSafeTransafer,
        options
      )) as GelatoRelayResponse

      setIsRelayerLoading(false)
      console.log(response)
      setGelatoTaskId(response?.taskId)
    }
  }

  const deploySafe = async () => {
    if (web3Provider) {
      setIsRelayerLoading(true)

      const erc20Interface = new ethers.Interface(ERC20ABI)

      const usdcAddress = TOKENS.USDC[137] // '0xBD4B78B3968922e8A53F1d845eB3a128Adc2aA12'
      const toAddress = '0x8BD0e959E9a7273D465ac74d427Ecc8AAaCa55D8'
      const dumpSafeTransafer: MetaTransactionData[] = [
        {
          to: toAddress,
          data: '0x',
          value: ethers.parseUnits('0.001', 'ether').toString(),
          operation: 0 // OperationType.Call,
        }
      ]

      const options: MetaTransactionOptions = {
        isSponsored: false,
        gasLimit: '600000', // in this alfa version we need to manually set the gas limit
        gasToken: tokenAddress
      }

      const response = (await accountAbstractionKit?.relayTransaction(
        dumpSafeTransafer,
        options
      )) as GelatoRelayResponse

      setIsRelayerLoading(false)
      console.log(response)
      setGelatoTaskId(response?.taskId)
    }
  }

  const relayTransaction = async (
    amount: string,
    steps: number,
    fromToken: string,
    toToken?: string
  ) => {
    if (web3Provider) {
      setIsRelayerLoading(true)

      const contractAddress = FIRST_CRYPTO[5] //'0x78ccc7e50c7fda32CdbAa75D60EccB182cFC45C6'
      const inputToken = fromToken //TOKENS.USDC[5] //'0xBD4B78B3968922e8A53F1d845eB3a128Adc2aA12'
      const inputAmount = toWei(amount?.toString(), 6) //'10000000'

      const contractInterface = new ethers.Interface(FirstCryptoABI)

      const dumpSafeTransafer: MetaTransactionData[] = [
        {
          to: contractAddress,
          data: contractInterface.encodeFunctionData('startStrategy', [
            inputToken,
            inputAmount,
            steps
          ]),
          value: ethers.parseUnits('0', 'ether').toString(),
          operation: 0 // OperationType.Call,
        }
      ]

      const options: MetaTransactionOptions = {
        isSponsored: false,
        gasLimit: '600000', // in this alfa version we need to manually set the gas limit
        gasToken: tokenAddress
      }

      const response = (await accountAbstractionKit?.relayTransaction(
        dumpSafeTransafer,
        options
      )) as GelatoRelayResponse

      setIsRelayerLoading(false)
      console.log(response)
      setGelatoTaskId(response?.taskId)
    }
  }

  const approveRelayTransaction = async (amount: string, token: string, spender: string) => {
    if (web3Provider) {
      setIsRelayerLoading(true)

      const erc20Interface = new ethers.Interface(ERC20ABI)
      const inputToken = token //TOKENS.USDC[5]
      // const spender =  spender //FIRST_CRYPTO[5]

      const dumpSafeTransafer: MetaTransactionData[] = [
        {
          to: inputToken,
          data: erc20Interface.encodeFunctionData('approve', [spender, amount]),
          value: ethers.parseUnits('0', 'ether').toString(),
          operation: 0 // OperationType.Call,
        }
      ]

      const options: MetaTransactionOptions = {
        isSponsored: false,
        gasLimit: '600000', // in this alfa version we need to manually set the gas limit
        gasToken: tokenAddress
      }

      const response = (await accountAbstractionKit?.relayTransaction(
        dumpSafeTransafer,
        options
      )) as GelatoRelayResponse

      setIsRelayerLoading(false)
      console.log(response)
      setGelatoTaskId(response?.taskId)
    }
  }

  // onramp-kit implementation
  const openStripeWidget = async () => {
    const stripePack = new StripePack({
      stripePublicKey: process.env.REACT_APP_STRIPE_PUBLIC_KEY || '',
      onRampBackendUrl: process.env.REACT_APP_STRIPE_BACKEND_BASE_URL || ''
    })

    await stripePack.init()

    const sessionData = await stripePack.open({
      // sessionId: sessionId, optional parameter
      element: '#stripe-root',
      defaultOptions: {
        transaction_details: {
          wallet_address: safeSelected,
          supported_destination_networks: ['ethereum', 'polygon'],
          supported_destination_currencies: ['usdc'],
          lock_wallet_address: true
        },
        customer_information: {
          email: 'john@doe.com'
        }
      }
    })

    setStripePack(stripePack)

    console.log('Stripe sessionData: ', sessionData)
  }

  const closeStripeWidget = async () => {
    stripePack?.close()
  }

  // we can pay Gelato tx relayer fees with native token & ERC20

  // fetch safe address balance with polling
  const fetchSafeBalance = useCallback(async () => {
    const balance = await web3Provider?.getBalance(safeSelected)

    return balance?.toString()
  }, [web3Provider, safeSelected])

  const safeBalance = usePolling(fetchSafeBalance)

  // fetch safe's ERC20 balances
  const fetchErc20SafeBalances = useCallback(async (): Promise<Record<string, ERC20Token>> => {
    if (!web3Provider) {
      return {}
    }

    return Promise.all(
      chain.supportedErc20Tokens?.map((erc20Address) =>
        getERC20Info(erc20Address, web3Provider, safeSelected)
      ) || []
    ).then((tokens) =>
      tokens.reduce((acc, token) => (!!token ? { ...acc, [token.address]: token } : acc), {})
    )
  }, [web3Provider, safeSelected, chain])

  const erc20Balances = usePolling(fetchErc20SafeBalances)
  const erc20token = erc20Balances?.[tokenAddress]

  const state = {
    ownerAddress,
    chainId,
    chain,
    safes,
    erc20token,
    tokenAddress,

    isAuthenticated,

    web3Provider,

    loginWeb3Auth,
    logoutWeb3Auth,

    setChainId,

    safeSelected,
    safeBalance,
    erc20Balances,
    setSafeSelected,
    setTokenAddress,

    isRelayerLoading,
    isSafeDeployed,
    relayTransaction,
    approveRelayTransaction,
    updateUpiTransaction,
    deploySafe,
    gelatoTaskId,

    openStripeWidget,
    closeStripeWidget,

    startMoneriumFlow,
    closeMoneriumFlow,
    moneriumInfo,

    accountAbstractionKit
  }

  return (
    <accountAbstractionContext.Provider value={state}>
      {children}
    </accountAbstractionContext.Provider>
  )
}

export { useAccountAbstraction, AccountAbstractionProvider }
