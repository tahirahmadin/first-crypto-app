import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { makeStyles } from '@mui/styles'
import Chart from 'react-apexcharts'
import { Box, Button, IconButton, Input, Typography, useMediaQuery, useTheme } from '@mui/material'

import { CopyAll } from '@mui/icons-material'
import {
  getPortfolioGrowthChartByAddress,
  getSpotPriceOfTokensByAddresses,
  getTokenBalancesOfWalletAddress,
  getTokenDetailsByAddresses
} from 'src/actions/serverActions'
import { useAccountAbstraction } from 'src/store/accountAbstractionContext'
import { getPositionInfo } from 'src/utils/getUserPosition'
import GelatoTaskStatusLabel from 'src/components/gelato-task-status-label/GelatoTaskStatusLabel'
import AddressLabel from 'src/components/address-label/AddressLabel'
import { CURRENT_CHAIN, TOKENS } from 'src/constants/addresses'
import { getERC20Info } from 'src/utils/getERC20Info'
import { fromWei } from 'src/utils/unitConverter'

const useStyles = makeStyles((theme) => ({
  card: {
    backgroundColor: '#ffffff',
    marginBottom: 5,
    paddingTop: 7,
    paddingBottom: 7,
    paddingLeft: 14,
    paddingRight: 14,
    width: '100%',
    height: '100%',
    border: '10px solid #f9f9f9',
    boxShadow: '0px 12px 24px rgba(0, 0, 0, 0.03)',
    borderRadius: '1rem'
  },

  summaryCardOther: {
    background: 'linear-gradient(to bottom, #464646, #464646)',
    backgroundImage: `url(''), linear-gradient(#f9f9f9, #ffffff)`,
    backgroundSize: 'cover',
    marginBottom: 5,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 14,
    paddingRight: 14,
    width: '100%',
    height: '100%',
    minHeight: 60,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    boxShadow: '0px 12px 24px rgba(0, 0, 0, 0.03)',
    borderRadius: '1rem'
  },
  summaryCardBalance: {
    // backgroundColor: "#ffffff",

    background: 'linear-gradient(to bottom, #D72B66, #D72B66)',
    backgroundImage: `url(''), linear-gradient(#f9f9f9, #ffffff)`,
    backgroundSize: 'cover',
    marginBottom: 5,
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 14,
    paddingRight: 14,
    width: '100%',
    height: '100%',
    minHeight: 100,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    boxShadow: '0px 12px 24px rgba(0, 0, 0, 0.03)',
    borderRadius: '1rem'
  },

  summaryCard: {
    // backgroundColor: "#ffffff",

    background: 'linear-gradient(to bottom, #D72B66, #D72B66)',
    backgroundImage: `url(''), linear-gradient(#808080, #808080)`,
    backgroundSize: 'cover',
    marginBottom: 5,
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 14,
    paddingRight: 14,
    width: '100%',
    height: '100%',
    minHeight: 100,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    boxShadow: '0px 12px 24px rgba(0, 0, 0, 0.03)',
    borderRadius: '1rem'
  },
  inputCard: {
    // backgroundColor: "#ffffff",
    backgroundColor: '#EEEFF3',
    marginBottom: 5,
    paddingTop: 7,
    paddingBottom: 7,
    paddingLeft: 14,
    paddingRight: 14,
    width: '100%',
    height: '100%',
    minHeight: 150,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    boxShadow: '0px 12px 24px rgba(0, 0, 0, 0.03)',
    borderRadius: '1rem'
  },
  buttonConnect: {
    marginTop: 10,
    backgroundColor: '#0029FF',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '0.5625rem',
    width: '100%',
    height: 44,
    '&:hover': {
      backgroundColor: '#6385f3',
      color: 'white'
    }
  },
  select: {
    color: 'black',
    fontSize: 14,
    fontWeight: 600,
    border: 'none', // Remove the border
    borderRadius: 10, // Remove border-radius
    marginLeft: 10,
    marginRight: 10,
    padding: 4,
    paddingLeft: 10,
    background: '#DFE3E7' // Make the background transparent
  },
  inputWrapper: {
    padding: '6px 20px 6px 20px',
    borderRadius: 10,
    backgroundColor: 'rgba(106, 85, 234,0.03)',
    color: 'black'

    // background: 'linear-gradient(to bottom, #6385f3, #5a7ff2)'
  }
}))

