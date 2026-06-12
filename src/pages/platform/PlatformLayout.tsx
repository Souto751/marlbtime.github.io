import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import AdminTopBar from '../admin/AdminTopBar';

const DRAWER_WIDTH = 260;

const NAV = [
  { label: 'Inicio', path: '/platform', icon: DashboardOutlinedIcon, exact: true },
  { label: 'Empresas / Tiendas', path: '/platform/tenants', icon: BusinessOutlinedIcon },
  { label: 'Vendedores', path: '/platform/vendors', icon: GroupOutlinedIcon },
];

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const location = useLocation();
  return (
    <List sx={{ px: 1 }}>
      {NAV.map((item) => {
        const Icon = item.icon;
        const selected = item.exact
          ? location.pathname === item.path
          : location.pathname.startsWith(item.path);
        return (
          <ListItemButton
            key={item.path}
            component={Link}
            to={item.path}
            selected={selected}
            onClick={onNavigate}
            sx={{ borderRadius: 1, mb: 0.5 }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <Icon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: '0.9rem' }} />
          </ListItemButton>
        );
      })}
    </List>
  );
}

export default function PlatformLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const drawer = (
    <Box>
      <Toolbar sx={{ px: 2 }}>
        <Typography variant="subtitle1" fontWeight={700} color="primary.main">
          Marlbtime Platform
        </Typography>
      </Toolbar>
      <NavList onNavigate={() => setMobileOpen(false)} />
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AdminTopBar drawerWidth={DRAWER_WIDTH} onMenuClick={() => setMobileOpen(true)} logoutTo="/platform" />

      <Box component="nav" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}>
        {isMobile ? (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
            ModalProps={{ keepMounted: true }}
            sx={{ '& .MuiDrawer-paper': { width: DRAWER_WIDTH } }}
          >
            {drawer}
          </Drawer>
        ) : (
          <Drawer
            variant="permanent"
            sx={{
              '& .MuiDrawer-paper': {
                width: DRAWER_WIDTH,
                borderRight: '1px solid',
                borderColor: 'divider',
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        )}
      </Box>

      <Box component="main" sx={{ flexGrow: 1, minWidth: 0, p: { xs: 1.5, md: 3 } }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
