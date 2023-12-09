import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { makeStyles } from '@mui/styles'

import { Box, Button, IconButton, Typography, useMediaQuery, useTheme } from '@mui/material'

import { Cancel, CopyAll } from '@mui/icons-material'

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

export default function PayViaUPI({ setStep }) {
  const classes = useStyles()
  const theme = useTheme()

  let accountSC = '0x87228Dd1eca832d14f4aB0CFb99c471195E7f6dB'

  const copyToClip = async () => {
    await navigator.clipboard.writeText(accountSC)
    alert('Wallet address is copied')
  }
  return (
    <Box>
      <Box className={classes.summaryCard} maxWidth={260} minWidth={150}>
        <Box
          display={'flex'}
          flexDirection={'column'}
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          <Box display={'flex'} justifyContent={'center'}>
            <img
              src={'https://cedge.in/wp-content/uploads/2017/11/upi-1.png'}
              height="100px"
              width="100px"
              style={{ borderRadius: '50%' }}
            />
          </Box>
          <Typography fontSize={18} fontWeight={600} color={'black'} textAlign={'center'}>
            Scan & Pay
          </Typography>

          <Typography
            variant="body2"
            fontSize={12}
            fontWeight={400}
            color={'#ffffff'}
            textAlign={'center'}
          >
            Pay your merchant with crypto
          </Typography>
          <Button
            onClick={() => setStep(3)}
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
          >
            Pay Now
          </Button>
        </Box>{' '}
      </Box>
    </Box>
  )
}
