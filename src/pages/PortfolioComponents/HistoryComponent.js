import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { makeStyles } from '@mui/styles'

import { Box, IconButton, Typography, useMediaQuery, useTheme } from '@mui/material'

import { Cancel, CopyAll } from '@mui/icons-material'
import PayViaUPI from './PayViaUPI'
import { useAccountAbstraction } from 'src/store/accountAbstractionContext'
import { getPositionInfo } from 'src/utils/getUserPosition'
import { fromWei } from 'src/utils/unitConverter'
import { CURRENT_CHAIN } from 'src/constants/addresses'

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

export default function HistoryComponent({ setStep }) {
  const classes = useStyles()
  const theme = useTheme()

  const [userPositions, setUserPositions] = useState([])

  const { safeSelected, web3Provider, chain } = useAccountAbstraction()

  useEffect(() => {
    if (!safeSelected || !web3Provider) {
      return
    }
    async function load() {
      const data = await getPositionInfo(web3Provider, CURRENT_CHAIN, safeSelected)

      setUserPositions(data.formattedOrders)
    }

    load()
    setInterval(() => {
      load()
    }, 60000)
  }, [safeSelected, web3Provider])

  const copyToClip = async () => {
    await navigator.clipboard.writeText(safeSelected)
    alert('Wallet address is copied')
  }
  return (
    <Box>
      <PayViaUPI setStep={setStep} />
      <Box
        px={2}
        pt={2}
        pb={2}
        bgcolor={'#ffffff'}
        display="flex"
        flexDirection="column"
        height="100%"
        maxWidth={260}
        minWidth={150}
        borderRadius={4}
      >
        <Typography
          variant="body2"
          fontSize={15}
          fontWeight={700}
          color={'#000000'}
          textAlign={'center'}
          mb={1}
        >
          Active strategies
        </Typography>
        {userPositions?.map((position) => (
          <Box className={classes.summaryCardOther}>
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
                    height="25px"
                    width="25px"
                    style={{ borderRadius: '50%' }}
                  />
                </Box>
                <Box
                  ml={1}
                  display={'flex'}
                  flexDirection={'column'}
                  justifyContent={'center'}
                  alignItems={'flex-start'}
                >
                  <Typography fontSize={12} fontWeight={600} color={'#272727'} textAlign={'center'}>
                    DCA for {fromWei(position?.depositAmount?.toString(), 6)}
                  </Typography>
                  <Typography
                    variant="caption"
                    fontSize={12}
                    fontWeight={400}
                    color={'#272727'}
                    textAlign={'center'}
                  >
                    orders: {position?.executedGrids}/{position?.grids} filled
                  </Typography>
                </Box>
              </Box>

              <Box
                ml={1}
                display={'flex'}
                flexDirection={'column'}
                justifyContent={'center'}
                alignItems={'flex-end'}
              >
                <Typography
                  variant="caption"
                  fontSize={10}
                  fontWeight={400}
                  color={'#272727'}
                  textAlign={'center'}
                >
                  Amount
                </Typography>
                <Typography fontSize={12} fontWeight={600} color={'#272727'} textAlign={'center'}>
                  {fromWei(position.fiatOrderAmount, 6)} USDC
                </Typography>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
