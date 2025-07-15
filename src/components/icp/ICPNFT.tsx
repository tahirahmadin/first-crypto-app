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
  Grid,
  CardMedia,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  Fade,
  Slide,
  Collapse,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { 
  Collections, 
  Add, 
  Visibility,
  Edit,
  Delete,
  Favorite,
  Share,
  CheckCircle,
  Error,
  Image,
  Description
} from '@mui/icons-material';

interface NFT {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  owner: string;
  mintedAt: Date;
  collection?: string;
  attributes?: Array<{ trait_type: string; value: string }>;
  metadata?: any;
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
  const [nftCollection, setNftCollection] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [userNFTs, setUserNFTs] = useState<NFT[]>([]);
  const [mintProgress, setMintProgress] = useState(0);
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
  const [showNFTDialog, setShowNFTDialog] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    if (isConnected && userPrincipal) {
      loadUserNFTs();
    }
  }, [isConnected, userPrincipal]);

  const handleMintNFT = async () => {
    if (!isConnected || !userPrincipal) {
      setError('Please connect your ICP wallet first');
      return;
    }

    if (!nftName || !nftDescription) {
      setError('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);
    setMintProgress(0);

    try {
      // Simulate NFT minting process
      await simulateMintingProcess();
      
      const newNFT: NFT = {
        id: `nft-${Date.now()}`,
        name: nftName,
        description: nftDescription,
        imageUrl: nftImageUrl || 'https://via.placeholder.com/300x300?text=ICP+NFT',
        owner: userPrincipal,
        mintedAt: new Date(),
        collection: nftCollection || 'FirstCrypto Collection',
        attributes: [
          { trait_type: 'Type', value: 'ICP NFT' },
          { trait_type: 'Rarity', value: 'Common' },
          { trait_type: 'Blockchain', value: 'Internet Computer' }
        ],
        metadata: {
          name: nftName,
          description: nftDescription,
          image: nftImageUrl || 'https://via.placeholder.com/300x300?text=ICP+NFT',
          external_url: 'https://firstcrypto.app',
          attributes: [
            { trait_type: 'Type', value: 'ICP NFT' },
            { trait_type: 'Rarity', value: 'Common' },
            { trait_type: 'Blockchain', value: 'Internet Computer' }
          ]
        }
      };

      setUserNFTs(prev => [newNFT, ...prev]);
      setSuccess(`NFT "${nftName}" minted successfully!`);
      onNFTMinted?.(newNFT);
      
      // Clear form
      setNftName('');
      setNftDescription('');
      setNftImageUrl('');
      setNftCollection('');
      setPreviewImage(null);
      
    } catch (err) {
      setError('NFT minting failed. Please try again.');
    } finally {
      setIsLoading(false);
      setMintProgress(0);
    }
  };

  const simulateMintingProcess = async () => {
    const steps = [25, 50, 75, 100];
    for (const progress of steps) {
      setMintProgress(progress);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  };

  const loadUserNFTs = async () => {
    if (!userPrincipal) return;
    
    // Simulate loading NFTs from ICP
    const mockNFTs: NFT[] = [
      {
        id: 'nft-1',
        name: 'FirstCrypto Genesis NFT',
        description: 'The first NFT minted on FirstCrypto platform',
        imageUrl: 'https://via.placeholder.com/300x300?text=Genesis+NFT',
        owner: userPrincipal,
        mintedAt: new Date(Date.now() - 86400000),
        collection: 'FirstCrypto Collection',
        attributes: [
          { trait_type: 'Type', value: 'Genesis' },
          { trait_type: 'Rarity', value: 'Legendary' },
          { trait_type: 'Blockchain', value: 'Internet Computer' }
        ]
      }
    ];
    
    setUserNFTs(mockNFTs);
  };

  const handleImageUrlChange = (url: string) => {
    setNftImageUrl(url);
    if (url) {
      setPreviewImage(url);
    } else {
      setPreviewImage(null);
    }
  };

  const openNFTDialog = (nft: NFT) => {
    setSelectedNFT(nft);
    setShowNFTDialog(true);
  };

  const closeNFTDialog = () => {
    setSelectedNFT(null);
    setShowNFTDialog(false);
  };

  return (
    <Slide direction="up" in={true} mountOnEnter unmountOnExit>
      <Box>
        <Card sx={{ 
          minWidth: 275, 
          mb: 2,
          background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
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
              <Collections sx={{ mr: 1, fontSize: 28 }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Mint ICP NFT
              </Typography>
            </Box>
            
            {!isConnected && (
              <Fade in={true}>
                <Alert severity="warning" sx={{ mb: 2, bgcolor: 'rgba(255,255,255,0.1)' }}>
                  Please connect your ICP wallet to mint NFTs
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
                label="NFT Name"
                value={nftName}
                onChange={(e) => setNftName(e.target.value)}
                placeholder="Enter NFT name"
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
                label="Description"
                value={nftDescription}
                onChange={(e) => setNftDescription(e.target.value)}
                placeholder="Enter NFT description"
                multiline
                rows={3}
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
                label="Image URL"
                value={nftImageUrl}
                onChange={(e) => handleImageUrlChange(e.target.value)}
                placeholder="https://example.com/image.jpg"
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
                label="Collection (Optional)"
                value={nftCollection}
                onChange={(e) => setNftCollection(e.target.value)}
                placeholder="Enter collection name"
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

              {/* Image Preview */}
              {previewImage && (
                <Collapse in={true}>
                  <Box sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 1 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, opacity: 0.8 }}>
                      Image Preview
                    </Typography>
                    <CardMedia
                      component="img"
                      height="200"
                      image={previewImage}
                      alt="NFT Preview"
                      sx={{ borderRadius: 1 }}
                    />
                  </Box>
                </Collapse>
              )}

              {/* Minting Progress */}
              {isLoading && (
                <Box sx={{ mt: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Minting NFT...</Typography>
                    <Typography variant="body2">{mintProgress}%</Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={mintProgress}
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
                onClick={handleMintNFT}
                disabled={!isConnected || isLoading || !nftName || !nftDescription}
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
                    Minting...
                  </>
                ) : (
                  <>
                    <Add sx={{ mr: 1 }} />
                    Mint NFT
                  </>
                )}
              </Button>
            </Box>
            
            <Typography variant="body2" sx={{ mt: 2, opacity: 0.8 }}>
              Create unique NFTs on the Internet Computer blockchain
            </Typography>
          </CardContent>
        </Card>

        {/* User's NFTs */}
        {userNFTs.length > 0 && (
          <Card sx={{ 
            minWidth: 275,
            background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Your ICP NFTs
              </Typography>
              
              <Grid container spacing={2}>
                {userNFTs.map((nft) => (
                  <Grid item xs={12} sm={6} md={4} key={nft.id}>
                    <Card 
                      sx={{ 
                        cursor: 'pointer',
                        transition: 'transform 0.2s',
                        '&:hover': {
                          transform: 'scale(1.02)'
                        }
                      }}
                      onClick={() => openNFTDialog(nft)}
                    >
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
                        <Typography variant="body2" sx={{ mb: 1, opacity: 0.8 }}>
                          {nft.description}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Chip 
                            label={nft.collection || 'Collection'} 
                            size="small"
                            sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}
                          />
                          <Typography variant="caption" sx={{ opacity: 0.6 }}>
                            {nft.mintedAt.toLocaleDateString()}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        )}

        {/* NFT Detail Dialog */}
        <Dialog 
          open={showNFTDialog} 
          onClose={closeNFTDialog}
          maxWidth="md"
          fullWidth
        >
          {selectedNFT && (
            <>
              <DialogTitle>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Collections sx={{ mr: 1 }} />
                  {selectedNFT.name}
                </Box>
              </DialogTitle>
              <DialogContent>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <CardMedia
                      component="img"
                      height="400"
                      image={selectedNFT.imageUrl}
                      alt={selectedNFT.name}
                      sx={{ borderRadius: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>
                      {selectedNFT.name}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {selectedNFT.description}
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Attributes
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {selectedNFT.attributes?.map((attr, index) => (
                          <Chip
                            key={index}
                            label={`${attr.trait_type}: ${attr.value}`}
                            size="small"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Details
                      </Typography>
                      <Typography variant="body2">
                        <strong>Owner:</strong> {selectedNFT.owner.slice(0, 10)}...{selectedNFT.owner.slice(-10)}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Minted:</strong> {selectedNFT.mintedAt.toLocaleString()}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Collection:</strong> {selectedNFT.collection}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={closeNFTDialog}>Close</Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </Box>
    </Slide>
  );
};

export default ICPNFT; 