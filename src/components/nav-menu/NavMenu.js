import styled from '@emotion/styled'
import { Paper, Theme, useMediaQuery } from '@mui/material'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material'
import FirstCryptoLogo from 'src/assets/CryptoFirst.png'

import { makeStyles } from '@mui/styles'
import {
  Analytics,
  CurrencyExchange,
  HowToVote,
  Logout,
  Person,
  Savings
} from '@mui/icons-material'

const useStyles = makeStyles((theme) => ({
  root: {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    backgroundColor: '#0C0D10'
  },
  inputRoot: {
    backgroundColor: '#6F6F6F',
    height: '100%'
  },
  input: {
    border: '2px solid #bdbdbd',
    outline: 'none',

    '&:active': {
      outline: 'none'
    }
  },
  menuTitle: {
    fontWeight: 600,
    fontSize: 14,
    lineHeight: 1,
    color: '#bdbdbd'
  },
  selectedMenuTitle: {
    fontWeight: 600,
    fontSize: 14,
    lineHeight: 1,
    color: 'black'
  },
  selectedPaper: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    borderRadius: 7,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    marginBottom: 7
  }
}))

const NavMenu = ({ setStep, activeStep }) => {
  const classes = useStyles()
  const theme = useTheme()
  const md = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <Box
      px={2}
      pt={3}
      pb={2}
      bgcolor={'#ffffff'}
      display="flex"
      flexDirection="column"
      height="100%"
      maxWidth={200}
      minWidth={150}
      borderRadius={4}
    >
      <Box>
        <Box py={2}>
          <Box display={'flex'} justifyContent={'flex-start'} alignItems={'center'}>
            <img
              src={FirstCryptoLogo}
              height="36px"
              style={{ borderRadius: '50%', marginRight: 7 }}
            />
            <h4 style={{ paddingLeft: 2, color: 'black' }}>
              First
              <span style={{ fontWeight: 700, color: '#f7931a' }}>
                Crypto<strong>.</strong>
              </span>
            </h4>
          </Box>
        </Box>
        <Box display={'flex'} justifyContent={'start'}>
          <Box pr={1}>
            <img
              src="https://as1.ftcdn.net/v2/jpg/05/99/32/28/1000_F_599322870_hufBazDahX69a57xhcprgfn4WSjAlXZj.jpg"
              style={{
                color: 'white',
                height: 40,
                width: 40,
                borderRadius: 10
              }}
            />
          </Box>
          <Box display={'flex'} flexDirection={'column'} justifyContent={'center'}>
            <Typography
              variant="body1"
              style={{
                color: 'black',
                fontWeight: 600
              }}
            >
              $210
            </Typography>

            <Typography variant="caption" style={{ color: '#414141', lineHeight: 1 }}>
              Wallet Balance
            </Typography>
          </Box>
        </Box>

        <Box pt={5}>
          <Box
            onClick={() => setStep(0)}
            key={0}
            className={classes.selectedPaper}
            style={{
              boxShadow: 0,
              bgcolor: activeStep === 0 ? '#EEEFF3' : 'transparent'
            }}
          >
            <Savings
              style={{
                marginRight: 10,
                color: activeStep === 0 ? '#000000' : '#9e9e9e'
              }}
            />

            <Typography
              variant="title1"
              className={activeStep === 0 ? classes.selectedMenuTitle : classes.menuTitle}
            >
              Invest
            </Typography>
          </Box>
          <Box
            onClick={() => setStep(1)}
            key={0}
            className={classes.selectedPaper}
            sx={{
              boxShadow: 0,
              bgcolor: activeStep === 1 ? '#EEEFF3' : 'transparent'
            }}
          >
            <HowToVote
              style={{
                marginRight: 10,
                color: activeStep === 1 ? '#000000' : '#9e9e9e'
              }}
            />

            <Typography
              variant="title1"
              className={activeStep === 1 ? classes.selectedMenuTitle : classes.menuTitle}
            >
              Vote
            </Typography>
          </Box>
          <Box
            onClick={() => setStep(2)}
            key={1}
            className={classes.selectedPaper}
            sx={{
              boxShadow: 0,
              bgcolor: activeStep === 2 ? '#EEEFF3' : 'transparent'
            }}
          >
            <Analytics
              style={{
                marginRight: 10,
                color: activeStep === 2 || activeStep === 3 ? '#000000' : '#9e9e9e'
              }}
            />

            <Typography
              variant="title1"
              className={
                activeStep === 2 || activeStep === 3 ? classes.selectedMenuTitle : classes.menuTitle
              }
            >
              Portfolio
            </Typography>
          </Box>

          <Paper
            // onClick={disconnect}
            key={0}
            className={classes.selectedPaper}
            sx={{
              boxShadow: 0,
              bgcolor: activeStep === 4 ? 'rgba(130, 71, 229, 0.3)' : 'transparent'
            }}
          >
            <Logout
              style={{
                marginRight: 10,
                color: activeStep === 4 ? 'white' : '#bdbdbd'
              }}
            />
            <Typography
              variant="title1"
              className={activeStep === 4 ? classes.selectedMenuTitle : classes.menuTitle}
            >
              Logout
            </Typography>
          </Paper>
        </Box>
      </Box>
    </Box>
  )
}

export default NavMenu
