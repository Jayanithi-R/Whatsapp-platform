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
  InputLabel
} from '@mui/material';
import {
  Add,
  Edit,
  Visibility,
  PersonAdd,
  Search,
  FileDownload,
  FileUpload
} from '@mui/icons-material';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';

const CustomersScreen = () => {
  const { customers, addCustomer, updateCustomer } = useData();
  const { impersonate } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    environment: 'sandbox',
    credits: 1000
  });

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || customer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddCustomer = () => {
    addCustomer(newCustomer);
    setAddDialogOpen(false);
    setNewCustomer({
      name: '',
      email: '',
      phone: '',
      environment: 'sandbox',
      credits: 1000
    });
  };

  const handleImpersonate = (customer) => {
    impersonate({
      id: customer.id,
      name: customer.name,
      email: customer.email,
      role: 'customer',
      customerId: customer.id,
      environment: customer.environment
    });
    window.open('/portal/dashboard', '_blank');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'inactive': return '#6b7280';
      case 'suspended': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box mb={4}>
        <Grid container alignItems="center" spacing={2}>
          {/* Title */}
          <Grid item xs={12} md={6}>
            <Typography
              variant="h4"
              sx={{ fontWeight: 'bold', color: '#1f2937' }}
            >
              Customer Management
            </Typography>
          </Grid>

          {/* Buttons */}
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: 'flex',
              justifyContent: { xs: 'flex-start', md: 'flex-end' },
              flexWrap: 'wrap',
              gap: '1rem',
              mt: { xs: 2, md: 0 }
            }}
          >
            <Button
              startIcon={<FileUpload />}
              variant="outlined"
              sx={{ borderColor: '#10b981', color: '#10b981' }}
            >
              Import CSV
            </Button>
            <Button
              startIcon={<FileDownload />}
              variant="outlined"
              sx={{ borderColor: '#10b981', color: '#10b981' }}
            >
              Export
            </Button>
            <Button
              startIcon={<Add />}
              variant="contained"
              onClick={() => setAddDialogOpen(true)}
              sx={{ backgroundColor: '#10b981', color: 'white' }}
            >
              Add Customer
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Filters */}
      <Paper
        elevation={2}
        style={{
          padding: '1.5rem',
          marginBottom: '2rem',
          borderRadius: '12px'
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <Search style={{ color: '#6b7280', marginRight: '0.5rem' }} />
                )
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Status"
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
                <MenuItem value="suspended">Suspended</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="body2" style={{ color: '#6b7280' }}>
              {filteredCustomers.length} customers found
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Customers Table */}
      <Paper elevation={2} style={{ borderRadius: '12px' }}>
        <TableContainer
          sx={{
            width: '100%',
            overflowX: 'auto',
            '@media (max-width: 900px)': {
              display: 'block'
            }
          }}
        >
          <Table sx={{ minWidth: 800 }}>
            <TableHead>
              <TableRow style={{ backgroundColor: '#f8fafc' }}>
                <TableCell style={{ fontWeight: 'bold' }}>Customer</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Contact</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Environment</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Credits</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Last Login</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id} hover>
                  <TableCell>
                    <Box>
                      <Typography
                        variant="body1"
                        style={{ fontWeight: 'bold' }}
                      >
                        {customer.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        style={{ color: '#6b7280' }}
                      >
                        ID: {customer.id}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">{customer.email}</Typography>
                      <Typography
                        variant="body2"
                        style={{ color: '#6b7280' }}
                      >
                        {customer.phone}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={customer.status}
                      size="small"
                      style={{
                        backgroundColor: `${getStatusColor(customer.status)}20`,
                        color: getStatusColor(customer.status),
                        textTransform: 'capitalize'
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={customer.environment}
                      size="small"
                      style={{
                        backgroundColor:
                          customer.environment === 'production'
                            ? '#fee2e2'
                            : '#fef3c7',
                        color:
                          customer.environment === 'production'
                            ? '#dc2626'
                            : '#d97706',
                        textTransform: 'capitalize'
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      style={{ fontWeight: 'bold' }}
                    >
                      ${customer.credits}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" style={{ color: '#6b7280' }}>
                      {customer.lastLogin}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box style={{ display: 'flex', gap: '0.5rem' }}>
                      <IconButton
                        size="small"
                        onClick={() => handleImpersonate(customer)}
                        style={{ color: '#10b981' }}
                      >
                        <PersonAdd />
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
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Add Customer Dialog */}
      <Dialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Add New Customer</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} style={{ marginTop: '0.5rem' }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Company Name"
                value={newCustomer.name}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, name: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={newCustomer.email}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, email: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone Number"
                value={newCustomer.phone}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, phone: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Environment</InputLabel>
                <Select
                  value={newCustomer.environment}
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, environment: e.target.value })
                  }
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
                label="Starting Credits"
                type="number"
                value={newCustomer.credits}
                onChange={(e) =>
                  setNewCustomer({
                    ...newCustomer,
                    credits: parseInt(e.target.value)
                  })
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleAddCustomer}
            variant="contained"
            style={{ backgroundColor: '#10b981', color: 'white' }}
          >
            Add Customer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CustomersScreen;
