import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  LinearProgress
} from '@mui/material';
import {
  Add,
  PlayArrow,
  Pause,
  Stop,
  Edit,
  Visibility,
} from '@mui/icons-material';
import { useData } from '../../contexts/DataContext';

const CampaignsScreen = () => {
  const { campaigns, customers, addCampaign, updateCampaign } = useData();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    customerId: '',
    environment: 'sandbox',
    scheduled: ''
  });

  const handleAddCampaign = () => {
    addCampaign(newCampaign);
    setAddDialogOpen(false);
    setNewCampaign({
      name: '',
      customerId: '',
      environment: 'sandbox',
      scheduled: ''
    });
  };

  const handleCampaignAction = (campaignId, action) => {
    let newStatus;
    switch (action) {
      case 'play':
        newStatus = 'active';
        break;
      case 'pause':
        newStatus = 'paused';
        break;
      case 'stop':
        newStatus = 'stopped';
        break;
      default:
        return;
    }
    updateCampaign(campaignId, { status: newStatus });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'paused': return '#f59e0b';
      case 'stopped': return '#ef4444';
      case 'draft': return '#6b7280';
      case 'completed': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const getDeliveryRate = (campaign) => {
    const total = campaign.sent || 0;
    const delivered = campaign.delivered || 0;
    return total > 0 ? (delivered / total) * 100 : 0;
  };

  return (
    <Box>
      {/* Header with responsive button */}
      <Box mb={4}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" }, // stack only on mobile
            alignItems: { xs: "flex-start", sm: "center" },
            justifyContent: "space-between",
            gap: 2
          }}
        >
          <Typography
            variant="h4"
            sx={{ fontWeight: "bold", color: "#1f2937" }}
          >
            Campaign Management
          </Typography>

          <Button
            startIcon={<Add />}
            variant="contained"
            onClick={() => setAddDialogOpen(true)}
            sx={{
              backgroundColor: "#10b981",
              color: "white",
              mt: { xs: 2, sm: 0 } // spacing only on mobile
            }}
          >
            Create Campaign
          </Button>
        </Box>
      </Box>

      {/* Campaign Stats */}
      <Grid container spacing={3} style={{ marginBottom: '2rem' }}>
        <Grid item xs={12} md={3} sx={{ width:{xs: '100%',md: '48%' ,lg: '23%' ,xl: '23%',sm:'48%'}}}>
          <Paper elevation={2} style={{ padding: '1.5rem', borderRadius: '12px', textAlign: 'center' }}>
            <Typography variant="h3" style={{ fontWeight: 'bold', color: '#10b981' }}>
              {campaigns.filter(c => c.status === 'active').length}
            </Typography>
            <Typography variant="body2" style={{ color: '#6b7280' }}>
              Active Campaigns
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3} sx={{ width:{xs: '100%',md: '48%' ,lg: '23%' ,xl: '23%',sm:'48%'}}}>
          <Paper elevation={2} style={{ padding: '1.5rem', borderRadius: '12px', textAlign: 'center' }}>
            <Typography variant="h3" style={{ fontWeight: 'bold', color: '#3b82f6' }}>
              {campaigns.reduce((sum, c) => sum + (c.sent || 0), 0).toLocaleString()}
            </Typography>
            <Typography variant="body2" style={{ color: '#6b7280' }}>
              Messages Sent
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3} sx={{ width:{xs: '100%',md: '48%' ,lg: '23%' ,xl: '23%',sm:'48%'}}}>
          <Paper elevation={2} style={{ padding: '1.5rem', borderRadius: '12px', textAlign: 'center' }}>
            <Typography variant="h3" style={{ fontWeight: 'bold', color: '#10b981' }}>
              {campaigns.reduce((sum, c) => sum + (c.delivered || 0), 0).toLocaleString()}
            </Typography>
            <Typography variant="body2" style={{ color: '#6b7280' }}>
              Delivered
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3} sx={{ width:{xs: '100%',md: '48%' ,lg: '23%' ,xl: '23%',sm:'48%'}}}>
          <Paper elevation={2} style={{ padding: '1.5rem', borderRadius: '12px', textAlign: 'center' }}>
            <Typography variant="h3" style={{ fontWeight: 'bold', color: '#ef4444' }}>
              {campaigns.reduce((sum, c) => sum + (c.failed || 0), 0)}
            </Typography>
            <Typography variant="body2" style={{ color: '#6b7280' }}>
              Failed
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Campaigns Table */}
      <Paper elevation={2} style={{ borderRadius: '12px' }}>
        <TableContainer
          sx={{
            overflowX: "auto",
            whiteSpace: "nowrap",
            "&::-webkit-scrollbar": { height: "10px" },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#94a3b8",
              borderRadius: "8px"
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "#f1f5f9"
            }
          }}
        >
          <Table sx={{ minWidth: "1000px" }}>
            <TableHead>
              <TableRow style={{ backgroundColor: '#f8fafc' }}>
                <TableCell style={{ fontWeight: 'bold' }}>Campaign</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Customer</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Environment</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Progress</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Scheduled</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {campaigns.map((campaign) => {
                const customer = customers.find(c => c.id === campaign.customerId);
                const deliveryRate = getDeliveryRate(campaign);
                
                return (
                  <TableRow key={campaign.id} hover>
                    <TableCell>
                      <Box>
                        <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                          {campaign.name}
                        </Typography>
                        <Typography variant="body2" style={{ color: '#6b7280' }}>
                          ID: {campaign.id}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {customer?.name || 'Unknown'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={campaign.status}
                        size="small"
                        style={{
                          backgroundColor: `${getStatusColor(campaign.status)}20`,
                          color: getStatusColor(campaign.status),
                          textTransform: 'capitalize'
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={campaign.environment}
                        size="small"
                        style={{
                          backgroundColor: campaign.environment === 'production' ? '#fee2e2' : '#fef3c7',
                          color: campaign.environment === 'production' ? '#dc2626' : '#d97706',
                          textTransform: 'capitalize'
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box style={{ minWidth: '120px' }}>
                        <Box style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <Typography variant="caption">
                            {campaign.delivered || 0}/{campaign.sent || 0}
                          </Typography>
                          <Typography variant="caption">
                            {deliveryRate.toFixed(1)}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={deliveryRate}
                          style={{ height: '6px', borderRadius: '3px' }}
                          sx={{
                            backgroundColor: '#e5e7eb',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: deliveryRate > 90 ? '#10b981' : deliveryRate > 70 ? '#f59e0b' : '#ef4444'
                            }
                          }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" style={{ color: '#6b7280' }}>
                        {campaign.scheduled ? new Date(campaign.scheduled).toLocaleString() : 'Not scheduled'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box style={{ display: 'flex', gap: '0.25rem' }}>
                        {campaign.status === 'draft' || campaign.status === 'paused' ? (
                          <IconButton 
                            size="small"
                            onClick={() => handleCampaignAction(campaign.id, 'play')}
                            style={{ color: '#10b981' }}
                          >
                            <PlayArrow />
                          </IconButton>
                        ) : null}
                        {campaign.status === 'active' ? (
                          <IconButton 
                            size="small"
                            onClick={() => handleCampaignAction(campaign.id, 'pause')}
                            style={{ color: '#f59e0b' }}
                          >
                            <Pause />
                          </IconButton>
                        ) : null}
                        <IconButton 
                          size="small"
                          onClick={() => handleCampaignAction(campaign.id, 'stop')}
                          style={{ color: '#ef4444' }}
                        >
                          <Stop />
                        </IconButton>
                        <IconButton size="small" style={{ color: '#3b82f6' }}>
                          <Visibility />
                        </IconButton>
                        <IconButton size="small" style={{ color: '#6b7280' }}>
                          <Edit />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Add Campaign Dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create New Campaign</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} style={{ marginTop: '0.5rem' }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Campaign Name"
                value={newCampaign.name}
                onChange={(e) => setNewCampaign({...newCampaign, name: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Customer</InputLabel>
                <Select
                  value={newCampaign.customerId}
                  onChange={(e) => setNewCampaign({...newCampaign, customerId: e.target.value})}
                  label="Customer"
                >
                  {customers.map((customer) => (
                    <MenuItem key={customer.id} value={customer.id}>
                      {customer.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Environment</InputLabel>
                <Select
                  value={newCampaign.environment}
                  onChange={(e) => setNewCampaign({...newCampaign, environment: e.target.value})}
                  label="Environment"
                >
                  <MenuItem value="sandbox">Sandbox</MenuItem>
                  <MenuItem value="production">Production</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Scheduled Time"
                type="datetime-local"
                value={newCampaign.scheduled}
                onChange={(e) => setNewCampaign({...newCampaign, scheduled: e.target.value})}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleAddCampaign}
            variant="contained"
            style={{ backgroundColor: '#10b981', color: 'white' }}
          >
            Create Campaign
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CampaignsScreen;
