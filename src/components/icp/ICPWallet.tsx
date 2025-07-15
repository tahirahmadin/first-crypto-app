import React, { useState } from 'react';
import { Box, Button, Typography, Card, CardContent, Alert, CircularProgress } from '@mui/material';
import { AuthClient } from '@dfinity/agent';

interface ICPWalletProps {
  onConnect?: (identity: any) => void;
  onDisconnect?: () => void;
}

const ICPWallet: React.FC<ICPWalletProps> = ({ onConnect, onDisconnect }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [principal, setPrincipal] = useState<string | null>(null);

  const connectWallet = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const authClient = await AuthClient.create();
      const isAuthenticated = await authClient.isAuthenticated();
      
      if (!isAuthenticated) {
        await authClient.login({
          identityProvider: 'https://identity.ic0.app',
          onSuccess: () => console.log('Auth successful'),
          onError: (error) => setError('Authentication failed')
        });
      }

      const identity = authClient.getIdentity();
      const currentPrincipal = identity.getPrincipal();
      setPrincipal(currentPrincipal.toText());
      setIsConnected(true);
      onConnect?.(identity);
      
    } catch (err) {
      setError('Failed to connect to ICP wallet');
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    setPrincipal(null);
    setIsConnected(false);
    onDisconnect?.();
  };

  return (
    <Card sx={{ minWidth: 275, mb: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          ICP Wallet
        </Typography>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        {!isConnected ? (
          <Box>
            <Button
              variant="contained"
              onClick={connectWallet}
              disabled={isLoading}
              fullWidth
              sx={{ mb: 2 }}
            >
              {isLoading ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  Connecting...
                </>
              ) : (
                'Connect ICP Wallet'
              )}
            </Button>
            <Typography variant="body2" color="text.secondary">
              Connect your Internet Identity to access ICP features
            </Typography>
          </Box>
        ) : (
          <Box>
            <Typography variant="body1" gutterBottom>
              <strong>Principal:</strong> {principal}
            </Typography>
            <Button variant="outlined" onClick={disconnectWallet} sx={{ mt: 2 }}>
              Disconnect
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ICPWallet; 