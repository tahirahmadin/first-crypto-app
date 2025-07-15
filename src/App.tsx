import { useCallback, useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'
import '@safe-global/safe-react-components/dist/fonts.css'
import Header from 'src/components/header/Header'
import Providers from 'src/components/providers/Providers'
import OnRampKitDemo from 'src/pages/OnRampKitDemo'
import RelayerKitDemo from 'src/pages/RelayerKitDemo'
import NavMenu from './components/nav-menu/NavMenu'
import { useAccountAbstraction } from './store/accountAbstractionContext'
import TradeComponent from './TradeComponents/TradeComponent'
import { Grid } from '@mui/material'
import Portfolio from './pages/PortfolioComponents/Portfolio'
import HistoryComponent from './pages/PortfolioComponents/HistoryComponent'
import VoteComponent from './pages/VoteComponents/VoteComponent'
import ICPPage from './pages/ICPPage'
// Waku imports
import { LightNodeProvider } from '@waku/react'
import { Protocols } from '@waku/sdk'
import ScanAndPay from './pages/PortfolioComponents/ScanAndPay'
import ScanPayWrapper from './pages/PortfolioComponents/ScanPayWrapper'

function App() {
  const { setChainId } = useAccountAbstraction()
  const [activeStep, setActiveStep] = useState(0)

  const setStep = useCallback((newStep: number) => {
    setActiveStep(newStep)
  }, [])

  return (
    <LightNodeProvider
      options={{ defaultBootstrap: true }}
      protocols={[Protocols.Store, Protocols.Filter, Protocols.LightPush]}
    >
      <Providers>
        <>
          <CssBaseline />

          {/* App header */}
          <Header setStep={setStep} />

          <Box maxWidth="1000px" margin="40px auto 42px auto">
            <Grid container spacing={1}>
              <Grid item md={3} sm={12} xs={12}>
                <NavMenu setStep={setStep} activeStep={activeStep} />
              </Grid>
              <Grid item md={6} sm={12} xs={12} display={'flex'} justifyContent={'center'}>
                <main style={{ flexGrow: 1 }}>
                  {activeStep === 0 && <TradeComponent />}
                  {activeStep === 1 && <VoteComponent />}
                  {activeStep === 2 && <Portfolio />}
                  {activeStep === 3 && <ScanPayWrapper />}
                  {activeStep === 4 && <ICPPage />}
                </main>
              </Grid>
              <Grid item md={3} sm={12} xs={12}>
                <main style={{ flexGrow: 1 }}>
                  {(activeStep === 2 || activeStep === 0) && <HistoryComponent setStep={setStep} />}
                </main>
              </Grid>
            </Grid>
          </Box>
        </>
      </Providers>
    </LightNodeProvider>
  )
}

export default App
