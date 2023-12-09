import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { makeStyles } from '@mui/styles'
import { QrScanner } from '@yudiel/react-qr-scanner'
import { Box, Button, IconButton, Input, Typography, useMediaQuery, useTheme } from '@mui/material'
import { useAccountAbstraction } from 'src/store/accountAbstractionContext'

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

export default function ScanAndPay() {
  const classes = useStyles()
  const theme = useTheme()

  const [scannedUPI, setScannedUPI] = useState(null)
  const [screenCase, setScreenCase] = useState(0)
  const [amount, setAmount] = useState(0)

  const { safeSelected } = useAccountAbstraction()
  let accountSC = safeSelected

  const handleQrScan = (data) => {
    if (data) {
      // Define a regular expression to match the desired pattern
      var regex = /=(.*?)&/g

      // Create an array to store the extracted values
      var extractedValues = []
      var match

      // Use a loop to find all matches
      while ((match = regex.exec(data)) !== null) {
        // Push the captured group (the value between '=' and '&') to the array
        extractedValues.push(decodeURIComponent(match[1])) // Decode URL-encoded value
      }

      // Output the extracted values
      setScannedUPI(extractedValues[0])
      setScreenCase(1)
      console.log(extractedValues[0])
    }
  }

  const handleTransferFunds = async () => {}

  return (
    <Box>
      <Box className={classes.summaryCard} maxWidth={260} minWidth={150}>
        {screenCase === 0 && (
          <Box
            display={'flex'}
            flexDirection={'column'}
            justifyContent={'space-between'}
            alignItems={'center'}
          >
            <QrScanner
              onDecode={(result) => handleQrScan(result)}
              onError={(error) => console.log(error?.message)}
            />
            <Box display={'flex'} justifyContent={'center'}>
              <img
                src={'https://cedge.in/wp-content/uploads/2017/11/upi-1.png'}
                height="100px"
                width="100px"
                style={{ borderRadius: '50%' }}
              />
            </Box>
            <Typography fontSize={18} fontWeight={600} color={'black'} textAlign={'center'}>
              Scan the QR Code
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
          </Box>
        )}
        {screenCase === 1 && (
          <Box className={classes.summaryCard}>
            <Box className={classes.inputWrapper}>
              <Box display={'flex'} justifyContent={'center'}>
                <img
                  src={'https://avatars.githubusercontent.com/u/20106622?v=4'}
                  height="50px"
                  width="50px"
                  style={{ borderRadius: '50%' }}
                />
              </Box>
              <Typography fontSize={16} fontWeight={600} color={'black'} textAlign={'center'}>
                Aamir Alam
              </Typography>
              <Typography
                variant="body2"
                textAlign={'center'}
                lineHeight={1}
                style={{ fontSize: 12, color: '#414141', fontWeight: 300 }}
              >
                ({scannedUPI} tahirahmad@ybl )
              </Typography>
              <Typography
                variant="body2"
                textAlign={'center'}
                lineHeight={1}
                mt={3}
                style={{ fontSize: 12, color: '#414141', fontWeight: 300 }}
              >
                You are paying
              </Typography>

              <Box display={'flex'} justifyContent={'center'}>
                <Input
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  fullWidth
                  placeholder="0"
                  disableUnderline
                  textAlign={'center'}
                  sx={{ input: { textAlign: 'center' } }}
                  style={{ fontSize: 36, fontWeight: 600, color: '#f9f9f9', textAlign: 'center' }}
                />
              </Box>
              <Typography
                mt={4}
                variant="body2"
                textAlign={'center'}
                lineHeight={1}
                style={{ fontSize: 12, color: '#212121', fontWeight: 300 }}
              >
                This will transfer the USDT from your wallet to merchant wallet
              </Typography>
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
                Pay
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  )
}
