import { Box, Button, Typography, useTheme } from '@mui/material'
// Waku imports
import { ContentPairProvider, useWaku } from '@waku/react'
import StrategyVotingComponent from './StrategyVotingComponent'
import { useAccountAbstraction } from 'src/store/accountAbstractionContext'

export default function VoteComponent() {
  const theme = useTheme()

  const { safeSelected } = useAccountAbstraction()
  let accountSC = safeSelected

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
