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
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Paper,
  Chip,
  Divider,
  IconButton,
  Tooltip,
  Fade,
  Slide,
  Collapse
} from '@mui/material';
import { 
  Send, 
  AccountBalance, 
  Speed, 
  CheckCircle,
  Error,
  Info,
  ContentCopy,
  Visibility
} from '@mui/icons-material';
import { Principal } from '@dfinity/principal';

interface ICPTransactionProps {
  isConnected: boolean;
  onTransactionComplete?: (txHash: string) => void;
}

const ICPTransaction: React.FC<ICPTransactionProps> = ({ 
  isConnected, 
  onTransactionComplete 
}) => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [gasEstimate, setGasEstimate] = useState('0.0001');
  const [isValidPrincipal, setIsValidPrincipal] = useState(false);

  const validatePrincipal = (principalString: string): boolean => {
    try {
      Principal.fromText(principalString);
      return true;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    if (recipient) {
      setIsValidPrincipal(validatePrincipal(recipient));
    } else {
      setIsValidPrincipal(false);
    }
  }, [recipient]);

  const handleAmountChange = (value: string) => {
    setAmount(value);
    // Simulate gas estimation based on amount
    const numValue = parseFloat(value) || 0;
    const estimatedGas = Math.max(0.0001, numValue * 0.00001);
    setGasEstimate(estimatedGas.toFixed(6));
  };

  const handleSendTransaction = async () => {
    if (!isConnected) {
      setError('Please connect your ICP wallet first');
      return;
    }

    if (!recipient || !amount) {
      setError('Please fill in all fields');
      return;
    }

    if (!isValidPrincipal) {
      setError('Invalid principal address');
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);
    setActiveStep(0);

    try {
      // Simulate transaction steps
      await simulateTransactionSteps();
      
      const txHash = `icp-tx-${Date.now()}`;
      setSuccess(`Transaction successful! Hash: ${txHash}`);
      onTransactionComplete?.(txHash);
      
      // Clear form
      setRecipient('');
      setAmount('');
      setMemo('');
      setShowPreview(false);
      
    } catch (err) {
      setError('Transaction failed. Please try again.');
    } finally {
      setIsLoading(false);
      setActiveStep(0);
    }
  };

  const simulateTransactionSteps = async () => {
    // Step 1: Validating transaction
    setActiveStep(1);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Step 2: Broadcasting to network
    setActiveStep(2);
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Step 3: Confirming transaction
    setActiveStep(3);
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
  };

  const steps = [
    {
      label: 'Validating transaction',
      description: 'Checking recipient address and amount...',
      icon: <CheckCircle />
    },
    {
      label: 'Broadcasting to network',
      description: 'Sending transaction to ICP network...',
      icon: <Speed />
    },
    {
      label: 'Confirming transaction',
      description: 'Waiting for network confirmation...',
      icon: <AccountBalance />
    }
  ];

  return (
    <Slide direction="up" in={true} mountOnEnter unmountOnExit>
      <Card sx={{ 
        minWidth: 275, 
        mb: 2,
        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
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
            <Send sx={{ mr: 1, fontSize: 28 }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Send ICP
            </Typography>
          </Box>
          
          {!isConnected && (
            <Fade in={true}>
              <Alert severity="warning" sx={{ mb: 2, bgcolor: 'rgba(255,255,255,0.1)' }}>
                Please connect your ICP wallet to send transactions
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
            <TextField
              label="Recipient Principal"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Enter recipient principal address"
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
              InputProps={{
                endAdornment: recipient && (
                  <Tooltip title={isValidPrincipal ? "Valid principal" : "Invalid principal"}>
                    <Box sx={{ color: isValidPrincipal ? '#4caf50' : '#f44336' }}>
                      {isValidPrincipal ? <CheckCircle /> : <Error />}
                    </Box>
                  </Tooltip>
                ),
              }}
            />
            
            <TextField
              label="Amount (ICP)"
              type="number"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
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
            
            <TextField
              label="Memo (Optional)"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="Add a memo to your transaction"
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

            {/* Transaction Preview */}
            {recipient && amount && isValidPrincipal && (
              <Collapse in={true}>
                <Paper sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.1)', mt: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, opacity: 0.8 }}>
                    Transaction Preview
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Amount:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {parseFloat(amount).toFixed(8)} ICP
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Network Fee:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {gasEstimate} ICP
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 1, bgcolor: 'rgba(255,255,255,0.2)' }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Total:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {(parseFloat(amount) + parseFloat(gasEstimate)).toFixed(8)} ICP
                    </Typography>
                  </Box>
                </Paper>
              </Collapse>
            )}
            
            <Button
              variant="contained"
              onClick={handleSendTransaction}
              disabled={!isConnected || isLoading || !recipient || !amount || !isValidPrincipal}
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
                  Sending...
                </>
              ) : (
                'Send ICP'
              )}
            </Button>
          </Box>

          {/* Transaction Progress */}
          {isLoading && (
            <Box sx={{ mt: 3 }}>
              <Stepper activeStep={activeStep} orientation="vertical">
                {steps.map((step, index) => (
                  <Step key={step.label}>
                    <StepLabel
                      sx={{
                        '& .MuiStepLabel-label': {
                          color: 'white',
                        },
                        '& .MuiStepLabel-iconContainer': {
                          color: index <= activeStep ? '#4caf50' : 'rgba(255,255,255,0.5)',
                        },
                      }}
                    >
                      {step.label}
                    </StepLabel>
                    <StepContent>
                      <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        {step.description}
                      </Typography>
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
            </Box>
          )}
          
          <Typography variant="body2" sx={{ mt: 2, opacity: 0.8 }}>
            Enter the recipient's principal address and the amount of ICP to send.
          </Typography>
        </CardContent>
      </Card>
    </Slide>
  );
};

export default ICPTransaction; 