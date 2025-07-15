import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Card, 
  CardContent, 
  Alert,
  CircularProgress,
  Chip,
  Avatar,
  Divider,
  IconButton,
  Tooltip,
  Fade,
  Slide
} from '@mui/material';
import { 
  AccountBalanceWallet, 
  ContentCopy, 
  Refresh, 
  Visibility,
  VisibilityOff,
  CheckCircle,
  Error
} from '@mui/icons-material';
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
  const [balance, setBalance] = useState<string>('0.00000000');
  const [showBalance, setShowBalance] = useState(true);
  const [copied, setCopied] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

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
      
      // Simulate balance loading
      setTimeout(() => {
        setBalance('1.23456789');
        setLastUpdated(new Date());
      }, 1000);
      
    } catch (err) {
      setError('Failed to connect to ICP wallet');
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    setPrincipal(null);
    setBalance('0.00000000');
    setLastUpdated(null);
    setIsConnected(false);
    onDisconnect?.();
  };

  const copyPrincipal = async () => {
    if (principal) {
      await navigator.clipboard.writeText(principal);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const refreshBalance = async () => {
    if (!isConnected) return;
    
    setIsLoading(true);
    // Simulate balance refresh
    setTimeout(() => {
      setBalance((Math.random() * 2 + 0.5).toFixed(8));
      setLastUpdated(new Date());
      setIsLoading(false);
    }, 1000);
  };

  const formatPrincipal = (principal: string) => {
    if (principal.length <= 20) return principal;
    return `${principal.slice(0, 10)}...${principal.slice(-10)}`;
  };

  return (
    <Slide direction="up" in={true} mountOnEnter unmountOnExit>
      <Card 
        sx={{ 
          minWidth: 275, 
          mb: 2,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Background Pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            opacity: 0.3
          }}
        />
        
        <CardContent sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', mr: 2 }}>
              <AccountBalanceWallet />
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              ICP Wallet
            </Typography>
          </Box>
          
          {error && (
            <Fade in={true}>
              <Alert 
                severity="error" 
                sx={{ mb: 2, bgcolor: 'rgba(255,255,255,0.1)' }}
                icon={<Error />}
              >
                {error}
              </Alert>
            </Fade>
          )}
          
          {!isConnected ? (
            <Fade in={true}>
              <Box>
                <Button
                  variant="contained"
                  onClick={connectWallet}
                  disabled={isLoading}
                  fullWidth
                  sx={{ 
                    mb: 2,
                    bgcolor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.3)'
                    }
                  }}
                >
                  {isLoading ? (
                    <>
                      <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                      Connecting...
                    </>
                  ) : (
                    'Connect ICP Wallet'
                  )}
                </Button>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Connect your Internet Identity to access ICP features
                </Typography>
              </Box>
            </Fade>
          ) : (
            <Fade in={true}>
              <Box>
                {/* Connection Status */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Chip 
                    icon={<CheckCircle />}
                    label="Connected"
                    sx={{ 
                      bgcolor: 'rgba(76, 175, 80, 0.2)',
                      color: 'white',
                      '& .MuiChip-icon': { color: '#4caf50' }
                    }}
                  />
                  <Box sx={{ flexGrow: 1 }} />
                  <IconButton 
                    onClick={refreshBalance}
                    disabled={isLoading}
                    sx={{ color: 'white' }}
                  >
                    <Refresh sx={{ 
                      transform: isLoading ? 'rotate(360deg)' : 'none',
                      transition: 'transform 1s linear'
                    }} />
                  </IconButton>
                </Box>

                {/* Principal Address */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
                    Principal Address
                  </Typography>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    bgcolor: 'rgba(255,255,255,0.1)',
                    borderRadius: 1,
                    p: 1
                  }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontFamily: 'monospace',
                        flexGrow: 1
                      }}
                    >
                      {formatPrincipal(principal || '')}
                    </Typography>
                    <Tooltip title={copied ? "Copied!" : "Copy address"}>
                      <IconButton 
                        onClick={copyPrincipal}
                        size="small"
                        sx={{ color: 'white' }}
                      >
                        {copied ? <CheckCircle /> : <ContentCopy />}
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>

                <Divider sx={{ my: 2, bgcolor: 'rgba(255,255,255,0.2)' }} />

                {/* Balance */}
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      Balance
                    </Typography>
                    <Box sx={{ flexGrow: 1 }} />
                    <IconButton 
                      onClick={() => setShowBalance(!showBalance)}
                      size="small"
                      sx={{ color: 'white' }}
                    >
                      {showBalance ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    {showBalance ? `${balance} ICP` : '•••••••• ICP'}
                  </Typography>
                  {lastUpdated && (
                    <Typography variant="caption" sx={{ opacity: 0.6 }}>
                      Last updated: {lastUpdated.toLocaleTimeString()}
                    </Typography>
                  )}
                </Box>

                <Button 
                  variant="outlined" 
                  onClick={disconnectWallet}
                  sx={{ 
                    borderColor: 'rgba(255,255,255,0.3)',
                    color: 'white',
                    '&:hover': {
                      borderColor: 'rgba(255,255,255,0.5)',
                      bgcolor: 'rgba(255,255,255,0.1)'
                    }
                  }}
                >
                  Disconnect
                </Button>
              </Box>
            </Fade>
          )}
        </CardContent>
      </Card>
    </Slide>
  );
};

export default ICPWallet; 