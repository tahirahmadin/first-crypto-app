import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import FirstCryptoLogo from 'src/assets/CryptoFirst.png'
import { useTheme } from 'src/store/themeContext'
import { useAccountAbstraction } from 'src/store/accountAbstractionContext'
import SafeInfo from '../safe-info/SafeInfo'

type HeaderProps = {
  setStep: (newStep: number) => void
}

function Header({ setStep }: HeaderProps) {
  const { switchThemeMode, isDarkTheme } = useTheme()

  const { chain, safeSelected, chainId } = useAccountAbstraction()

  return (
    <Container maxWidth="xl">
      <Toolbar disableGutters style={{ marginTop: 15 }}>
        {/* App Logo */}
        <img
          style={{ cursor: 'pointer', height: 50 }}
          onClick={() => setStep(0)} // go to Home
          id="app-logo-header"
          src={FirstCryptoLogo}
          alt="FirstCrypto logo"
        />
        <h4 style={{ paddingLeft: 10 }}>
          First
          <span style={{ fontWeight: 700, color: '#f7931a' }}>
            Crypto <strong>.</strong>
          </span>
        </h4>
        <Box display="flex" alignItems="center" justifyContent="flex-end" flexGrow={1} gap={1}>
          {/* chain label */}
          {chain && (
            <Box display="flex" justifyContent="flex-end" alignItems="center">
              {/* <ChainLabel chain={chain} /> */}
              {/* <ChainSelector /> */}
              {safeSelected && <SafeInfo safeAddress={safeSelected} chainId={chainId} />}
            </Box>
          )}
        </Box>
      </Toolbar>
    </Container>
  )
}

export default Header
