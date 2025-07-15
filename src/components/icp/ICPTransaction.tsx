import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Card, 
  CardContent, 
  Alert,
  CircularProgress 
} from '@mui/material';
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const validatePrincipal = (principalString: string): boolean => {
    try {
      Principal.fromText(principalString);
      return true;
    } catch {
      return false;
    }
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

    if (!validatePrincipal(recipient)) {
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

    try {
      // This is a placeholder for the actual transaction logic
      // In a real implementation, you would:
      // 1. Create an actor for the ICP ledger canister
      // 2. Call the transfer method
      // 3. Wait for the transaction to be processed
      
      // Simulate transaction processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const txHash = `icp-tx-${Date.now()}`;
      setSuccess(`Transaction successful! Hash: ${txHash}`);
      onTransactionComplete?.(txHash);
      
      // Clear form
      setRecipient('');
      setAmount('');
      
    } catch (err) {
      setError('Transaction failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card sx={{ minWidth: 275, mb: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Send ICP
        </Typography>
        
        {!isConnected && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Please connect your ICP wallet to send transactions
          </Alert>
        )}
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Recipient Principal"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="Enter recipient principal address"
            disabled={!isConnected || isLoading}
            fullWidth
          />
          
          <TextField
            label="Amount (ICP)"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.0"
            disabled={!isConnected || isLoading}
            fullWidth
          />
          
          <Button
            variant="contained"
            onClick={handleSendTransaction}
            disabled={!isConnected || isLoading || !recipient || !amount}
            fullWidth
          >
            {isLoading ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Sending...
              </>
            ) : (
              'Send ICP'
            )}
          </Button>
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Enter the recipient's principal address and the amount of ICP to send.
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ICPTransaction; 