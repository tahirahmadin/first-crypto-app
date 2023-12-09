import { makeStyles } from '@mui/styles'

import { Box, Typography, useTheme } from '@mui/material'

import { Cancel, CopyAll, LocationCity, MyLocation } from '@mui/icons-material'

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
    // backgroundColor: "#ffffff",
    // url(''), linear-gradient(#e89e66, #E57A26)
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
    paddingTop: 30,
    paddingBottom: 20,
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
  }
}))

export default function VoteComponent() {
  const classes = useStyles()
  const theme = useTheme()

  let accountSC = '0x87228Dd1eca832d14f4aB0CFb99c471195E7f6dB'

  const copyToClip = async () => {
    await navigator.clipboard.writeText(accountSC)
    alert('Wallet address is copied')
  }
  return (
    <Box>
      <Typography
        variant="body2"
        fontSize={20}
        fontWeight={700}
        color={'#000000'}
        textAlign={'center'}
        my={1}
      >
        My Social Profile
      </Typography>

      <Box className={classes.summaryCard}>
        <Box
          display={'flex'}
          flexDirection={'column'}
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          <Typography fontSize={12} fontWeight={600} color={'#f9f9f9'} textAlign={'center'}>
            <Box>
              <img
                src={
                  'https://as1.ftcdn.net/v2/jpg/05/99/32/28/1000_F_599322870_hufBazDahX69a57xhcprgfn4WSjAlXZj.jpg'
                }
                height="100px"
                width="100px"
                style={{ borderRadius: '50%' }}
              />
            </Box>
            Tahir Ahmad
          </Typography>
          <Typography
            variant="body2"
            fontSize={12}
            fontWeight={400}
            color={'#ffffff'}
            textAlign={'center'}
          >
            21
          </Typography>
          <Typography
            variant="body2"
            fontSize={12}
            fontWeight={400}
            color={'#ffffff'}
            textAlign={'center'}
          >
            21
          </Typography>
          <Box mt={1} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
            <Box
              style={{ color: 'white' }}
              display={'flex'}
              justifyContent={'flex-start'}
              alignItems={'center'}
              mr={2}
            >
              <LocationCity style={{ color: 'white' }} />{' '}
              <Typography
                variant="body2"
                fontSize={12}
                fontWeight={400}
                color={'#ffffff'}
                textAlign={'center'}
              >
                32
              </Typography>
            </Box>
            <Box
              style={{ color: 'white' }}
              display={'flex'}
              justifyContent={'flex-end'}
              alignItems={'center'}
              ml={2}
            >
              <MyLocation style={{ color: 'white' }} />{' '}
              <Typography
                variant="body2"
                fontSize={12}
                fontWeight={400}
                color={'#ffffff'}
                textAlign={'center'}
              >
                India
              </Typography>
            </Box>
          </Box>
        </Box>{' '}
        <Typography
          variant="body2"
          fontSize={12}
          fontWeight={500}
          color={'#E4E4E2'}
          textAlign={'center'}
          mt={3}
        >
          Wallet Address
        </Typography>
        <Typography
          variant="body2"
          fontSize={12}
          fontWeight={400}
          color={'#ffffff'}
          textAlign={'center'}
        >
          {accountSC} <CopyAll onClick={copyToClip} style={{ cursor: 'pointer' }} />
        </Typography>
      </Box>

      <Typography
        variant="body2"
        fontSize={15}
        fontWeight={700}
        color={'#000000'}
        textAlign={'center'}
        my={1}
      >
        My Activities
      </Typography>
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
