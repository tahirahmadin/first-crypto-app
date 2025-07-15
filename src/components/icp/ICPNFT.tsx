import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Card, 
  CardContent, 
  Alert,
  CircularProgress,
  Grid,
  CardMedia
} from '@mui/material';

interface NFT {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  owner: string;
  mintedAt: Date;
}

interface ICPNFTProps {
  isConnected: boolean;
  userPrincipal: string | null;
  onNFTMinted?: (nft: NFT) => void;
}

const ICPNFT: React.FC<ICPNFTProps> = ({ 
  isConnected, 
  userPrincipal, 
  onNFTMinted 
}) => {
  const [nftName, setNftName] = useState('');
  const [nftDescription, setNftDescription] = useState('');
  const [nftImageUrl, setNftImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [userNFTs, setUserNFTs] = useState<NFT[]>([]);

  const handleMintNFT = async () => {
    if (!isConnected || !userPrincipal) {
      setError('Please connect your ICP wallet first');
      return;
    }

    if (!nftName || !nftDescription) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Simulate NFT minting on ICP
      // In a real implementation, you would:
      // 1. Call the NFT canister
      // 2. Upload metadata and image
      // 3. Mint the NFT
      
      await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate minting time
      
      const newNFT: NFT = {
        id: `nft-${Date.now()}`,
        name: nftName,
        description: nftDescription,
        imageUrl: nftImageUrl || 'https://via.placeholder.com/300x300?text=ICP+NFT',
        owner: userPrincipal,
        mintedAt: new Date()
      };

      setUserNFTs(prev => [newNFT, ...prev]);
      setSuccess(`NFT "${nftName}" minted successfully!`);
      onNFTMinted?.(newNFT);
      
      // Clear form
      setNftName('');
      setNftDescription('');
      setNftImageUrl('');
      
    } catch (err) {
      setError('NFT minting failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserNFTs = async () => {
    if (!userPrincipal) return;
    
    // In a real implementation, you would fetch NFTs from the ICP NFT canister
    const mockNFTs: NFT[] = [
      {
        id: 'nft-1',
        name: 'FirstCrypto NFT',
        description: 'My first ICP NFT',
        imageUrl: 'https://via.placeholder.com/300x300?text=FirstCrypto+NFT',
        owner: userPrincipal,
        mintedAt: new Date(Date.now() - 86400000) // 1 day ago
      }
    ];
    
    setUserNFTs(mockNFTs);
  };

  React.useEffect(() => {
    if (isConnected && userPrincipal) {
      loadUserNFTs();
    }
  }, [isConnected, userPrincipal]);

  return (
    <Box>
      <Card sx={{ minWidth: 275, mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Mint ICP NFT
          </Typography>
          
          {!isConnected && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              Please connect your ICP wallet to mint NFTs
            </Alert>
          )}
          
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="NFT Name"
              value={nftName}
              onChange={(e) => setNftName(e.target.value)}
              placeholder="Enter NFT name"
              disabled={!isConnected || isLoading}
              fullWidth
            />
            
            <TextField
              label="Description"
              value={nftDescription}
              onChange={(e) => setNftDescription(e.target.value)}
              placeholder="Enter NFT description"
              multiline
              rows={3}
              disabled={!isConnected || isLoading}
              fullWidth
            />
            
            <TextField
              label="Image URL (optional)"
              value={nftImageUrl}
              onChange={(e) => setNftImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              disabled={!isConnected || isLoading}
              fullWidth
            />
            
            <Button
              variant="contained"
              onClick={handleMintNFT}
              disabled={!isConnected || isLoading || !nftName || !nftDescription}
              fullWidth
            >
              {isLoading ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  Minting NFT...
                </>
              ) : (
                'Mint NFT'
              )}
            </Button>
          </Box>
          
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Create unique NFTs on the Internet Computer blockchain
          </Typography>
        </CardContent>
      </Card>

      {/* User's NFTs */}
      {userNFTs.length > 0 && (
        <Card sx={{ minWidth: 275 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Your ICP NFTs
            </Typography>
            
            <Grid container spacing={2}>
              {userNFTs.map((nft) => (
                <Grid item xs={12} sm={6} md={4} key={nft.id}>
                  <Card>
                    <CardMedia
                      component="img"
                      height="200"
                      image={nft.imageUrl}
                      alt={nft.name}
                    />
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {nft.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {nft.description}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Minted: {nft.mintedAt.toLocaleDateString()}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default ICPNFT; 