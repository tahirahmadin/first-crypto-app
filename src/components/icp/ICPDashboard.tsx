import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  Fade,
  Slide,
  LinearProgress,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider
} from '@mui/material';
import { 
  TrendingUp,
  AccountBalance,
  SwapHoriz,
  Collections,
  Speed,
  CheckCircle,
  Error,
  Refresh,
  Visibility,
  VisibilityOff,
  Timeline,
  AttachMoney
} from '@mui/icons-material';

interface ICPStats {
  totalTransactions: number;
  totalVolume: string;
  averageGasFee: string;
  successRate: number;
  nftsMinted: number;
  swapsCompleted: number;
}

interface RecentActivity {
  id: string;
  type: 'transfer' | 'swap' | 'nft';
  description: string;
  amount?: string;
  timestamp: Date;
  status: 'success' | 'pending' | 'failed';
}

interface ICPDashboardProps {
  isConnected: boolean;
  userPrincipal: string | null;
  balance: string;
}

const ICPDashboard: React.FC<ICPDashboardProps> = ({ 
  isConnected, 
  userPrincipal, 
  balance 
}) => {
  const [stats, setStats] = useState<ICPStats>({
    totalTransactions: 0,
    totalVolume: '0.00000000',
    averageGasFee: '0.0001',
    successRate: 100,
    nftsMinted: 0,
    swapsCompleted: 0
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [showBalance, setShowBalance] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isConnected && userPrincipal) {
      loadDashboardData();
    }
  }, [isConnected, userPrincipal]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    
    // Simulate loading dashboard data
    setTimeout(() => {
      setStats({
        totalTransactions: 12,
        totalVolume: '15.23456789',
        averageGasFee: '0.0001',
        successRate: 98.5,
        nftsMinted: 3,
        swapsCompleted: 8
      });

      setRecentActivity([
        {
          id: '1',
          type: 'transfer',
          description: 'Sent 2.5 ICP to user',
          amount: '2.50000000',
          timestamp: new Date(Date.now() - 300000),
          status: 'success'
        },
        {
          id: '2',
          type: 'swap',
          description: 'Swapped 1.0 ICP to WICP',
          amount: '1.00000000',
          timestamp: new Date(Date.now() - 600000),
          status: 'success'
        },
        {
          id: '3',
          type: 'nft',
          description: 'Minted "FirstCrypto Genesis NFT"',
          timestamp: new Date(Date.now() - 900000),
          status: 'success'
        }
      ]);
      
      setIsLoading(false);
    }, 1000);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'transfer':
        return <AccountBalance />;
      case 'swap':
        return <SwapHoriz />;
      case 'nft':
        return <Collections />;
      default:
        return <Timeline />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return '#4caf50';
      case 'pending':
        return '#ff9800';
      case 'failed':
        return '#f44336';
      default:
        return '#9e9e9e';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <Slide direction="up" in={true} mountOnEnter unmountOnExit>
      <Box>
        {/* Header */}
        <Card sx={{ 
          mb: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}>
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
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  ICP Dashboard
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.8 }}>
                  Your Internet Computer activity overview
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip 
                  icon={<CheckCircle />}
                  label="Connected"
                  sx={{ 
                    bgcolor: 'rgba(76, 175, 80, 0.2)',
                    color: 'white',
                    '& .MuiChip-icon': { color: '#4caf50' }
                  }}
                />
                <IconButton 
                  onClick={loadDashboardData}
                  disabled={isLoading}
                  sx={{ color: 'white' }}
                >
                  <Refresh sx={{ 
                    transform: isLoading ? 'rotate(360deg)' : 'none',
                    transition: 'transform 1s linear'
                  }} />
                </IconButton>
              </Box>
            </Box>

            {/* Balance Display */}
            <Box sx={{ 
              p: 3, 
              bgcolor: 'rgba(255,255,255,0.1)', 
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <Box>
                <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
                  Current Balance
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 700 }}>
                  {showBalance ? `${balance} ICP` : '•••••••• ICP'}
                </Typography>
              </Box>
              <IconButton 
                onClick={() => setShowBalance(!showBalance)}
                sx={{ color: 'white' }}
              >
                {showBalance ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </Box>
          </CardContent>
        </Card>

        {/* Statistics Grid */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              color: 'white'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AccountBalance sx={{ mr: 1 }} />
                  <Typography variant="h6">Transactions</Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {stats.totalTransactions}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Total transactions
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
              color: 'white'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AttachMoney sx={{ mr: 1 }} />
                  <Typography variant="h6">Volume</Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {stats.totalVolume}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  ICP volume
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
              color: 'white'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Speed sx={{ mr: 1 }} />
                  <Typography variant="h6">Success Rate</Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {stats.successRate}%
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Transaction success
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              color: 'white'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Collections sx={{ mr: 1 }} />
                  <Typography variant="h6">NFTs</Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {stats.nftsMinted}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  NFTs minted
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Recent Activity */}
        <Card sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Recent Activity
            </Typography>
            
            {isLoading ? (
              <Box sx={{ p: 2 }}>
                <LinearProgress sx={{ 
                  bgcolor: 'rgba(255,255,255,0.2)',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: '#4caf50'
                  }
                }} />
              </Box>
            ) : (
              <List>
                {recentActivity.map((activity, index) => (
                  <React.Fragment key={activity.id}>
                    <ListItem>
                      <ListItemIcon sx={{ color: getStatusColor(activity.status) }}>
                        {getActivityIcon(activity.type)}
                      </ListItemIcon>
                      <ListItemText
                        primary={activity.description}
                        secondary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="caption" sx={{ opacity: 0.8 }}>
                              {formatTimeAgo(activity.timestamp)}
                            </Typography>
                            {activity.amount && (
                              <Chip 
                                label={activity.amount}
                                size="small"
                                sx={{ 
                                  bgcolor: 'rgba(255,255,255,0.2)',
                                  color: 'white'
                                }}
                              />
                            )}
                          </Box>
                        }
                      />
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            bgcolor: getStatusColor(activity.status)
                          }}
                        />
                      </Box>
                    </ListItem>
                    {index < recentActivity.length - 1 && (
                      <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
                    )}
                  </React.Fragment>
                ))}
              </List>
            )}
          </CardContent>
        </Card>
      </Box>
    </Slide>
  );
};

export default ICPDashboard; 