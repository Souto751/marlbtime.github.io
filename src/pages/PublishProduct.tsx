import {
  Alert,
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import PublishIcon from '@mui/icons-material/Publish';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { categories, createProduct } from '../services/mockData';

export default function PublishProduct() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    categoryId: '',
    image: '',
    stock: '1',
    condition: 'nuevo' as 'nuevo' | 'usado',
    featured: false,
  });
  const [success, setSuccess] = useState(false);

  const handleChange = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const product = createProduct({
      title: form.title,
      description: form.description,
      price: Number(form.price),
      categoryId: form.categoryId,
      sellerId: user.id,
      image: form.image || 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&h=400&fit=crop',
      stock: Number(form.stock),
      featured: form.featured,
      condition: form.condition,
    });

    setSuccess(true);
    setTimeout(() => navigate(`/producto/${product.id}`), 1500);
  };

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4 }}>
        <Stack spacing={3}>
          <Box textAlign="center">
            <PublishIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
            <Typography variant="h5" gutterBottom>
              Publicar producto
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Creá una nueva publicación de venta
            </Typography>
          </Box>

          {success && (
            <Alert severity="success">¡Producto publicado! Redirigiendo...</Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Título del producto"
                  fullWidth
                  required
                  value={form.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Descripción"
                  fullWidth
                  required
                  multiline
                  rows={4}
                  value={form.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Precio (ARS)"
                  type="number"
                  fullWidth
                  required
                  value={form.price}
                  onChange={(e) => handleChange('price', e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Stock"
                  type="number"
                  fullWidth
                  required
                  value={form.stock}
                  onChange={(e) => handleChange('stock', e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth required>
                  <InputLabel>Categoría</InputLabel>
                  <Select
                    label="Categoría"
                    value={form.categoryId}
                    onChange={(e) => handleChange('categoryId', e.target.value)}
                  >
                    {categories.map((cat) => (
                      <MenuItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Condición</InputLabel>
                  <Select
                    label="Condición"
                    value={form.condition}
                    onChange={(e) => handleChange('condition', e.target.value)}
                  >
                    <MenuItem value="nuevo">Nuevo</MenuItem>
                    <MenuItem value="usado">Usado</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="URL de imagen"
                  fullWidth
                  placeholder="https://..."
                  value={form.image}
                  onChange={(e) => handleChange('image', e.target.value)}
                  helperText="Opcional. Si no cargás una, se usa una imagen por defecto."
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Button type="submit" variant="contained" size="large" fullWidth>
                  Publicar
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
}
