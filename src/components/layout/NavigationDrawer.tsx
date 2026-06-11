import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CloseIcon from '@mui/icons-material/Close';
import ComputerOutlinedIcon from '@mui/icons-material/ComputerOutlined';
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import HandymanOutlinedIcon from '@mui/icons-material/HandymanOutlined';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import LaptopOutlinedIcon from '@mui/icons-material/LaptopOutlined';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import MemoryOutlinedIcon from '@mui/icons-material/MemoryOutlined';
import MouseOutlinedIcon from '@mui/icons-material/MouseOutlined';
import RecyclingOutlinedIcon from '@mui/icons-material/RecyclingOutlined';
import SellOutlinedIcon from '@mui/icons-material/SellOutlined';
import SmartphoneOutlinedIcon from '@mui/icons-material/SmartphoneOutlined';
import SportsEsportsOutlinedIcon from '@mui/icons-material/SportsEsportsOutlined';
import StorefrontIcon from '@mui/icons-material/Storefront';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import type { ElementType } from 'react';
import { Link } from 'react-router-dom';
import { useNavigationDrawer } from '../../contexts/NavigationDrawerContext';
import { useThemeMode } from '../../contexts/ThemeModeContext';
import { buildWhatsAppLink, storeConfig } from '../../services/mockData';

interface NavItem {
  label: string;
  to: string;
  icon: ElementType;
}

const QUICK_ACTIONS = [
  {
    label: 'Ofertas',
    to: '/productos?ofertas=1',
    icon: LocalOfferOutlinedIcon,
    highlight: true,
  },
  {
    label: 'Armá tu PC',
    to: '/categoria/componentes-pc',
    icon: BuildOutlinedIcon,
    highlight: false,
  },
  {
    label: 'Armá tu Combo',
    to: '/productos?q=combo',
    icon: HandymanOutlinedIcon,
    highlight: false,
  },
  {
    label: 'Empresas',
    to: '/registro',
    icon: BusinessOutlinedIcon,
    highlight: false,
  },
];

const CATEGORY_ITEMS: NavItem[] = [
  { label: 'Computadoras', to: '/productos?q=computadora', icon: ComputerOutlinedIcon },
  { label: 'Notebooks', to: '/categoria/notebooks', icon: LaptopOutlinedIcon },
  { label: 'Combos de actualización', to: '/productos?q=combo', icon: GridViewOutlinedIcon },
  { label: 'Componentes de PC', to: '/categoria/componentes-pc', icon: MemoryOutlinedIcon },
  { label: 'Periféricos', to: '/categoria/perifericos', icon: MouseOutlinedIcon },
  { label: 'Celulares', to: '/categoria/celulares', icon: SmartphoneOutlinedIcon },
  { label: 'Consolas', to: '/categoria/consolas', icon: SportsEsportsOutlinedIcon },
  { label: 'Accesorios', to: '/categoria/accesorios', icon: CategoryOutlinedIcon },
  { label: 'Usados', to: '/productos?usados=1', icon: RecyclingOutlinedIcon },
  { label: 'Outlet', to: '/productos?ofertas=1', icon: SellOutlinedIcon },
];

const SERVICE_ITEMS: NavItem[] = [
  { label: 'Seguir mi Pedido', to: '/carrito', icon: LocationOnOutlinedIcon },
  {
    label: 'Subir Comprobante',
    to: buildWhatsAppLink('Hola! Quiero subir un comprobante de pago.'),
    icon: UploadFileOutlinedIcon,
  },
  {
    label: 'RMA — Garantía',
    to: buildWhatsAppLink('Hola! Necesito consultar por garantía / RMA.'),
    icon: VerifiedUserOutlinedIcon,
  },
  {
    label: 'Ayuda',
    to: `mailto:${storeConfig.email}?subject=Ayuda Marlbtime Store`,
    icon: HelpOutlineIcon,
  },
];

