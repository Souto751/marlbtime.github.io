import {
  AppBar,
  Badge,
  Box,
  Button,
  Container,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonIcon from '@mui/icons-material/Person';
import StorefrontIcon from '@mui/icons-material/Storefront';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardCustomizeOutlinedIcon from '@mui/icons-material/DashboardCustomizeOutlined';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NavigationDrawer from './NavigationDrawer';
import SubNavbar from './SubNavbar';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { useNavigationDrawer } from '../../contexts/NavigationDrawerContext';
import { useTenant } from '../../contexts/TenantContext';
import { useTenantPath } from '../../hooks/useTenantPath';
import { useThemeMode } from '../../contexts/ThemeModeContext';

export default function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const { totalItems } = useCart();
  const { openDrawer } = useNavigationDrawer();
  const { mode } = useThemeMode();
  const { storeConfig, canAccessTenantAdmin, isEnabledSeller } = useTenant();
  const { tp, home } = useTenantPath();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`${tp('/productos')}?q=${encodeURIComponent(search.trim())}`);
      setSearch('');
    }
  };

  const searchFieldSx = {
    bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.12)' : 'white',
    color: mode === 'dark' ? 'white' : 'text.primary',
    borderRadius: 2,
    '& fieldset': {
      borderColor: mode === 'dark' ? 'rgba(255,255,255,0.2)' : undefined,
    },
    '&:hover fieldset': {
      borderColor: mode === 'dark' ? 'rgba(255,255,255,0.35)' : undefined,
    },
    '& .MuiInputBase-input::placeholder': {
      color: mode === 'dark' ? 'rgba(255,255,255,0.55)' : undefined,
      opacity: 1,
    },
  };

  return (
    <Box sx={{ position: 'sticky', top: 0, zIndex: (t) => t.zIndex.appBar }}>
      <AppBar
        position="static"
        elevation={mode === 'dark' ? 4 : 1}
        sx={{
          bgcolor: mode === 'dark' ? 'primary.dark' : 'primary.main',
          borderBottom: mode === 'dark' ? '1px solid rgba(255,255,255,0.08)' : 'none',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar
            disableGutters
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 1, md: 2 },
              py: { xs: 0.75, md: 1 },
              minHeight: { xs: 56, md: 68 },
            }}
          >
            {/* Izquierda: menú móvil + logo */}
            <Stack direction="row" alignItems="center" spacing={0.5} sx={{ flexShrink: 0 }}>
              <IconButton
                color="inherit"
                sx={{ display: { md: 'none' }, mr: 0.5 }}
                onClick={openDrawer}
                aria-label="Abrir menú"
              >
                <MenuIcon />
              </IconButton>

              <Stack
                component={Link}
                to={home}
                direction="row"
                alignItems="center"
                spacing={1.25}
                sx={{ textDecoration: 'none', color: 'inherit', flexShrink: 0 }}
              >
                <StorefrontIcon sx={{ fontSize: { xs: 28, md: 34 } }} />
                <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                  <Typography variant="h6" fontWeight={800} lineHeight={1.1} noWrap>
                    {storeConfig.storeName}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ opacity: 0.85, display: { xs: 'none', md: 'block' } }}
                    noWrap
                  >
                    {storeConfig.tagline}
                  </Typography>
                </Box>
              </Stack>
            </Stack>

            {/* Centro: buscador (desktop/tablet) */}
            <Box
              component="form"
              onSubmit={handleSearch}
              sx={{
                flex: 1,
                display: { xs: 'none', sm: 'flex' },
                justifyContent: 'center',
                maxWidth: { sm: 420, md: 520, lg: 560 },
                mx: { sm: 2, md: 3 },
              }}
            >
              <TextField
                size="small"
                fullWidth
                placeholder="Buscar productos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton type="submit" edge="end" size="small" aria-label="Buscar">
                          <SearchIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                    sx: searchFieldSx,
                  },
                }}
              />
            </Box>

            {/* Derecha: acciones — ml:auto evita que queden pegadas al logo sin buscador */}
            <Stack
              direction="row"
              spacing={{ xs: 0.5, md: 1 }}
              alignItems="center"
              sx={{ flexShrink: 0, ml: 'auto' }}
            >
              {isAuthenticated && user?.role === 'platform_admin' && (
                <Button
                  color="inherit"
                  component={Link}
                  to="/platform"
                  sx={{ display: { xs: 'none', md: 'inline-flex' }, fontWeight: 600, px: 2 }}
                >
                  Plataforma
                </Button>
              )}

              {isAuthenticated && canAccessTenantAdmin && (
                <Button
                  color="inherit"
                  component={Link}
                  to={tp('/admin')}
                  startIcon={<DashboardCustomizeOutlinedIcon />}
                  sx={{
                    display: { xs: 'none', md: 'inline-flex' },
                    fontWeight: 600,
                    px: 2,
                  }}
                >
                  Admin
                </Button>
              )}

              {isAuthenticated && isEnabledSeller && (
                <Button
                  color="inherit"
                  component={Link}
                  to={tp('/publicar')}
                  sx={{
                    display: { xs: 'none', md: 'inline-flex' },
                    fontWeight: 600,
                    px: 2,
                  }}
                >
                  Publicar
                </Button>
              )}

              <Tooltip title="Carrito">
                <IconButton
                  color="inherit"
                  component={Link}
                  to={tp('/carrito')}
                  aria-label="Carrito"
                  sx={{ mx: { xs: 0, md: 0.5 } }}
                >
                  <Badge badgeContent={totalItems} color="secondary">
                    <ShoppingCartIcon />
                  </Badge>
                </IconButton>
              </Tooltip>

              {isAuthenticated ? (
                <>
                  <Tooltip title={user?.name ?? 'Mi cuenta'}>
                    <IconButton
                      color="inherit"
                      onClick={(e) => setAnchorEl(e.currentTarget)}
                      aria-label="Mi cuenta"
                    >
                      <PersonIcon />
                    </IconButton>
                  </Tooltip>
                  <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={() => setAnchorEl(null)}>
                    <MenuItem disabled>
                      <Typography variant="body2">{user?.name}</Typography>
                    </MenuItem>
                    {canAccessTenantAdmin && (
                      <MenuItem
                        component={Link}
                        to={tp('/admin')}
                        onClick={() => setAnchorEl(null)}
                      >
                        Panel de administración
                      </MenuItem>
                    )}
                    {isEnabledSeller && (
                      <MenuItem
                        component={Link}
                        to={tp('/mis-publicaciones')}
                        onClick={() => setAnchorEl(null)}
                      >
                        Mis publicaciones
                      </MenuItem>
                    )}
                    <MenuItem
                      onClick={() => {
                        logout();
                        setAnchorEl(null);
                        navigate(home);
                      }}
                    >
                      Cerrar sesión
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Button
                  color="inherit"
                  component={Link}
                  to={tp('/login')}
                  variant="outlined"
                  size="small"
                  sx={{
                    borderColor: 'rgba(255,255,255,0.65)',
                    fontWeight: 600,
                    px: { xs: 1.75, md: 2.5 },
                    py: 0.75,
                    ml: { xs: 0.25, md: 0.5 },
                    whiteSpace: 'nowrap',
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: 'rgba(255,255,255,0.08)',
                    },
                  }}
                >
                  Ingresar
                </Button>
              )}
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>

      <SubNavbar />
      <NavigationDrawer />
    </Box>
  );
}
