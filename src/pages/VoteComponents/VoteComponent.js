import { makeStyles } from '@mui/styles'

import { Box, Button, Typography, useTheme } from '@mui/material'

import { Cancel, CopyAll, LocationCity, MyLocation, Support, ThumbUpAlt } from '@mui/icons-material'

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
    backgroundImage: `url(''), linear-gradient(#7A2C88, #EC1E79)`,
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
      <Box className={classes.summaryCard}>
        <Box
          display={'flex'}
          flexDirection={'column'}
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          <img
            src={'https://i.ytimg.com/vi/-fnk_fDO2rw/maxresdefault.jpg'}
            height="300px"
            width="100%"
            style={{ borderRadius: 10 }}
          />
          <Typography
            variant="h2"
            fontSize={24}
            fontWeight={600}
            color={'#f9f9f9'}
            textAlign={'left'}
          >
            Governance: New strategy proposal - Buy the dip and sell the profit
          </Typography>
          <Typography
            variant="body2"
            fontSize={14}
            fontWeight={400}
            color={'#ffffff'}
            textAlign={'left'}
            mt={1}
          >
            we are looking for votes to support or reject the new strategy to add in the platform
            which requires you to vote using Waku Communications
          </Typography>

          <Box mt={1} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
            <Box
              style={{ color: 'white' }}
              display={'flex'}
              justifyContent={'flex-start'}
              alignItems={'center'}
              mr={2}
            >
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
                <ThumbUpAlt style={{ color: 'black' }} />
                Support
              </Button>
            </Box>
            <Box
              style={{ color: 'white' }}
              display={'flex'}
              justifyContent={'flex-end'}
              alignItems={'center'}
              ml={2}
            >
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
                <ThumbUpAlt style={{ color: 'black' }} /> Reject
              </Button>
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
          Voting will end in next 35 minutues
        </Typography>
      </Box>
    </Box>
  )
}
