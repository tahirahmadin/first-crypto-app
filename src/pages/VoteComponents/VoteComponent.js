import { Box, Button, Typography, useTheme } from '@mui/material'
// Waku imports
import { ContentPairProvider, useWaku } from '@waku/react'
import StrategyVotingComponent from './StrategyVotingComponent'

export default function VoteComponent() {
  const theme = useTheme()

  let accountSC = '0x87228Dd1eca832d14f4aB0CFb99c471195E7f6dB'

  const copyToClip = async () => {
    await navigator.clipboard.writeText(accountSC)
    alert('Wallet address is copied')
  }
  return (
    <Box>
      <ContentPairProvider contentTopic={'/governance/' + 12345}>
        <StrategyVotingComponent room={12345} />
      </ContentPairProvider>
    </Box>
  )
}
