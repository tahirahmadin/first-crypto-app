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

function App() {
  const { setChainId } = useAccountAbstraction()
  const [activeStep, setActiveStep] = useState(0)

  const setStep = useCallback((newStep: number) => {
    setActiveStep(newStep)
  }, [])

  const ActiveStepComponent = steps[activeStep].component

  return (
    <Providers>
      <>
        <CssBaseline />

        {/* App header */}
        <Header setStep={setStep} />

        <Box
          display="flex"
          gap={3}
          alignItems="flex-start"
          maxWidth="1200px"
          margin="120px auto 42px auto"
        >
          {' '}
          <Grid container>
            <Grid item md={3}>
              <NavMenu setStep={setStep} activeStep={activeStep} />
            </Grid>
            <Grid item md={6}>
              <main style={{ flexGrow: 1 }}>
                {activeStep === 0 && <TradeComponent />}
                {activeStep === 1 && <Portfolio />}
                {activeStep === 2 && <Portfolio />}
              </main>
            </Grid>
          </Grid>
        </Box>
      </>
    </Providers>
  )
}

export default App

const steps = [
  {
    // Auth Kit step
    // TODO
    component: TradeComponent,
    nextLabel: 'to Onramp Kit'
  },
  {
    // Onramp Kit step
    component: Portfolio,
    nextLabel: 'to Relay Kit'
  },
  {
    // Relay Kit step
    component: RelayerKitDemo
  }
]
