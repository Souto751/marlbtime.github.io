import {
  Alert,
  Box,
  Button,
  Container,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../contexts/AuthContext';
import { deleteProduct, getProductsBySeller } from '../services/mockData';
import { useTenantPath } from '../hooks/useTenantPath';

export default function MyPublications() {
  const { user } = useAuth();
  const { tp } = useTenantPath();
  const [products, setProducts] = useState(() =>
    user ? getProductsBySeller(user.id) : [],
  );

  const handleDelete = (productId: string) => {
    if (!user) return;
    const deleted = deleteProduct(productId, user.id);
    if (deleted) {
      setProducts(getProductsBySeller(user.id));
    }
  };

  return (
    <Container maxWidth="xl">
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Mis publicaciones
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gestioná tus productos en venta
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          component={Link}
          to={tp('/publicar')}
        >
          Nueva publicación
        </Button>
      </Stack>

      {products.length === 0 ? (
        <Alert severity="info">
          Todavía no tenés publicaciones.{' '}
          <Typography component={Link} to={tp('/publicar')} color="primary">
            Publicá tu primer producto
          </Typography>
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <Box position="relative">
                <ProductCard product={product} />
                <IconButton
                  color="error"
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    bgcolor: 'white',
                    '&:hover': { bgcolor: 'grey.100' },
                  }}
                  onClick={() => handleDelete(product.id)}
                  title="Eliminar publicación"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
