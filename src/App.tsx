import { useCallback, useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CssBaseline from '@mui/material/CssBaseline'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import '@safe-global/safe-react-components/dist/fonts.css'

import Header from 'src/components/header/Header'
import Providers from 'src/components/providers/Providers'
import AuthKitDemo from 'src/pages/AuthKitDemo'
import Intro from 'src/pages/Intro'
import OnRampKitDemo from 'src/pages/OnRampKitDemo'
import RelayerKitDemo from 'src/pages/RelayerKitDemo'
import NavMenu from './components/nav-menu/NavMenu'
import SafeCoreInfo from './components/safe-core-info/SafeCoreInfo'
import { useAccountAbstraction } from './store/accountAbstractionContext'
import isMoneriumRedirect from './utils/isMoneriumRedirect'
import TradeComponent from './TradeComponents/TradeComponent'
import { StyledEngineProvider } from '@mui/material/styles'
import { ThemeProvider } from '@mui/material/styles'

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
          <NavMenu setStep={setStep} activeStep={activeStep} />

          <main style={{ flexGrow: 1 }}>
            <ActiveStepComponent setStep={setStep} />
          </main>
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
    component: OnRampKitDemo,
    nextLabel: 'to Relay Kit'
  },
  {
    // Relay Kit step
    component: RelayerKitDemo
  }
]
