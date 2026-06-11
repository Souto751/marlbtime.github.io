import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import VerifiedIcon from '@mui/icons-material/Verified';
import { Link } from 'react-router-dom';
import CategoryButtons from '../components/CategoryButtons';
import ProductCard from '../components/ProductCard';
import {
  getFeaturedProducts,
  storeConfig,
} from '../services/mockData';

export default function Home() {
  const featured = getFeaturedProducts().slice(0, 8);

  return (
    <>
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 60%, #ff6f00 100%)',
          color: 'white',
          py: { xs: 6, md: 10 },
          mb: 4,
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={4} alignItems="center">
            <Grid size={{ xs: 12, md: 7 }}>
              <Typography variant="h3" fontWeight={800} gutterBottom>
                {storeConfig.storeName}
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9, mb: 3 }}>
                {storeConfig.tagline}. Encontrá lo que buscás y coordiná tu compra por mensaje.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button
                  variant="contained"
                  size="large"
                  color="secondary"
                  component={Link}
                  to="/productos"
                  endIcon={<ArrowForwardIcon />}
                >
                  Ver productos
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  sx={{ borderColor: 'white', color: 'white' }}
                  component={Link}
                  to="/registro"
                >
                  Crear cuenta
                </Button>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 5 }}>
              <Stack spacing={2}>
                {[
                  { icon: <WhatsAppIcon />, text: 'Comprá por WhatsApp sin pasarela de pagos' },
                  { icon: <LocalShippingIcon />, text: 'Coordinamos envío y retiro por mensaje' },
                  { icon: <VerifiedIcon />, text: 'Publicaciones verificadas de vendedores' },
                ].map((item, i) => (
                  <Paper key={i} sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ color: 'primary.main' }}>{item.icon}</Box>
                    <Typography variant="body1" color="text.primary">
                      {item.text}
                    </Typography>
                  </Paper>
                ))}
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="xl">
        <Typography variant="h5" gutterBottom>
          Categorías
        </Typography>
        <CategoryButtons />

        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5">Destacados</Typography>
          <Button component={Link} to="/productos" endIcon={<ArrowForwardIcon />}>
            Ver todos
          </Button>
        </Stack>
        <Grid container spacing={3}>
          {featured.map((product) => (
            <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}
