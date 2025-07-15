import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Card, 
  CardContent, 
  Alert,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { icpLedgerService } from '../../services/ICPLedgerService';

interface Token {
  symbol: string;
  name: string;
  canisterId: string;
  decimals: number;
}

const SUPPORTED_TOKENS: Token[] = [
  { symbol: 'ICP', name: 'Internet Computer', canisterId: 'ryjl3-tyaaa-aaaaa-aaaba-cai', decimals: 8 },
  { symbol: 'WICP', name: 'Wrapped ICP', canisterId: 'aanaa-xaaaa-aaaah-aaeiq-cai', decimals: 8 },
  { symbol: 'XTC', name: 'Cycles Token', canisterId: 'aanaa-xaaaa-aaaah-aaeiq-cai', decimals: 12 }
];

interface ICPSwapProps {
  isConnected: boolean;
  userPrincipal: string | null;
  onSwapComplete?: (txHash: string) => void;
}

const ICPSwap: React.FC<ICPSwapProps> = ({ 
  isConnected, 
  userPrincipal, 
  onSwapComplete 
}) => {
  const [fromToken, setFromToken] = useState<string>('ICP');
  const [toToken, setToToken] = useState<string>('WICP');
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>('0');

  useEffect(() => {
    if (isConnected && userPrincipal) {
      loadBalance();
    }
  }, [isConnected, userPrincipal, fromToken]);

  const loadBalance = async () => {
    if (!userPrincipal) return;
    
    try {
      const balanceData = await icpLedgerService.getBalance(userPrincipal);
      setBalance(balanceData.formatted);
    } catch (error) {
      console.error('Failed to load balance:', error);
    }
  };

  const handleFromAmountChange = (value: string) => {
    setFromAmount(value);
    // Calculate estimated output (simplified)
    const numValue = parseFloat(value) || 0;
    if (fromToken === 'ICP' && toToken === 'WICP') {
      setToAmount((numValue * 0.99).toFixed(8)); // 1% fee
    } else if (fromToken === 'WICP' && toToken === 'ICP') {
      setToAmount((numValue * 0.99).toFixed(8));
    } else {
      setToAmount((numValue * 0.98).toFixed(8)); // 2% fee for other swaps
    }
  };

  const handleSwapTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
    setFromAmount('');
    setToAmount('');
  };

  const handleSwap = async () => {
    if (!isConnected || !userPrincipal) {
      setError('Please connect your ICP wallet first');
      return;
    }

    if (!fromAmount || !toAmount) {
      setError('Please enter amounts');
      return;
    }

    const numAmount = parseFloat(fromAmount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Convert ICP amount to e8s
      const amountInE8s = icpLedgerService.icpToE8s(numAmount);
      
      // For demo purposes, we'll simulate a swap
      // In a real implementation, you would:
      // 1. Call the swap canister
      // 2. Execute the actual token swap
      // 3. Handle the swap result
      
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate swap time
      
      const txHash = `swap-${Date.now()}`;
      setSuccess(`Swap successful! Transaction: ${txHash}`);
      onSwapComplete?.(txHash);
      
      // Clear form
      setFromAmount('');
      setToAmount('');
      
      // Reload balance
      await loadBalance();
      
    } catch (err) {
      setError('Swap failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card sx={{ minWidth: 275, mb: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Swap ICP Tokens
        </Typography>
        
        {!isConnected && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Please connect your ICP wallet to swap tokens
          </Alert>
        )}
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* From Token */}
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              From
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel>Token</InputLabel>
                <Select
                  value={fromToken}
                  onChange={(e) => setFromToken(e.target.value)}
                  disabled={!isConnected || isLoading}
                >
                  {SUPPORTED_TOKENS.map((token) => (
                    <MenuItem key={token.symbol} value={token.symbol}>
                      {token.symbol}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Amount"
                type="number"
                value={fromAmount}
                onChange={(e) => handleFromAmountChange(e.target.value)}
                placeholder="0.0"
                disabled={!isConnected || isLoading}
                fullWidth
              />
            </Box>
            {fromToken === 'ICP' && (
              <Typography variant="caption" color="text.secondary">
                Balance: {balance} ICP
              </Typography>
            )}
          </Box>

          {/* Swap Button */}
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="outlined"
              onClick={handleSwapTokens}
              disabled={isLoading}
              sx={{ minWidth: 50 }}
            >
              ↓
            </Button>
          </Box>

          {/* To Token */}
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              To
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel>Token</InputLabel>
                <Select
                  value={toToken}
                  onChange={(e) => setToToken(e.target.value)}
                  disabled={!isConnected || isLoading}
                >
                  {SUPPORTED_TOKENS.map((token) => (
                    <MenuItem key={token.symbol} value={token.symbol}>
                      {token.symbol}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Amount"
                type="number"
                value={toAmount}
                onChange={(e) => setToAmount(e.target.value)}
                placeholder="0.0"
                disabled={!isConnected || isLoading}
                fullWidth
              />
            </Box>
          </Box>

          {/* Swap Rate */}
          <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Rate: 1 {fromToken} ≈ {toAmount && fromAmount ? (parseFloat(toAmount) / parseFloat(fromAmount)).toFixed(6) : '0'} {toToken}
            </Typography>
          </Box>
          
          <Button
            variant="contained"
            onClick={handleSwap}
            disabled={!isConnected || isLoading || !fromAmount || !toAmount}
            fullWidth
          >
            {isLoading ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Swapping...
              </>
            ) : (
              'Swap Tokens'
            )}
          </Button>
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Swap ICP tokens with other tokens on the Internet Computer
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ICPSwap; 