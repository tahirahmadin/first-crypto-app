import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { makeStyles } from '@mui/styles'
import { QrScanner } from '@yudiel/react-qr-scanner'
import { Box, Button, IconButton, Input, Typography, useMediaQuery, useTheme } from '@mui/material'
import { useAccountAbstraction } from 'src/store/accountAbstractionContext'
import {
  useWaku,
  useContentPair,
  useLightPush,
  useStoreMessages,
  useFilterMessages,
  ContentPairProvider
} from '@waku/react'
import protobuf from 'protobufjs'

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
  balanceCard: {
    // backgroundColor: "#ffffff",

    background: 'linear-gradient(to bottom, #D72B66, #D72B66)',
    backgroundImage: `url("eth-background.jpg"), linear-gradient(#9DA7DA, #5C6AC0)`,
    backgroundSize: 'cover',
    marginBottom: 5,
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 14,
    paddingRight: 14,
    width: '100%',
    height: '100%',
    minHeight: 70,

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

const ChatMessage = new protobuf.Type('ChatMessage')
  .add(new protobuf.Field('timestamp', 1, 'uint64'))
  .add(new protobuf.Field('from', 2, 'string'))
  .add(new protobuf.Field('to', 3, 'string'))
  .add(new protobuf.Field('amount', 4, 'string'))

export default function ScanAndPay() {
  const { node } = useWaku()
  const classes = useStyles()
  const theme = useTheme()
  const [enableScan, setEnableScan] = useState(false)
  const [scannedUPI, setScannedUPI] = useState(null)
  const [screenCase, setScreenCase] = useState(0)
  const [amount, setAmount] = useState(0)
  //waku states
  const [nodeStart, setNodeStart] = useState(false)
  const [balance, setbalance] = useState(0)

  const { decoder, encoder } = useContentPair()

  const { messages: storeMessages } = useStoreMessages({
    node,
    decoder
  })
  const { safeSelected, isAuthenticated } = useAccountAbstraction()
  let accountSC = safeSelected

  const UPI_TO_ADDRESS = {
    'tahirahmad.in@axl': '0x5e6795934ad8Ac05fEb01b1EfD9A5d333bf25a33',
    'aamiralam19911@ybl': '0xd49c810a3cDc76075FA328041353adc5521B8D93',
    '8791986707@ibl': '0xd49c810a3cDc76075FA328041353adc5521B8D93'
  }
  const { messages: filterMessages } = useFilterMessages({ node, decoder })

  const { push } = useLightPush({ node, encoder })

  async function sendMessage(fromAddress, toAddress, amount) {
    console.log('hitting2')
    console.log(fromAddress, toAddress, amount)
    const protoMessage = ChatMessage.create({
      timestamp: Date.now(),
      from: fromAddress,
      to: toAddress,
      amount
    })
    console.log('hitting3')
    const serialisedMessage = ChatMessage.encode(protoMessage).finish()

    const timestamp = new Date()
    console.log('hitting4')
    await push({
      payload: serialisedMessage,
      timestamp
    })
    console.log('hitting5')

    console.log('MESSAGE PUSHED')
  }

  function decodeMessage(wakuMessage) {
    if (!wakuMessage.payload) return

    const { timestamp, from, to, amount } = ChatMessage.decode(wakuMessage.payload)
    const popm = ChatMessage.decode(wakuMessage.payload)
    console.log('popm')
    console.log(popm)
    if (!timestamp || !from || !to || !amount) return

    const time = new Date()
    time.setTime(Number(timestamp))

    return {
      timestamp: time,
      from,
      to,
      amount,
      timestampInt: wakuMessage.timestamp
    }
  }

  useEffect(() => {
    if (node !== undefined) {
      setNodeStart(true)
    }
  }, [node])

  useEffect(() => {
    let messages = storeMessages.concat(filterMessages)
    console.log('storeMessages')
    console.log(storeMessages)
    console.log(filterMessages)
    let balanceTransfers = 0
    let balanceRecieved = 0

    messages = messages.map((message) => decodeMessage(message))
    console.log('messages')
    console.log(messages)
    messages.forEach((message) => {
      if (message === undefined) {
        return
      }

      if (message.from === accountSC) {
        balanceTransfers += parseInt(message.amount)
      }
      if (message.to === accountSC) {
        balanceRecieved += parseInt(message.amount)
      }

      let finalBalance = 2000 + balanceRecieved - balanceTransfers
      console.log('finalBalance:' + finalBalance)
      setbalance(finalBalance)
    })
  }, [storeMessages, filterMessages])

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

  const handleTransferFunds = async () => {
    console.log('safeSelected')
    console.log(safeSelected)
    await sendMessage(
      safeSelected ? safeSelected : '0x5e6795934ad8Ac05fEb01b1EfD9A5d333bf25a33',
      UPI_TO_ADDRESS[scannedUPI]
        ? UPI_TO_ADDRESS[scannedUPI]
        : '0xd49c810a3cDc76075FA328041353adc5521B8D93',
      amount.toString()
    )

    setScreenCase(0)
    setEnableScan(false)
    // if (amount && safeSelected && scannedUPI && isAuthenticated) {
    //   if (UPI_TO_ADDRESS[scannedUPI]) {
    //     console.log('hitting1')
    //     await sendMessage(safeSelected, UPI_TO_ADDRESS[scannedUPI], amount.toString())
    //   }
    // }
  }

  const handleTransferFundsDummy = async () => {
    await sendMessage(
      '0x5e6795934ad8Ac05fEb01b1EfD9A5d333bf25a33',
      '0xd49c810a3cDc76075FA328041353adc5521B8D93',
      '100'
    )
  }
  return (
    <Box>
      <Box className={classes.balanceCard} maxWidth={300} minWidth={150}>
        <Box>
          <Typography
            variant="h1"
            fontSize={32}
            fontWeight={800}
            color={'#f9f9f9'}
            textAlign={'center'}
          >
            ${balance}
          </Typography>
          <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
            <img
              src="https://cdn.iconscout.com/icon/free/png-256/free-upi-money-transfer-1817147-1538015.png"
              height="24px"
              width="24px"
              style={{ borderRadius: '50%' }}
            />{' '}
            <Typography
              fontSize={12}
              fontWeight={600}
              color={'#f9f9f9'}
              textAlign={'center'}
              ml={1}
            >
              Crypto Balance
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box className={classes.summaryCard} maxWidth={300} minWidth={150}>
        {screenCase === 0 && (
          <Box
            display={'flex'}
            flexDirection={'column'}
            justifyContent={'space-between'}
            alignItems={'center'}
          >
            {enableScan ? (
              <QrScanner
                onDecode={(result) => handleQrScan(result)}
                onError={(error) => console.log(error?.message)}
              />
            ) : (
              <img
                src={
                  'https://history-computer.com/wp-content/uploads/2022/08/Scan-a-QR-code-header-scaled.jpg'
                }
                width="100%"
                style={{ borderRadius: 5 }}
              />
            )}
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
              disabled={!nodeStart}
              onClick={() => setEnableScan(true)}
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
              {nodeStart ? 'Scan QR Now' : 'Waiting...'}
            </Button>
          </Box>
        )}
        {screenCase === 1 && (
          <Box className={classes.summaryCard}>
            <Box className={classes.inputWrapper}>
              <Box display={'flex'} justifyContent={'center'}>
                <img
                  src={
                    'https://img.freepik.com/premium-vector/cute-wizard-investment-cryptocurrency-fairytale-avatar-character-cartoon-illustration_357749-1173.jpg?w=2000'
                  }
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
                ({scannedUPI} )
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
                disabled={!nodeStart}
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
                onClick={handleTransferFunds}
              >
                {nodeStart ? 'Pay' : 'Waiting...'}
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  )
}
