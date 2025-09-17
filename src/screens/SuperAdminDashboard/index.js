import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Badge,
  Menu,
  MenuItem
} from '@mui/material';
import {
  Dashboard,
  People,
  Campaign,
  Article,
  Error,
  Settings,
  Logout,
  Menu as MenuIcon,
  Notifications
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

// Import screen components
import DashboardHome from '../DashboardHome';
import CustomersScreen from '../CustomersScreen';
import CampaignsScreen from '../CampaignsScreen';
import TemplatesScreen from '../TemplatesScreen';
import FailuresScreen from '../FailuresScreen';
import SettingsScreen from '../SettingsScreen';

const SuperAdminDashboard = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const { logout, impersonating, stopImpersonation } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/admin/dashboard' },
    { text: 'Customers', icon: <People />, path: '/admin/customers' },
    { text: 'Campaigns', icon: <Campaign />, path: '/admin/campaigns' },
    { text: 'Templates', icon: <Article />, path: '/admin/templates' },
    { text: 'Failures', icon: <Error />, path: '/admin/failures' },
    { text: 'Settings', icon: <Settings />, path: '/admin/settings' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handleNotificationClick = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* NAVBAR */}
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: '#10b981',
          zIndex: 1201
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* Left side: Drawer button + Title */}
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, minWidth: 0 }}>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setDrawerOpen(true)}
              sx={{ mr: 1 }}
            >
              <MenuIcon />
            </IconButton>

            <Typography
              variant="h6"
              noWrap
              sx={{
                fontWeight: 'bold',
                flexGrow: 1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: { xs: '140px', sm: '280px', md: '500px' }
              }}
            >
              WhatsApp Business Platform - Super Admin
            </Typography>
          </Box>

          {/* Right side: Impersonation (hidden on xs), Notifications, Logout */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
            {impersonating && (
              <Box
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  px: 1.5,
                  py: 0.5,
                  borderRadius: '16px',
                  display: { xs: 'none', sm: 'flex' },
                  alignItems: 'center'
                }}
              >
                <Typography variant="body2" noWrap>
                  Impersonating: {impersonating.name}
                </Typography>
                <Button
                  size="small"
                  onClick={stopImpersonation}
                  sx={{ color: 'white', fontSize: '0.7rem', ml: 1 }}
                >
                  Exit
                </Button>
              </Box>
            )}

            {/* Notifications always visible */}
            <IconButton color="inherit" onClick={handleNotificationClick}>
              <Badge badgeContent={3} color="error">
                <Notifications />
              </Badge>
            </IconButton>

            {/* Logout (responsive) */}
            <Box>
              {/* Mobile: Icon */}
              <IconButton
                color="inherit"
                onClick={handleLogout}
                sx={{ display: { xs: 'flex', sm: 'none' } }}
              >
                <Logout />
              </IconButton>

              {/* Tablet & Desktop: Button */}
              <Button
                color="inherit"
                onClick={handleLogout}
                startIcon={<Logout />}
                sx={{
                  display: { xs: 'none', sm: 'flex' },
                  whiteSpace: 'nowrap',
                  fontSize: { sm: '0.8rem', md: '0.9rem' }
                }}
              >
                Logout
              </Button>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      {/* SIDEBAR */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{ zIndex: 1200 }}
      >
        <Box sx={{ width: 250, pt: '64px' }}>
          <List>
            {menuItems.map((item) => (
              <ListItem
                button
                key={item.text}
                onClick={() => {
                  navigate(item.path);
                  setDrawerOpen(false);
                }}
                sx={{
                  backgroundColor: location.pathname === item.path ? '#f0fdf4' : 'transparent',
                  borderRight: location.pathname === item.path ? '3px solid #10b981' : 'none'
                }}
              >
                <ListItemIcon
                  sx={{ color: location.pathname === item.path ? '#10b981' : '#6b7280' }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{ color: location.pathname === item.path ? '#10b981' : '#374151' }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationAnchor}
        open={Boolean(notificationAnchor)}
        onClose={handleNotificationClose}
      >
        <MenuItem onClick={handleNotificationClose}>
          <Typography variant="body2">New failure detected in Campaign #001</Typography>
        </MenuItem>
        <MenuItem onClick={handleNotificationClose}>
          <Typography variant="body2">Customer credits running low</Typography>
        </MenuItem>
        <MenuItem onClick={handleNotificationClose}>
          <Typography variant="body2">API key expires in 7 days</Typography>
        </MenuItem>
      </Menu>

      {/* MAIN CONTENT */}
      <Box
  component="main"
  sx={{
    flexGrow: 1,
    p: { xs: '80px 12px 12px 12px', sm: '88px 24px 24px 24px' },
    backgroundColor: '#f8fafc',
    minHeight: "100vh",   // ✅ full screen height
    overflowY: "auto",    // ✅ scroll if needed
    boxSizing: "border-box",
  }}
>
  <Routes>
    <Route path="/dashboard" element={<DashboardHome />} />
    <Route path="/customers" element={<CustomersScreen />} />
    <Route path="/campaigns" element={<CampaignsScreen />} />
    <Route path="/templates" element={<TemplatesScreen />} />
    <Route path="/failures" element={<FailuresScreen />} />
    <Route path="/settings" element={<SettingsScreen />} />
    <Route path="/" element={<DashboardHome />} />
  </Routes>
</Box>

    </Box>
  );
};

export default SuperAdminDashboard;