export default function NavigationDrawer() {
  const theme = useTheme();
  const { mode, toggleMode } = useThemeMode();
  const { isOpen, closeDrawer } = useNavigationDrawer();
  const isDark = mode === 'dark';

  const handleNav = () => closeDrawer();

  const renderLink = (item: NavItem, external = false) => {
    const isExternal = external || item.to.startsWith('http') || item.to.startsWith('mailto');

    return (
      <ListItemButton
        key={item.label}
        component={isExternal ? 'a' : Link}
        {...(isExternal
          ? {
              href: item.to,
              target: item.to.startsWith('http') ? '_blank' : undefined,
              rel: 'noopener noreferrer',
            }
          : { to: item.to })}
        onClick={handleNav}
        sx={{
          py: 1.25,
          px: 2.5,
          '&:hover': {
            bgcolor:
              theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'action.hover',
          },
        }}
      >
        <ListItemIcon sx={{ minWidth: 36, color: 'primary.main' }}>
          <item.icon sx={{ fontSize: 22 }} />
        </ListItemIcon>
        <ListItemText
          primary={item.label}
          primaryTypographyProps={{ fontSize: '0.95rem', color: 'text.primary' }}
        />
        {!isExternal && (
          <ChevronRightIcon sx={{ fontSize: 18, color: 'text.disabled' }} />
        )}
      </ListItemButton>
    );
  };

  return (
    <Drawer
      anchor="left"
      open={isOpen}
      onClose={closeDrawer}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 360 },
          maxWidth: '100vw',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'background.paper',
        },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box
          sx={{
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            px: 2,
            py: 1.5,
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack
              direction="row"
              alignItems="center"
              spacing={1.25}
              component={Link}
              to="/"
              onClick={handleNav}
              sx={{ textDecoration: 'none', color: 'inherit' }}
            >
              <StorefrontIcon sx={{ fontSize: 32 }} />
              <Box>
                <Typography sx={{ fontWeight: 800, fontSize: '1rem', lineHeight: 1.1 }}>
                  {storeConfig.storeName}
                </Typography>
                <Typography sx={{ fontSize: '0.7rem', opacity: 0.85 }}>
                  {storeConfig.tagline}
                </Typography>
              </Box>
            </Stack>
            <IconButton onClick={closeDrawer} sx={{ color: 'inherit' }} aria-label="Cerrar menú">
              <CloseIcon />
            </IconButton>
          </Stack>
        </Box>

        <Box sx={{ p: 2, bgcolor: 'background.default' }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 1.5,
            }}
          >
            {QUICK_ACTIONS.map((action) => (
              <Button
                key={action.label}
                component={Link}
                to={action.to}
                onClick={handleNav}
                variant="outlined"
                startIcon={<action.icon sx={{ fontSize: 18 }} />}
                sx={{
                  justifyContent: 'flex-start',
                  py: 1.25,
                  px: 1.5,
                  borderRadius: 2,
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  bgcolor: 'background.paper',
                  borderColor: action.highlight ? 'secondary.main' : 'divider',
                  color: action.highlight ? 'secondary.main' : 'text.secondary',
                  '&:hover': {
                    borderColor: action.highlight ? 'secondary.dark' : 'primary.light',
                    bgcolor: action.highlight
                      ? `${theme.palette.secondary.main}14`
                      : 'action.hover',
                    color: action.highlight ? 'secondary.dark' : 'primary.main',
                  },
                }}
              >
                {action.label}
              </Button>
            ))}
          </Box>
        </Box>

        <List disablePadding sx={{ flex: 1, bgcolor: 'background.default' }}>
          {CATEGORY_ITEMS.map((item) => renderLink(item))}
        </List>

        <Divider />

        <List disablePadding sx={{ bgcolor: 'background.default' }}>
          {SERVICE_ITEMS.map((item) =>
            renderLink(item, item.to.startsWith('http') || item.to.startsWith('mailto')),
          )}
        </List>

        <Divider />

        <List disablePadding sx={{ bgcolor: 'background.default' }}>
          <ListItemButton
            onClick={toggleMode}
            sx={{
              py: 1.25,
              px: 2.5,
              '&:hover': {
                bgcolor: isDark ? 'rgba(255,255,255,0.06)' : 'action.hover',
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 36, color: 'primary.main' }}>
              {mode === 'light' ? (
                <LightModeOutlinedIcon sx={{ fontSize: 22 }} />
              ) : (
                <DarkModeOutlinedIcon sx={{ fontSize: 22 }} />
              )}
            </ListItemIcon>
            <ListItemText
              primary={mode === 'light' ? 'Modo claro' : 'Modo oscuro'}
              secondary="Tocá para cambiar el tema"
              primaryTypographyProps={{ fontSize: '0.95rem', color: 'text.primary' }}
              secondaryTypographyProps={{ fontSize: '0.75rem' }}
            />
          </ListItemButton>
        </List>

        <Box sx={{ mt: 'auto', p: 2, bgcolor: 'background.default' }}>
          <Typography variant="caption" color="text.disabled">
            {storeConfig.website}
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );
}
