import { useState } from 'react'
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Input,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material'
import { makeStyles } from '@mui/styles'

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
    borderRadius: '1rem',
    '&:hover': {
      boxShadow: '0px 24px 33px -9px #0000005C'
    }
  },
  summaryCard: {
    // backgroundColor: "#ffffff",
    background: 'linear-gradient(to bottom, #6385f3, #5a7ff2)',
    backgroundImage: `url("eth-background.jpg"), linear-gradient(#9DA7DA, #5C6AC0)`,
    backgroundSize: 'cover',
    marginBottom: 5,
    paddingTop: 7,
    paddingBottom: 7,
    paddingLeft: 14,
    paddingRight: 14,
    width: '100%',
    height: '100%',
    minHeight: 170,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
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
    border: '1px solid #cfd8dc',
    padding: '6px 20px 6px 20px',
    borderRadius: 10,
    backgroundColor: 'rgba(106, 85, 234,0.03)',
    color: 'black'

    // background: 'linear-gradient(to bottom, #6385f3, #5a7ff2)'
  }
}))

const TradeComponent = () => {
  const classes = useStyles()
  const theme = useTheme()
  const md = useMediaQuery(theme.breakpoints.down('md'))

  const [screenCase, setScreenCase] = useState(2)
  const [amount, setAmount] = useState('10')
  const [token, setToken] = useState('Ethereum')
  const [frequency, setFrequency] = useState(1)
  const [time, setTime] = useState(5)
  const [stakeCase, setStakeCase] = useState(0)
  const [approveCase, setApproveCase] = useState(0)
  const [refetch, setRefetch] = useState(0)
  const [isApproved, setIsApproved] = useState(false)
  const [totalValue, setTotalValue] = useState(0)

  let accountSC = '0x87228Dd1eca832d14f4aB0CFb99c471195E7f6dB'

  const handleApprove = async () => {}

  const handleStake = async () => {}

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="flex-start"
      paddingLeft="100px"
      maxWidth={500}
    >
      <Box display={'flex'} justifyContent={'flex-start'} alignItems={'center'} mb={1}>
        <Typography
          fontSize={12}
          fontWeight={600}
          color={screenCase === 0 ? '#f9f9f9' : '#bdbdbd'}
          textAlign={'center'}
          ml={1}
        >
          Step 1: Login
        </Typography>

        <Typography
          fontSize={12}
          fontWeight={600}
          color={screenCase === 1 ? '#f9f9f9' : '#bdbdbd'}
          textAlign={'center'}
          ml={1}
        >
          • Step 2: Fund the wallet
        </Typography>
        <Typography
          fontSize={12}
          fontWeight={600}
          color={screenCase === 2 ? '#f9f9f9' : '#bdbdbd'}
          textAlign={'center'}
          ml={1}
        >
          • Step 3: Accumulate token
        </Typography>
      </Box>
      <Box className={classes.card}>
        <Typography
          variant="body2"
          fontSize={20}
          fontWeight={700}
          color={'#000000'}
          textAlign={'center'}
          my={1}
        >
          Invest
        </Typography>

        <Box className={classes.summaryCard}>
          <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
            <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
              <img
                src="https://w7.pngwing.com/pngs/268/1013/png-transparent-ethereum-eth-hd-logo-thumbnail.png"
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
                Ethereum
              </Typography>
            </Box>

            <Typography
              style={{ textTransform: 'capitalize' }}
              variant="body2"
              fontWeight={500}
              fontSize={md ? 14 : 12}
              color={'#ffffff'}
            >
              Buy ${amount}/month
            </Typography>
          </Box>
          <Box>
            <Typography
              variant="h1"
              fontSize={44}
              fontWeight={800}
              color={'#f9f9f9'}
              textAlign={'center'}
              py={2}
            >
              ${totalValue}
            </Typography>
            <Typography
              variant="body2"
              fontSize={12}
              fontWeight={400}
              color={'#f9f9f9'}
              textAlign={'center'}
            >
              Total investment
            </Typography>
          </Box>
        </Box>
        <Typography
          variant="body2"
          fontSize={20}
          fontWeight={700}
          color={'#000000'}
          textAlign={'center'}
          mt={2}
        >
          Start Dollar Cost Averaging
        </Typography>
        <Box className={classes.inputCard} mt={2}>
          <Typography fontSize={14} fontWeight={600} color={'#000000'} textAlign={'left'} mt={1}>
            I want to buy Ethereum of:
          </Typography>
          <Grid container spacing={1}>
            <Grid item md={6} xs={6}>
              <Box mt={1} className={classes.inputWrapper}>
                <Typography
                  variant="subtitle2"
                  textAlign={'left'}
                  lineHeight={1}
                  style={{ color: 'black', fontWeight: 600 }}
                >
                  Amount per day:
                </Typography>
                <Input
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  fullWidth
                  placeholder="Enter amount"
                  disableUnderline
                  style={{ fontSize: 14, fontWeight: 400, color: '#414141' }}
                />
              </Box>
            </Grid>
            <Grid item md={6} xs={6}>
              <Box mt={1} className={classes.inputWrapper}>
                <Typography
                  variant="body2"
                  textAlign={'left'}
                  lineHeight={1}
                  style={{ color: 'black', fontWeight: 600 }}
                >
                  No of days:
                </Typography>
                <Input
                  value={time}
                  onChange={(event) => setTime(event.target.value)}
                  fullWidth
                  placeholder="Enter no of orders"
                  disableUnderline
                  style={{ fontSize: 14, fontWeight: 400, color: '#414141' }}
                />
              </Box>
            </Grid>
          </Grid>

          <Typography
            variant="body2"
            fontSize={12}
            fontWeight={400}
            color={'#414141'}
            textAlign={'center'}
            mt={2}
          >
            Beat inflation with Crypto!
          </Typography>
        </Box>

        <Button
          className={classes.buttonConnect}
          mt={2}
          disabled={!accountSC}
          onClick={isApproved ? handleStake : handleApprove}
        >
          {isApproved ? 'Buy Now' : 'Approve Spending'}{' '}
          {(approveCase > 0 || (stakeCase > 0 && stakeCase < 3)) && (
            <CircularProgress
              size={18}
              style={{
                color: 'white',
                marginLeft: 5
              }}
            />
          )}
        </Button>
      </Box>
    </Box>
  )
}

export default TradeComponent
