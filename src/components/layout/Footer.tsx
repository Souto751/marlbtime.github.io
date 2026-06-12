import { Box, Container, Divider, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import { Link } from 'react-router-dom';
import { useTenant } from '../../contexts/TenantContext';
import { useTenantPath } from '../../hooks/useTenantPath';

export default function Footer() {
  const { storeConfig } = useTenant();
  const { tp } = useTenantPath();
  return (
    <Box component="footer" sx={{ bgcolor: 'grey.900', color: 'grey.300', mt: 'auto', py: 4 }}>
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h6" color="white" gutterBottom>
              {storeConfig.storeName}
            </Typography>
            <Typography variant="body2">{storeConfig.tagline}</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Comprá por mensaje: coordinamos pago y entrega por WhatsApp o email.
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="subtitle1" color="white" gutterBottom>
              Enlaces
            </Typography>
            <Stack spacing={0.5}>
              <Typography component={Link} to={tp('/productos')} variant="body2" color="inherit" sx={{ textDecoration: 'none' }}>
                Productos
              </Typography>
              <Typography component={Link} to={tp('/login')} variant="body2" color="inherit" sx={{ textDecoration: 'none' }}>
                Iniciar sesión
              </Typography>
              <Typography component={Link} to={tp('/registro')} variant="body2" color="inherit" sx={{ textDecoration: 'none' }}>
                Registrarse
              </Typography>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="subtitle1" color="white" gutterBottom>
              Contacto
            </Typography>
            <Stack spacing={1}>
              <Stack direction="row" spacing={1} alignItems="center">
                <WhatsAppIcon fontSize="small" />
                <Typography variant="body2">{storeConfig.phone}</Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <EmailIcon fontSize="small" />
                <Typography variant="body2">{storeConfig.email}</Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <PhoneIcon fontSize="small" />
                <Typography variant="body2">{storeConfig.phone}</Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="flex-start">
                <LocationOnIcon fontSize="small" sx={{ mt: 0.3 }} />
                <Typography variant="body2">{storeConfig.address}</Typography>
              </Stack>
            </Stack>
          </Grid>
        </Grid>
        <Divider sx={{ my: 3, borderColor: 'grey.700' }} />
        <Typography variant="body2" textAlign="center">
          © {new Date().getFullYear()} {storeConfig.storeName}. Todos los derechos reservados.
        </Typography>
      </Container>
    </Box>
  );
}
