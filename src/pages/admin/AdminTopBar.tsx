import {
  AppBar,
  IconButton,
  Toolbar,
  Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface AdminTopBarProps {
  drawerWidth: number;
  onMenuClick: () => void;
  logoutTo?: string;
}

export default function AdminTopBar({ drawerWidth, onMenuClick, logoutTo = '/' }: AdminTopBarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(logoutTo);
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` },
        ml: { xs: 0, md: `${drawerWidth}px` },
        bgcolor: 'background.paper',
        color: 'text.primary',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Toolbar sx={{ minHeight: { xs: 56, md: 64 }, px: { xs: 1.5, sm: 2 } }}>
        <IconButton
          color="inherit"
          edge="start"
          onClick={onMenuClick}
          sx={{ mr: 1, display: { md: 'none' } }}
          aria-label="Abrir menú"
        >
          <MenuIcon />
        </IconButton>
        <Typography
          variant="h6"
          fontWeight={700}
          noWrap
          sx={{ flexGrow: 1, fontSize: { xs: '1rem', sm: '1.15rem', md: '1.25rem' } }}
        >
          <Typography component="span" sx={{ display: { xs: 'inline', md: 'none' } }}>
            Admin
          </Typography>
          <Typography component="span" sx={{ display: { xs: 'none', md: 'inline' } }}>
            Panel de administración
          </Typography>
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          noWrap
          sx={{ mr: 1, display: { xs: 'none', sm: 'block' }, maxWidth: 120 }}
        >
          {user?.name}
        </Typography>
        <IconButton color="inherit" onClick={handleLogout} aria-label="Cerrar sesión" size="small">
          <LogoutIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