export default function Portfolio() {
  const classes = useStyles()
  const theme = useTheme()
  const [totalPortfolio, setTotalPortfolio] = useState(860)
  const [showUPI, setShowUPI] = useState(false)
  const [upi, setUPI] = useState('youname@bankId')
  const [activeTokens, setActiveTokens] = useState('tahirahmad@ybl')
  const [loading, setLoading] = useState(false)

  const {
    safeSelected,
    updateUpiTransaction,
    isRelayerLoading,
    gelatoTaskId,
    ownerAddress,
    web3Provider,
    chainId,
    chain,
    tokenBalance,
    wethBalance
  } = useAccountAbstraction()
  const [transactionHash, setTransactionHash] = useState('')

  // const [tokenBalances, setTokenBalances] = useState([0, 0])

  // useEffect(() => {
  //   if (!safeSelected || !web3Provider || !chainId) {
  //     return
  //   }
  //   async function load() {
  //     const data = await getERC20Info(TOKENS?.USDC[CURRENT_CHAIN], web3Provider, safeSelected)

  //     console.log('balance test ', { data })
  //     setTokenBalances([data.balance, 0])
  //   }

  //   load()
  //   setInterval(() => {
  //     load()
  //   }, 60000)
  // }, [safeSelected, web3Provider, chainId])

  const [userUPI, setUserUPI] = useState(null)

  useEffect(() => {
    console.log('data loaded 1')
    if (!safeSelected || !web3Provider) {
      return
    }
    console.log('data loaded 2')
    async function load() {
      const data = await getPositionInfo(web3Provider, CURRENT_CHAIN, safeSelected)
      console.log('data loaded ', data)
      setUserUPI(data.userUpi)
    }

    load()
  }, [safeSelected, web3Provider])

  // Fetch Balances of user
  useEffect(() => {
    if (safeSelected) {
      async function asyncFn() {
        let balancesData = await getTokenBalancesOfWalletAddress(safeSelected)

        if (balancesData) {
          const filteredData = Object.keys(balancesData)
            .filter((key) => parseInt(balancesData[key]) > 0)
            .reduce((obj, key) => {
              obj[key] = balancesData[key]

              return obj
            }, {})
          let tempAddresses = Object.keys(filteredData)
          // console.log('tempAddresses')
          // console.log(tempAddresses)
          // let tokensData = await getTokenDetailsByAddresses(tempAddresses)
          let pricesData = await getSpotPriceOfTokensByAddresses(tempAddresses.toString())
          // let portfolioData = await getPortfolioGrowthChartByAddress(tempAddresses)

          setActiveTokens(filteredData)
          console.log(filteredData)
        }
      }

      asyncFn()
    }
  }, [safeSelected])

  const copyToClip = async () => {
    await navigator.clipboard.writeText(safeSelected)
    alert('Wallet address is copied')
  }

  const chartData = {
    options: {
      series: [
        {
          name: 'Portfolio Balance',
          data: [10, 12, 17, 19, 33, 28, 24, 44, 48]
        }
      ],
      chart: {
        height: 100,
        type: 'line',
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'straight'
      },
      title: {
        text: 'Product Trends by Month',
        align: 'left'
      },
      grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.5
        }
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']
      }
    },
    series: [
      {
        name: 'series-1',
        data: [10, 12, 17, 19, 33, 28, 24, 44, 48]
      }
    ]
  }

  const handleUpiUpdate = async () => {
    await updateUpiTransaction(upi)
    setLoading(true)
  }

  const handleSuccessUpdate = () => {
    setLoading(false)
    setShowUPI(false)
    // refresh upi
  }

  return (
    <Box>
      <Box className={classes.summaryCardBalance}>
        <Box
          display={'flex'}
          flexDirection={'row'}
          justifyContent={'flex-start'}
          alignItems={'center'}
        >
          <img
            alt="dat"
            src={
              'https://img.freepik.com/premium-vector/cute-wizard-investment-cryptocurrency-fairytale-avatar-character-cartoon-illustration_357749-1173.jpg?w=2000'
            }
            height="80px"
            width="80px"
            style={{ borderRadius: 20 }}
          />
          <Box
            pl={1}
            display={'flex'}
            flexDirection={'column'}
            justifyContent={'space-around'}
            alignItems={'flex-start'}
          >
            {/* <Typography
              variant="body2"
              fontSize={12}
              fontWeight={400}
              color={'#000000'}
              textAlign={'center'}
              alignItems={'center'}
            >
              {safeSelected?.slice(0, 8)}
              {'... '} {safeSelected?.slice(-8)}
              <CopyAll onClick={copyToClip} style={{ cursor: 'pointer' }} />
            </Typography> */}
            {ownerAddress && <AddressLabel address={ownerAddress} showBlockExplorerLink />}
            <Typography
              variant="h3"
              fontSize={32}
              fontWeight={600}
              color={'#000000'}
              textAlign={'center'}
              alignItems={'center'}
              pt={1}
            >
              ${totalPortfolio}
            </Typography>
            <Typography
              variant="caption"
              fontSize={12}
              fontWeight={300}
              color={'#f7931a'}
              textAlign={'center'}
              alignItems={'center'}
            >
              Portfolio balance
            </Typography>
          </Box>
        </Box>

        <Box
          pl={1}
          display={'flex'}
          flexDirection={'column'}
          justifyContent={'space-around'}
          alignItems={'flex-end'}
        >
          <Box
            display={'flex'}
            flexDirection={'row'}
            justifyContent={'space-around'}
            alignItems={'flex-end'}
          >
            <img
              alt="dad"
              src="https://cedge.in/wp-content/uploads/2017/11/upi-1.png"
              height="24px"
            />
            <Typography
              variant="body2"
              fontSize={16}
              fontWeight={400}
              color={'#000000'}
              textAlign={'center'}
              alignItems={'center'}
            >
              UPI
            </Typography>
          </Box>

          <Typography
            variant="h6"
            fontSize={16}
            fontWeight={600}
            color={'#414141'}
            textAlign={'center'}
            alignItems={'center'}
            pt={0.5}
          >
            {userUPI ? userUPI : 'example@ybl'}
          </Typography>
          <Button
            style={{ backgroundColor: '#e5e5e5', color: 'black', width: 'fit-content', height: 30 }}
          >
            <Typography
              onClick={() => setShowUPI(!showUPI)}
              variant="caption"
              fontSize={12}
              fontWeight={300}
              textAlign={'center'}
              alignItems={'center'}
            >
              {showUPI ? 'Hide UPI Update' : ' Update UPI'}
            </Typography>
          </Button>
        </Box>
      </Box>
      {/* <div className="line-chart">
        <Chart options={chartData.options} series={chartData.series} type="line" width="500" />
      </div> */}
      {showUPI && (
        <Box className={classes.summaryCardBalance}>
          <Box mt={1} className={classes.inputWrapper}>
            <Typography
              variant="h6"
              textAlign={'left'}
              lineHeight={1}
              style={{ color: 'black', fontWeight: 600, fontSize: 16 }}
            >
              Your UPI Id to receive crypto payments:
            </Typography>
            <Input
              value={upi}
              onChange={(event) => setUPI(event.target.value)}
              fullWidth
              placeholder="Enter your upi "
              disableUnderline
              style={{ fontSize: 14, fontWeight: 400, color: '#000000' }}
            />
            {!loading && (
              <Button
                style={{
                  marginTop: 10,
                  backgroundColor: '#f7931a',
                  color: 'black',
                  textDecoration: 'none',
                  borderRadius: '0.5625rem',
                  width: '100%',
                  height: 44
                }}
                mt={2}
                onClick={handleUpiUpdate}
              >
                Update UPI
              </Button>
            )}

            {loading && gelatoTaskId && (
              <GelatoTaskStatusLabel
                gelatoTaskId={gelatoTaskId}
                chainId={5}
                setTransactionHash={setTransactionHash}
                transactionHash={transactionHash}
                handleSuccessUpdate={handleSuccessUpdate}
              />
            )}
          </Box>
        </Box>
      )}

      <Box className={classes.summaryCardOther}>
        <Typography
          variant="body2"
          fontSize={15}
          fontWeight={700}
          color={'#000000'}
          textAlign={'left'}
          my={1}
        >
          Tokens
        </Typography>

        {/* //Code fo tokens */}
        <Box
          display={'flex'}
          flexDirection={'row'}
          justifyContent={'space-between'}
          alignItems={'center'}
          mb={2}
        >
          <Box
            display={'flex'}
            flexDirection={'row'}
            justifyContent={'flex-start'}
            alignItems={'center'}
          >
            <Box>
              <img
                src={
                  'https://w7.pngwing.com/pngs/268/1013/png-transparent-ethereum-eth-hd-logo-thumbnail.png'
                }
                height="30px"
                width="30px"
                style={{ borderRadius: '50%' }}
              />
            </Box>
            <Box
              ml={1}
              display={'flex'}
              flexDirection={'column'}
              justifyContent={'flex-start'}
              alignItems={'flex-start'}
            >
              <Typography fontSize={12} fontWeight={600} color={'#272727'} textAlign={'center'}>
                USDC
              </Typography>
              <Typography
                variant="caption"
                fontSize={12}
                fontWeight={300}
                color={'#757575'}
                textAlign={'center'}
              >
                USDC Token
              </Typography>
            </Box>
          </Box>

          <Box>
            <Box
              ml={1}
              display={'flex'}
              flexDirection={'column'}
              justifyContent={'center'}
              alignItems={'flex-end'}
            >
              <Typography
                variant="body1"
                fontSize={15}
                fontWeight={600}
                color={'#272727'}
                textAlign={'center'}
              >
                {fromWei(tokenBalance, 6)}
              </Typography>
              <Typography
                variant="caption"
                fontSize={10}
                fontWeight={300}
                color={'#757575'}
                textAlign={'center'}
              >
                $ {fromWei(tokenBalance, 6)}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box
          display={'flex'}
          flexDirection={'row'}
          justifyContent={'space-between'}
          alignItems={'center'}
          mb={2}
        >
          <Box
            display={'flex'}
            flexDirection={'row'}
            justifyContent={'flex-start'}
            alignItems={'center'}
          >
            <Box>
              <img
                src={
                  'https://w7.pngwing.com/pngs/268/1013/png-transparent-ethereum-eth-hd-logo-thumbnail.png'
                }
                height="30px"
                width="30px"
                style={{ borderRadius: '50%' }}
              />
            </Box>
            <Box
              ml={1}
              display={'flex'}
              flexDirection={'column'}
              justifyContent={'flex-start'}
              alignItems={'flex-start'}
            >
              <Typography fontSize={12} fontWeight={600} color={'#272727'} textAlign={'center'}>
                WETH
              </Typography>
              <Typography
                variant="caption"
                fontSize={12}
                fontWeight={300}
                color={'#757575'}
                textAlign={'center'}
              >
                Ethereum
              </Typography>
            </Box>
          </Box>

          <Box>
            <Box
              ml={1}
              display={'flex'}
              flexDirection={'column'}
              justifyContent={'center'}
              alignItems={'flex-end'}
            >
              <Typography
                variant="body1"
                fontSize={15}
                fontWeight={600}
                color={'#272727'}
                textAlign={'center'}
              >
                {fromWei(wethBalance, 18)}
              </Typography>
              <Typography
                variant="caption"
                fontSize={10}
                fontWeight={300}
                color={'#757575'}
                textAlign={'center'}
              >
                ${fromWei(wethBalance, 18) * 2300}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
