import React, { useState } from 'react';
import { Box, Typography, Grid, Paper, Tabs, Tab, Fade } from '@mui/material';
import ICPWallet from '../components/icp/ICPWallet';
import ICPTransaction from '../components/icp/ICPTransaction';
import ICPSwap from '../components/icp/ICPSwap';
import ICPNFT from '../components/icp/ICPNFT';
import ICPDashboard from '../components/icp/ICPDashboard';

const ICPPage: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [identity, setIdentity] = useState<any>(null);
  const [userPrincipal, setUserPrincipal] = useState<string | null>(null);
  const [transactionHistory, setTransactionHistory] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [balance, setBalance] = useState<string>('0.00000000');

  const handleConnect = (userIdentity: any) => {
    setIdentity(userIdentity);
    setIsConnected(true);
    setUserPrincipal(userIdentity.getPrincipal().toText());
    // Simulate balance loading
    setTimeout(() => {
      setBalance('1.23456789');
    }, 1000);
  };

  const handleDisconnect = () => {
    setIdentity(null);
    setIsConnected(false);
    setUserPrincipal(null);
    setBalance('0.00000000');
  };

  const handleTransactionComplete = (txHash: string) => {
    setTransactionHistory(prev => [txHash, ...prev.slice(0, 9)]);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        ICP Integration
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Connect to Internet Identity and manage your ICP tokens
      </Typography>

      <Grid container spacing={3}>
        {/* Dashboard */}
        {isConnected && (
          <Grid item xs={12}>
            <Fade in={true}>
              <ICPDashboard 
                isConnected={isConnected}
                userPrincipal={userPrincipal}
                balance={balance}
              />
            </Fade>
          </Grid>
        )}

        {/* Wallet Connection */}
        <Grid item xs={12} md={4}>
          <ICPWallet 
            onConnect={handleConnect}
            onDisconnect={handleDisconnect}
          />
        </Grid>
        
        {/* Main Actions */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, height: 'fit-content' }}>
            <Tabs value={activeTab} onChange={handleTabChange} centered>
              <Tab label="Send ICP" />
              <Tab label="Swap Tokens" />
              <Tab label="Mint NFT" />
            </Tabs>
            
            <Box sx={{ mt: 2 }}>
              {activeTab === 0 && (
                <ICPTransaction 
                  isConnected={isConnected}
                  onTransactionComplete={handleTransactionComplete}
                />
              )}
              
              {activeTab === 1 && (
                <ICPSwap 
                  isConnected={isConnected}
                  userPrincipal={userPrincipal}
                  onSwapComplete={handleTransactionComplete}
                />
              )}
              
              {activeTab === 2 && (
                <ICPNFT 
                  isConnected={isConnected}
                  userPrincipal={userPrincipal}
                  onNFTMinted={(nft) => {
                    console.log('NFT minted:', nft);
                    handleTransactionComplete(`NFT: ${nft.name}`);
                  }}
                />
              )}
            </Box>
          </Paper>
        </Grid>
        
        {/* Transaction History */}
        {transactionHistory.length > 0 && (
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
                {transactionHistory.map((txHash, index) => (
                  <Typography key={index} variant="body2" sx={{ mb: 1 }}>
                    {txHash}
                  </Typography>
                ))}
              </Box>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default ICPPage; 