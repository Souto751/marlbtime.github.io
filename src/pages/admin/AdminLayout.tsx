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
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import PaletteOutlinedIcon from '@mui/icons-material/PaletteOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useTenant } from '../../contexts/TenantContext';
import { useTenantPath } from '../../hooks/useTenantPath';
import AdminTopBar from './AdminTopBar';

const DRAWER_WIDTH = 260;

const ALL_NAV_ITEMS = [
  { label: 'Dashboard', path: 'dashboard', icon: DashboardOutlinedIcon, tenantAdminOnly: false },
  { label: 'Productos', path: 'productos', icon: Inventory2OutlinedIcon, tenantAdminOnly: false },
  { label: 'Stock', path: 'stock', icon: InventoryOutlinedIcon, tenantAdminOnly: false },
  { label: 'Ofertas', path: 'ofertas', icon: LocalOfferOutlinedIcon, tenantAdminOnly: false },
  { label: 'Mensajes', path: 'mensajes', icon: MailOutlineIcon, tenantAdminOnly: true },
  { label: 'Compras y ventas', path: 'transacciones', icon: ReceiptLongOutlinedIcon, tenantAdminOnly: true },
  { label: 'Proveedores', path: 'proveedores', icon: LocalShippingOutlinedIcon, tenantAdminOnly: false },
  { label: 'Vendedores', path: 'vendedores', icon: GroupOutlinedIcon, tenantAdminOnly: true },
  { label: 'Apariencia', path: 'apariencia', icon: PaletteOutlinedIcon, tenantAdminOnly: false },
];

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const location = useLocation();
  const { isTenantAdmin } = useTenant();
  const { home } = useTenantPath();

  const navItems = ALL_NAV_ITEMS.filter((item) => isTenantAdmin || !item.tenantAdminOnly);

  return (
    <List sx={{ px: 1 }}>
      {navItems.map((item) => {
        const Icon = item.icon;
        const selected = location.pathname.endsWith(`/admin/${item.path}`);
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
      <ListItemButton
        component={Link}
        to={home}
        sx={{ borderRadius: 1, mt: 1, color: 'primary.main' }}
      >
        <ListItemIcon sx={{ minWidth: 40, color: 'primary.main' }}>
          <StorefrontOutlinedIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Volver a la tienda" primaryTypographyProps={{ fontSize: '0.9rem' }} />
      </ListItemButton>
    </List>
  );
}

export default function AdminLayout() {
  const theme = useTheme();
  const { storeConfig } = useTenant();
  const { home } = useTenantPath();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const drawer = (
    <Box>
      <Toolbar sx={{ px: 2 }}>
        <Typography variant="subtitle1" fontWeight={700} color="primary.main">
          {storeConfig.storeName} Admin
        </Typography>
      </Toolbar>
      <NavList onNavigate={() => setMobileOpen(false)} />
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AdminTopBar drawerWidth={DRAWER_WIDTH} onMenuClick={() => setMobileOpen(true)} logoutTo={home} />

      <Box component="nav" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}>
        {isMobile ? (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
            ModalProps={{ keepMounted: true }}
            sx={{
              '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
            }}
          >
            {drawer}
          </Drawer>
        ) : (
          <Drawer
            variant="permanent"
            sx={{
              '& .MuiDrawer-paper': {
                width: DRAWER_WIDTH,
                boxSizing: 'border-box',
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

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          width: { xs: '100%', md: `calc(100% - ${DRAWER_WIDTH}px)` },
          p: { xs: 1.5, sm: 2, md: 3 },
          overflow: 'hidden',
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 56, md: 64 } }} />
        <Outlet />
      </Box>
    </Box>
  );
}
