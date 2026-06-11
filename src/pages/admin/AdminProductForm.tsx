import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import type { AdminProductFormData, ProductSpecification } from '../../types';
import { categories } from '../../services/mockData';

interface AdminProductFormProps {
  form: AdminProductFormData;
  onChange: (form: AdminProductFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitLabel: string;
  disabled?: boolean;
}

export default function AdminProductForm({
  form,
  onChange,
  onSubmit,
  submitLabel,
  disabled = false,
}: AdminProductFormProps) {
  const setField = <K extends keyof AdminProductFormData>(key: K, value: AdminProductFormData[K]) => {
    onChange({ ...form, [key]: value });
  };

  const updateSpec = (index: number, field: keyof ProductSpecification, value: string) => {
    const specifications = form.specifications.map((spec, i) =>
      i === index ? { ...spec, [field]: value } : spec,
    );
    setField('specifications', specifications);
  };

  const addSpec = () => {
    setField('specifications', [...form.specifications, { label: '', value: '' }]);
  };

  const removeSpec = (index: number) => {
    if (form.specifications.length <= 1) {
      setField('specifications', [{ label: '', value: '' }]);
      return;
    }
    setField(
      'specifications',
      form.specifications.filter((_, i) => i !== index),
    );
  };

  return (
    <Box component="form" onSubmit={onSubmit}>
      <Stack spacing={3}>
        <Typography variant="subtitle1" fontWeight={700}>
          Información general
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <TextField
              label="Título"
              fullWidth
              required
              value={form.title}
              onChange={(e) => setField('title', e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Precio (ARS)"
              type="number"
              fullWidth
              required
              value={form.price}
              onChange={(e) => setField('price', Math.max(0, Number(e.target.value)))}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Precio original (oferta)"
              type="number"
              fullWidth
              value={form.originalPrice}
              onChange={(e) =>
                setField('originalPrice', e.target.value === '' ? '' : Math.max(0, Number(e.target.value)))
              }
              helperText="Opcional. Debe ser mayor al precio actual."
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Stock"
              type="number"
              fullWidth
              required
              value={form.stock}
              onChange={(e) => setField('stock', Math.max(0, Number(e.target.value)))}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth required>
              <InputLabel>Categoría</InputLabel>
              <Select
                label="Categoría"
                value={form.categoryId}
                onChange={(e) => setField('categoryId', e.target.value)}
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
                onChange={(e) => setField('condition', e.target.value as 'nuevo' | 'usado')}
              >
                <MenuItem value="nuevo">Nuevo</MenuItem>
                <MenuItem value="usado">Usado</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Marca"
              fullWidth
              value={form.brand}
              onChange={(e) => setField('brand', e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Subcategoría"
              fullWidth
              value={form.subcategory}
              onChange={(e) => setField('subcategory', e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Tags"
              fullWidth
              value={form.tagsInput}
              onChange={(e) => setField('tagsInput', e.target.value)}
              placeholder="gaming, rgb, inalámbrico"
              helperText="Separados por coma"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={form.featured}
                  onChange={(e) => setField('featured', e.target.checked)}
                />
              }
              label="Producto destacado"
            />
          </Grid>
        </Grid>

        <Divider />

        <Typography variant="subtitle1" fontWeight={700}>
          Descripción
        </Typography>
        <TextField
          label="Descripción corta"
          fullWidth
          required
          multiline
          rows={3}
          value={form.description}
          onChange={(e) => setField('description', e.target.value)}
          helperText="Aparece en listados y resumen del producto"
        />
        <TextField
          label="Descripción detallada"
          fullWidth
          multiline
          rows={6}
          value={form.longDescription}
          onChange={(e) => setField('longDescription', e.target.value)}
          helperText="Aparece en la sección Descripción de la ficha"
        />

        <Divider />

        <Typography variant="subtitle1" fontWeight={700}>
          Imágenes
        </Typography>
        <TextField
          label="Imagen principal (URL)"
          fullWidth
          value={form.image}
          onChange={(e) => setField('image', e.target.value)}
          placeholder="https://..."
        />
        <TextField
          label="Galería de imágenes"
          fullWidth
          multiline
          rows={4}
          value={form.galleryInput}
          onChange={(e) => setField('galleryInput', e.target.value)}
          placeholder="Una URL por línea"
          helperText="Se usa en el carrusel de la ficha del producto"
        />

        <Divider />

        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="subtitle1" fontWeight={700}>
            Características
          </Typography>
          <Button size="small" startIcon={<AddIcon />} onClick={addSpec}>
            Agregar
          </Button>
        </Stack>
        <Stack spacing={1.5}>
          {form.specifications.map((spec, index) => (
            <Stack key={index} direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ sm: 'center' }}>
              <TextField
                label="Atributo"
                size="small"
                fullWidth
                value={spec.label}
                onChange={(e) => updateSpec(index, 'label', e.target.value)}
                placeholder="Ej: Memoria VRAM"
              />
              <TextField
                label="Valor"
                size="small"
                fullWidth
                value={spec.value}
                onChange={(e) => updateSpec(index, 'value', e.target.value)}
                placeholder="Ej: 12 GB"
              />
              <Button
                color="error"
                size="small"
                onClick={() => removeSpec(index)}
                startIcon={<DeleteOutlineIcon />}
                sx={{ flexShrink: 0 }}
              >
                Quitar
              </Button>
            </Stack>
          ))}
        </Stack>

        <Button type="submit" variant="contained" size="large" disabled={disabled}>
          {submitLabel}
        </Button>
      </Stack>
    </Box>
  );
}
