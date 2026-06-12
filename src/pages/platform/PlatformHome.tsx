import {
  Box,
  Button,
  Container,
  Grid2 as Grid,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getAllTenants } from '../../services/tenantData';
import { buildTenantUrl } from '../../services/tenantScope';
import type { Tenant } from '../../types';

export default function PlatformHome() {
  const { isPlatformAdmin } = useAuth();
  const tenants = getAllTenants().filter((t: Tenant) => t.status === 'active');

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Stack spacing={4}>
        <Box textAlign="center">
          <Typography variant="h3" fontWeight={800} gutterBottom>
            Marlbtime Platform
          </Typography>
          <Typography variant="h6" color="text.secondary" maxWidth={640} mx="auto">
            Una sola base de e-commerce, múltiples tiendas con URL propia (ej. <code>/shop</code>).
          </Typography>
        </Box>

        {isPlatformAdmin && (
          <Paper variant="outlined" sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
            <AdminPanelSettingsOutlinedIcon color="primary" sx={{ fontSize: 40 }} />
            <Box sx={{ flex: 1 }}>
              <Typography fontWeight={700}>Panel de plataforma</Typography>
              <Typography variant="body2" color="text.secondary">
                Gestioná empresas, subdominios y habilitación de vendedores.
              </Typography>
            </Box>
            <Button component={Link} to="/platform/tenants" variant="contained">
              Administrar
            </Button>
          </Paper>
        )}

        <Typography variant="h5" fontWeight={700}>
          Tiendas demo
        </Typography>

        <Grid container spacing={3}>
          {tenants.map((tenant) => (
            <Grid key={tenant.id} size={{ xs: 12, md: 6 }}>
              <Paper variant="outlined" sx={{ p: 3, height: '100%' }}>
                <Stack spacing={2}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <StorefrontOutlinedIcon color="primary" />
                    <Box>
                      <Typography variant="h6" fontWeight={700}>
                        {tenant.storeName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        localhost/{tenant.subdomain}
                      </Typography>
                    </Box>
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    {tenant.tagline}
                  </Typography>
                  <Button
                    variant="contained"
                    href={buildTenantUrl(tenant.subdomain)}
                    onClick={(e) => {
                      e.preventDefault();
                      window.location.href = buildTenantUrl(tenant.subdomain);
                    }}
                  >
                    Entrar a la tienda
                  </Button>
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Paper sx={{ p: 3, bgcolor: 'background.default' }}>
          <Typography variant="subtitle2" fontWeight={700} gutterBottom>
            Desarrollo local
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Cada tienda vive en su propia ruta: <code>http://localhost:5173/shop</code>,{' '}
            <code>http://localhost:5173/nombre_tienda</code>, etc.
          </Typography>
        </Paper>
      </Stack>
    </Container>
  );
}
