import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { makeStyles } from '@mui/styles'

import { Box, Button, IconButton, Input, Typography, useMediaQuery, useTheme } from '@mui/material'

import { CopyAll } from '@mui/icons-material'
import { getTokenBalancesOfWalletAddress } from 'src/actions/serverActions'

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
    backgroundImage: `url(''), linear-gradient(#E5E4E2, #E5E4E2)`,
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
  const [showUPI, setShowUPI] = useState(false)
  const [upi, setUPI] = useState('tahirahmad@ybl')
  let accountSC = '0x87228Dd1eca832d14f4aB0CFb99c471195E7f6dB'

  useEffect(() => {
    if (accountSC) {
      async function asyncFn() {
        let balancesData = await getTokenBalancesOfWalletAddress(accountSC)
        console.log(balancesData)
        // if (web3Data && web3Data.identity === null) {
        //   return;
        // }
        // setSocialDataValues(web3Data);
      }

      asyncFn()
    }
  }, [accountSC])

  const copyToClip = async () => {
    await navigator.clipboard.writeText(accountSC)
    alert('Wallet address is copied')
  }

  return (
    <Box>
      <Box className={classes.summaryCard}>
        <Box
          display={'flex'}
          flexDirection={'row'}
          justifyContent={'flex-start'}
          alignItems={'center'}
        >
          <img
            src={
              'https://as1.ftcdn.net/v2/jpg/05/99/32/28/1000_F_599322870_hufBazDahX69a57xhcprgfn4WSjAlXZj.jpg'
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
            <Typography
              variant="body2"
              fontSize={12}
              fontWeight={400}
              color={'#ffffff'}
              textAlign={'center'}
              alignItems={'center'}
            >
              {accountSC.slice(0, 8)}
              {'... '} {accountSC.slice(-8)}
              <CopyAll onClick={copyToClip} style={{ cursor: 'pointer' }} />
            </Typography>
            <Typography
              variant="h3"
              fontSize={32}
              fontWeight={600}
              color={'#ffffff'}
              textAlign={'center'}
              alignItems={'center'}
              pt={0.5}
            >
              $21,000
            </Typography>
            <Typography
              variant="caption"
              fontSize={12}
              fontWeight={300}
              color={'#e0e0e0'}
              textAlign={'center'}
              alignItems={'center'}
            >
              Wallet Balance
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
            <img src="https://cedge.in/wp-content/uploads/2017/11/upi-1.png" height="24px" />
            <Typography
              variant="body2"
              fontSize={16}
              fontWeight={400}
              color={'#ffffff'}
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
            color={'#ffffff'}
            textAlign={'center'}
            alignItems={'center'}
            pt={0.5}
          >
            tahirahmad@ybl
          </Typography>
          <Typography
            onClick={() => setShowUPI(true)}
            variant="caption"
            fontSize={12}
            fontWeight={300}
            color={'#e0e0e0'}
            textAlign={'center'}
            alignItems={'center'}
          >
            Update UPI
          </Typography>
        </Box>
      </Box>
      <Box className={classes.summaryCard}>
        <Box mt={1} className={classes.inputWrapper}>
          <Typography
            variant="subtitle2"
            textAlign={'left'}
            lineHeight={1}
            style={{ color: 'black', fontWeight: 600 }}
          >
            Your UPI Id to receive crypto payments:
          </Typography>
          <Input
            value={upi}
            onChange={(event) => setUPI(event.target.value)}
            fullWidth
            placeholder="Enter your upi "
            disableUnderline
            style={{ fontSize: 14, fontWeight: 400, color: '#f9f9f9' }}
          />
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
            onClick={null}
          >
            Update UPI
          </Button>
        </Box>
      </Box>
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
                USDT
              </Typography>
              <Typography
                variant="caption"
                fontSize={12}
                fontWeight={300}
                color={'#757575'}
                textAlign={'center'}
              >
                USD Tether
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
                $120
              </Typography>
              <Typography
                variant="caption"
                fontSize={10}
                fontWeight={300}
                color={'#757575'}
                textAlign={'center'}
              >
                $121
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
                ETH
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
                0.25
              </Typography>
              <Typography
                variant="caption"
                fontSize={10}
                fontWeight={300}
                color={'#757575'}
                textAlign={'center'}
              >
                $500
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
