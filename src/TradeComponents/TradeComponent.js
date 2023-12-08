import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import styled from '@emotion/styled'
import { Theme } from '@mui/material'

import safeLogo from 'src/assets/safe-logo.svg'
import ChainSelector from 'src/components/chain-selector/ChainSelector'

const TradeComponent = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="flex-start"
      paddingTop="72px"
      paddingLeft="100px"
    >
      <Typography variant="h1" fontSize="64px" lineHeight="76px">
        Account Abstraction SDK
      </Typography>

      <Typography variant="body1">
        Add account abstraction functionality into your apps. Here you can find examples on how to
        use our different kits:
      </Typography>

      <Divider style={{ alignSelf: 'stretch', margin: '42px 0' }} />

      <Typography variant="h2" fontWeight="700" fontSize="20px">
        To start using interactive demo select a network:
      </Typography>

      <Typography>
        Please note: the Onramp kit will only work in the EU on Görli and in the US on Mumbai test
        chains.
      </Typography>
    </Box>
  )
}

export default TradeComponent
