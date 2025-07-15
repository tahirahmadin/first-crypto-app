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
  InputLabel,
  Chip,
  Divider,
  IconButton,
  Tooltip,
  Fade,
  Slide,
  Collapse,
  LinearProgress
} from '@mui/material';
import { 
  SwapHoriz, 
  TrendingUp, 
  TrendingDown,
  Speed,
  Info,
  Refresh,
  CheckCircle,
  Error
} from '@mui/icons-material';
import { icpLedgerService } from '../../services/ICPLedgerService';

interface Token {
  symbol: string;
  name: string;
  canisterId: string;
  decimals: number;
  icon: string;
  price: number;
}

const SUPPORTED_TOKENS: Token[] = [
  { symbol: 'ICP', name: 'Internet Computer', canisterId: 'ryjl3-tyaaa-aaaaa-aaaba-cai', decimals: 8, icon: '🟢', price: 12.45 },
  { symbol: 'WICP', name: 'Wrapped ICP', canisterId: 'aanaa-xaaaa-aaaah-aaeiq-cai', decimals: 8, icon: '🔵', price: 12.43 },
  { symbol: 'XTC', name: 'Cycles Token', canisterId: 'aanaa-xaaaa-aaaah-aaeiq-cai', decimals: 12, icon: '🟡', price: 0.0012 }
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
  const [swapProgress, setSwapProgress] = useState(0);
  const [priceImpact, setPriceImpact] = useState(0);
  const [slippage, setSlippage] = useState(0.5);
  const [showAdvanced, setShowAdvanced] = useState(false);

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
    calculateSwapOutput(value);
  };

  const calculateSwapOutput = (inputAmount: string) => {
    const numValue = parseFloat(inputAmount) || 0;
    const fromTokenData = SUPPORTED_TOKENS.find(t => t.symbol === fromToken);
    const toTokenData = SUPPORTED_TOKENS.find(t => t.symbol === toToken);
    
    if (fromTokenData && toTokenData) {
      // Calculate swap rate with price impact
      const baseRate = toTokenData.price / fromTokenData.price;
      const impact = Math.min(numValue * 0.001, 0.05); // Max 5% impact
      const adjustedRate = baseRate * (1 - impact);
      
      const output = numValue * adjustedRate;
      setToAmount(output.toFixed(8));
      setPriceImpact(impact * 100);
    }
  };

  const handleSwapTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
    setFromAmount('');
    setToAmount('');
    setPriceImpact(0);
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
    setSwapProgress(0);

    try {
      // Simulate swap progress
      await simulateSwapProgress();
      
      const txHash = `swap-${Date.now()}`;
      setSuccess(`Swap successful! Transaction: ${txHash}`);
      onSwapComplete?.(txHash);
      
      // Clear form
      setFromAmount('');
      setToAmount('');
      setPriceImpact(0);
      
      // Reload balance
      await loadBalance();
      
    } catch (err) {
      setError('Swap failed. Please try again.');
    } finally {
      setIsLoading(false);
      setSwapProgress(0);
    }
  };

  const simulateSwapProgress = async () => {
    const steps = [20, 50, 80, 100];
    for (const progress of steps) {
      setSwapProgress(progress);
      await new Promise(resolve => setTimeout(resolve, 800));
    }
  };

  const getFromTokenData = () => SUPPORTED_TOKENS.find(t => t.symbol === fromToken);
  const getToTokenData = () => SUPPORTED_TOKENS.find(t => t.symbol === toToken);

  return (
    <Slide direction="up" in={true} mountOnEnter unmountOnExit>
      <Card sx={{ 
        minWidth: 275, 
        mb: 2,
        background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
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
            <SwapHoriz sx={{ mr: 1, fontSize: 28 }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Swap ICP Tokens
            </Typography>
          </Box>
          
          {!isConnected && (
            <Fade in={true}>
              <Alert severity="warning" sx={{ mb: 2, bgcolor: 'rgba(255,255,255,0.1)' }}>
                Please connect your ICP wallet to swap tokens
              </Alert>
            </Fade>
          )}
          
          {error && (
            <Fade in={true}>
              <Alert severity="error" sx={{ mb: 2, bgcolor: 'rgba(255,255,255,0.1)' }}>
                {error}
              </Alert>
            </Fade>
          )}
          
          {success && (
            <Fade in={true}>
              <Alert severity="success" sx={{ mb: 2, bgcolor: 'rgba(255,255,255,0.1)' }}>
                {success}
              </Alert>
            </Fade>
          )}
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* From Token */}
            <Box>
              <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
                From
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <FormControl sx={{ minWidth: 120 }}>
                  <InputLabel sx={{ color: 'rgba(255,255,255,0.8)' }}>Token</InputLabel>
                  <Select
                    value={fromToken}
                    onChange={(e) => setFromToken(e.target.value)}
                    disabled={!isConnected || isLoading}
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.1)',
                      color: 'white',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255,255,255,0.3)',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255,255,255,0.5)',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255,255,255,0.8)',
                      },
                    }}
                  >
                    {SUPPORTED_TOKENS.map((token) => (
                      <MenuItem key={token.symbol} value={token.symbol}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography sx={{ mr: 1 }}>{token.icon}</Typography>
                          {token.symbol}
                        </Box>
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
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'rgba(255,255,255,0.1)',
                      '& fieldset': {
                        borderColor: 'rgba(255,255,255,0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255,255,255,0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'rgba(255,255,255,0.8)',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255,255,255,0.8)',
                    },
                    '& .MuiInputBase-input': {
                      color: 'white',
                    },
                  }}
                />
              </Box>
              {fromToken === 'ICP' && (
                <Typography variant="caption" sx={{ opacity: 0.6 }}>
                  Balance: {balance} ICP
                </Typography>
              )}
            </Box>

            {/* Swap Button */}
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <IconButton
                onClick={handleSwapTokens}
                disabled={isLoading}
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.3)'
                  }
                }}
              >
                <SwapHoriz />
              </IconButton>
            </Box>

            {/* To Token */}
            <Box>
              <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
                To
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <FormControl sx={{ minWidth: 120 }}>
                  <InputLabel sx={{ color: 'rgba(255,255,255,0.8)' }}>Token</InputLabel>
                  <Select
                    value={toToken}
                    onChange={(e) => setToToken(e.target.value)}
                    disabled={!isConnected || isLoading}
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.1)',
                      color: 'white',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255,255,255,0.3)',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255,255,255,0.5)',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255,255,255,0.8)',
                      },
                    }}
                  >
                    {SUPPORTED_TOKENS.map((token) => (
                      <MenuItem key={token.symbol} value={token.symbol}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography sx={{ mr: 1 }}>{token.icon}</Typography>
                          {token.symbol}
                        </Box>
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
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'rgba(255,255,255,0.1)',
                      '& fieldset': {
                        borderColor: 'rgba(255,255,255,0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255,255,255,0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'rgba(255,255,255,0.8)',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255,255,255,0.8)',
                    },
                    '& .MuiInputBase-input': {
                      color: 'white',
                    },
                  }}
                />
              </Box>
            </Box>

            {/* Swap Details */}
            {fromAmount && toAmount && (
              <Collapse in={true}>
                <Box sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 1 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, opacity: 0.8 }}>
                    Swap Details
                  </Typography>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Rate:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      1 {fromToken} = {(parseFloat(toAmount) / parseFloat(fromAmount)).toFixed(6)} {toToken}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Price Impact:</Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 600,
                        color: priceImpact > 2 ? '#ff9800' : '#4caf50'
                      }}
                    >
                      {priceImpact.toFixed(2)}%
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Network Fee:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      0.0001 ICP
                    </Typography>
                  </Box>
                  
                  <Divider sx={{ my: 1, bgcolor: 'rgba(255,255,255,0.2)' }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Minimum Received:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {(parseFloat(toAmount) * (1 - slippage / 100)).toFixed(8)} {toToken}
                    </Typography>
                  </Box>
                </Box>
              </Collapse>
            )}

            {/* Swap Progress */}
            {isLoading && (
              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Processing swap...</Typography>
                  <Typography variant="body2">{swapProgress}%</Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={swapProgress}
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.2)',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: '#4caf50'
                    }
                  }}
                />
              </Box>
            )}
            
            <Button
              variant="contained"
              onClick={handleSwap}
              disabled={!isConnected || isLoading || !fromAmount || !toAmount}
              fullWidth
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.2)',
                color: 'white',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.3)'
                },
                '&:disabled': {
                  bgcolor: 'rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.5)'
                }
              }}
            >
              {isLoading ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                  Swapping...
                </>
              ) : (
                'Swap Tokens'
              )}
            </Button>
          </Box>
          
          <Typography variant="body2" sx={{ mt: 2, opacity: 0.8 }}>
            Swap ICP tokens with other tokens on the Internet Computer
          </Typography>
        </CardContent>
      </Card>
    </Slide>
  );
};

export default ICPSwap; 