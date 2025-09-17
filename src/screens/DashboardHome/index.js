import React from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  Button
} from '@mui/material';
import {
  TrendingUp,
  People,
  Campaign,
  Error,
  Sync,
  Notifications
} from '@mui/icons-material';
import { useData } from '../../contexts/DataContext';

const DashboardHome = () => {
  const { customers, campaigns, failures, pricing, syncPricing } = useData();

  const stats = [
    {
      title: 'Total Customers',
      value: customers.length,
      icon: <People />,
      color: '#10b981',
      change: '+12%'
    },
    {
      title: 'Active Campaigns',
      value: campaigns.filter(c => c.status === 'active').length,
      icon: <Campaign />,
      color: '#3b82f6',
      change: '+8%'
    },
    {
      title: 'Open Failures',
      value: failures.filter(f => f.status === 'open').length,
      icon: <Error />,
      color: '#ef4444',
      change: '-5%'
    },
    {
      title: 'Revenue (MTD)',
      value: '$12,450',
      icon: <TrendingUp />,
      color: '#8b5cf6',
      change: '+15%'
    }
  ];

  const recentActivities = [
    { text: 'New customer "TechCorp" registered', time: '2 hours ago', type: 'success' },
    { text: 'Campaign "Holiday Sale" completed', time: '4 hours ago', type: 'info' },
    { text: 'API rate limit exceeded for Customer #001', time: '6 hours ago', type: 'warning' },
    { text: 'Template "Welcome Message" approved', time: '1 day ago', type: 'success' }
  ];

  return (
    <Box>
      <Typography variant="h4" style={{ marginBottom: '2rem', fontWeight: 'bold', color: '#1f2937' }}>
        Super Admin Dashboard
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} style={{ marginBottom: '2rem' }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card elevation={2} style={{width:'325px',borderRadius: '12px', height: '100%' }}>
              <CardContent>
                <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="body2" style={{ color: '#6b7280', marginBottom: '0.5rem' }}>
                      {stat.title}
                    </Typography>
                    <Typography variant="h4" style={{ fontWeight: 'bold', color: '#1f2937' }}>
                      {stat.value}
                    </Typography>
                    <Chip 
                      label={stat.change} 
                      size="small"
                      style={{ 
                        backgroundColor: stat.change.startsWith('+') ? '#dcfce7' : '#fee2e2',
                        color: stat.change.startsWith('+') ? '#16a34a' : '#dc2626',
                        marginTop: '0.5rem'
                      }}
                    />
                  </Box>
                  <Box 
                    style={{ 
                      backgroundColor: `${stat.color}20`,
                      borderRadius: '12px',
                      padding: '12px',
                      color: stat.color
                    }}
                  >
                    {stat.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* System Health */}
        <Grid item xs={12} md={8} sx={{ width:{xs: '100%',md: '20%' ,lg: '25%' ,xl: '23%'}}}>
          <Paper elevation={2} style={{ padding: '1.5rem', borderRadius: '12px',height: '100%' }}>
            <Box style={{ display: 'flex',width:"50%", alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                System Health
              </Typography>
              <Button
                startIcon={<Sync />}
                onClick={syncPricing}
                style={{ color: '#10b981' }}
              >
                Sync Pricing
              </Button>
            </Box>

            <Box style={{ marginBottom: '1.5rem' }}>
              <Box style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <Typography variant="body2">API Connectivity</Typography>
                <Typography variant="body2" style={{ color: '#10b981' }}>98.5%</Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={98.5} 
                style={{ 
                  height: '8px', 
                  borderRadius: '4px',
                  backgroundColor: '#e5e7eb'
                }}
                sx={{
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: '#10b981'
                  }
                }}
              />
            </Box>

            <Box style={{ marginBottom: '1.5rem' }}>
              <Box style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <Typography variant="body2">Message Delivery Rate</Typography>
                <Typography variant="body2" style={{ color: '#10b981' }}>96.2%</Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={96.2} 
                style={{ 
                  height: '8px', 
                  borderRadius: '4px',
                  backgroundColor: '#e5e7eb'
                }}
                sx={{
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: '#10b981'
                  }
                }}
              />
            </Box>

            <Box>
              <Typography variant="body2" style={{ color: '#6b7280' }}>
                Last pricing sync: {new Date(pricing.lastSynced).toLocaleString()}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Recent Activities */}
        <Grid item xs={12} md={4} sx={{ width:{xs: '100%',md: '20%' ,lg: '25%' ,xl: '23%'}}}>
          <Paper elevation={2} style={{ padding: '1.5rem', borderRadius: '12px', }}>
            <Box style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
              <Notifications style={{ color: '#10b981', marginRight: '0.5rem' }} />
              <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                Recent Activities
              </Typography>
            </Box>

            <Box style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {recentActivities.map((activity, index) => (
                <Box key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <Box
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: 
                        activity.type === 'success' ? '#10b981' :
                        activity.type === 'warning' ? '#f59e0b' : '#3b82f6',
                      marginTop: '6px',
                      flexShrink: 0
                    }}
                  />
                  <Box>
                    <Typography variant="body2" style={{ color: '#374151', lineHeight: 1.4 }}>
                      {activity.text}
                    </Typography>
                    <Typography variant="caption" style={{ color: '#6b7280' }}>
                      {activity.time}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardHome;