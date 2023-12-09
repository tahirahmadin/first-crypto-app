import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { makeStyles } from '@mui/styles'

import { Box, IconButton, Typography, useMediaQuery, useTheme } from '@mui/material'

import {
  Cancel,
  CopyAll,
  CurrencyBitcoin,
  LensBlur,
  LocationCity,
  MyLocation,
  Twitter
} from '@mui/icons-material'

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
  }
}))

export default function Portfolio() {
  const classes = useStyles()
  const theme = useTheme()

  let accountSC = '0x87228Dd1eca832d14f4aB0CFb99c471195E7f6dB'

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
            justifyContent={'flex-start'}
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
            >
              $21,000
            </Typography>
            <Typography
              variant="caption"
              fontSize={12}
              fontWeight={300}
              color={'#f9f9f9'}
              textAlign={'center'}
              alignItems={'center'}
            >
              Wallet Balance
            </Typography>
          </Box>
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
          My Activities
        </Typography>
        <Box
          display={'flex'}
          flexDirection={'row'}
          justifyContent={'space-between'}
          alignItems={'center'}
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
                DCA for $21
              </Typography>
              <Typography
                variant="body2"
                fontSize={12}
                fontWeight={400}
                color={'#272727'}
                textAlign={'center'}
              >
                Daily | 21 Orders
              </Typography>
            </Box>
          </Box>

          <Box>
            <Cancel />
          </Box>
        </Box>{' '}
      </Box>
    </Box>
  )
}
