import { Alert, Box, Button, Container, Typography } from '@mui/material';
import { Link, Outlet } from 'react-router-dom';
import { useTenant } from '../contexts/TenantContext';

export default function TenantStoreGuard() {
  const { tenant, tenantSlug } = useTenant();

  if (tenantSlug && !tenant) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          No encontramos la tienda <strong>{tenantSlug}</strong>.
        </Alert>
        <Typography color="text.secondary" gutterBottom>
          Verificá la URL o elegí una tienda desde la plataforma.
        </Typography>
        <Button component={Link} to="/platform" variant="contained" sx={{ mt: 2 }}>
          Ver tiendas disponibles
        </Button>
      </Container>
    );
  }

  return (
    <Box>
      <Outlet />
    </Box>
  );
}
