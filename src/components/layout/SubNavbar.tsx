import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import RecyclingOutlinedIcon from '@mui/icons-material/RecyclingOutlined';
import {
  Box,
  Container,
  Divider,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useNavigationDrawer } from '../../contexts/NavigationDrawerContext';
import { useThemeMode } from '../../contexts/ThemeModeContext';

const QUICK_NAV_LINKS = [
  { label: 'Armá tu PC', to: '/categoria/componentes-pc' },
  { label: 'Notebooks', to: '/categoria/notebooks' },
  { label: 'Placas de Video', to: '/productos?q=placa+video' },
  { label: 'Celulares', to: '/categoria/celulares' },
  { label: 'Consolas', to: '/categoria/consolas' },
];

export default function SubNavbar() {
  const theme = useTheme();
  const { mode, toggleMode } = useThemeMode();
  const { openDrawer } = useNavigationDrawer();
  const isDark = mode === 'dark';

  const linkSx = {
    color: isDark ? 'rgba(255,255,255,0.88)' : 'text.primary',
    textDecoration: 'none',
    fontSize: '0.875rem',
    px: 1.5,
    py: 0.75,
    whiteSpace: 'nowrap' as const,
    borderRadius: 1,
    transition: 'all 0.2s',
    '&:hover': {
      color: isDark ? 'primary.light' : 'primary.main',
      bgcolor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
    },
  };

  const offerLinkSx = {
    ...linkSx,
    color: 'secondary.main',
    fontWeight: 600,
    '&:hover': { color: 'secondary.light', bgcolor: `${theme.palette.secondary.main}18` },
  };

  const usedLinkSx = {
    ...linkSx,
    color: isDark ? 'warning.light' : 'warning.dark',
    fontWeight: 600,
    '&:hover': {
      color: isDark ? 'warning.main' : 'warning.dark',
      bgcolor: `${theme.palette.warning.main}18`,
    },
  };

  return (
    <Box
      sx={{
        bgcolor: isDark ? '#2e3440' : '#f0f0f0',
        borderBottom: isDark ? '1px solid #4a5568' : '1px solid #e0e0e0',
        boxShadow: isDark ? 'inset 0 1px 0 rgba(255,255,255,0.06)' : 'none',
        display: { xs: 'none', md: 'block' },
      }}
    >
      <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" sx={{ minHeight: 44 }}>
          <Stack
            direction="row"
            alignItems="center"
            spacing={0.5}
            onClick={openDrawer}
            sx={{
              cursor: 'pointer',
              px: 1,
              py: 0.75,
              borderRadius: 1,
              color: isDark ? 'rgba(255,255,255,0.92)' : 'text.primary',
              '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)' },
            }}
          >
            <MenuIcon sx={{ fontSize: 22 }} />
            <Typography component="span" sx={{ fontWeight: 700, fontSize: '0.875rem' }}>
              Productos
            </Typography>
          </Stack>

          <Stack
            direction="row"
            alignItems="center"
            spacing={0.75}
            component={Link}
            to="/productos?ofertas=1"
            sx={{ ...offerLinkSx, ml: 0.5, display: 'flex', flexDirection: 'row', alignItems: 'center' }}
          >
            <LocalOfferOutlinedIcon sx={{ fontSize: 18 }} />
            <Typography component="span" sx={{ fontSize: '0.875rem' }}>
              Ofertas
            </Typography>
          </Stack>

          <Stack
            direction="row"
            alignItems="center"
            spacing={0.75}
            component={Link}
            to="/productos?usados=1"
            sx={{ ...usedLinkSx, display: 'flex', flexDirection: 'row', alignItems: 'center' }}
          >
            <RecyclingOutlinedIcon sx={{ fontSize: 18 }} />
            <Typography component="span" sx={{ fontSize: '0.875rem' }}>
              Usados
            </Typography>
          </Stack>

          <Divider
            orientation="vertical"
            flexItem
            sx={{ mx: 1, my: 1.25, borderColor: isDark ? '#5c6778' : '#c4c4c4' }}
          />

          <Stack direction="row" alignItems="center" sx={{ flex: 1 }}>
            {QUICK_NAV_LINKS.map((link) => (
              <Typography key={link.label} component={Link} to={link.to} sx={linkSx}>
                {link.label}
              </Typography>
            ))}
          </Stack>

          <Stack direction="row" alignItems="center" spacing={1} sx={{ pl: 2, flexShrink: 0 }}>
            <Typography
              sx={{
                fontSize: '0.875rem',
                color: isDark ? 'rgba(255,255,255,0.75)' : 'text.secondary',
                whiteSpace: 'nowrap',
              }}
            >
              {mode === 'light' ? 'Modo claro' : 'Modo oscuro'}
            </Typography>
            <IconButton
              onClick={toggleMode}
              size="small"
              aria-label="Cambiar tema"
              sx={{
                border: '1px solid',
                borderColor: isDark ? '#5c6778' : '#bdbdbd',
                bgcolor: isDark ? '#3b4252' : 'background.paper',
                color: isDark ? 'primary.light' : 'text.primary',
                width: 32,
                height: 32,
              }}
            >
              {mode === 'light' ? (
                <LightModeOutlinedIcon sx={{ fontSize: 18 }} />
              ) : (
                <DarkModeOutlinedIcon sx={{ fontSize: 18 }} />
              )}
            </IconButton>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
