import { Alert, Box, Button, Paper, Snackbar, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import UnsavedChangesPrompt from '../../components/UnsavedChangesPrompt';
import {
  buildAdminProductFormData,
  emptyAdminProductFormData,
  saveAdminProductForm,
} from '../../services/adminData';
import { getProductById, getProductDetails } from '../../services/mockData';
import { useTenantPath } from '../../hooks/useTenantPath';
import type { AdminProductFormData } from '../../types';
import AdminProductForm from './AdminProductForm';
import { AdminPageHeader } from './adminUi';

export default function AdminProductEdit() {
  const { id } = useParams<{ id: string }>();
  const isNew = id === 'nuevo';
  const navigate = useNavigate();
  const { tp } = useTenantPath();
  const { user } = useAuth();
  const [snackbar, setSnackbar] = useState(false);
  const [saved, setSaved] = useState(false);

  const initialForm = useMemo((): AdminProductFormData => {
    if (isNew) return emptyAdminProductFormData();
    const product = id ? getProductById(id) : undefined;
    if (!product) return emptyAdminProductFormData();
    return buildAdminProductFormData(product, getProductDetails(product));
  }, [id, isNew]);

  const [form, setForm] = useState<AdminProductFormData>(initialForm);
  const [baseline, setBaseline] = useState(() => JSON.stringify(initialForm));

  const productMissing = !isNew && id && !getProductById(id);
  const hasChanges = JSON.stringify(form) !== baseline;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const savedProduct = saveAdminProductForm(form, user.id, isNew);
    setSnackbar(true);
    setSaved(true);

    if (isNew) {
      setTimeout(() => navigate(tp(`/admin/productos/${savedProduct.id}`)), 800);
      return;
    }

    const updated = getProductById(savedProduct.id);
    if (updated) {
      const newForm = buildAdminProductFormData(updated, getProductDetails(updated));
      setForm(newForm);
      setBaseline(JSON.stringify(newForm));
    }
  };

  if (productMissing) {
    return (
      <Box>
        <Typography variant="h6" color="error" gutterBottom>
          Producto no encontrado
        </Typography>
        <Button component={Link} to={tp('/admin/productos')}>
          Volver al listado
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <UnsavedChangesPrompt when={hasChanges} />
      <Button
        component={Link}
        to={tp('/admin/productos')}
        startIcon={<ArrowBackIcon />}
        size="small"
        sx={{ mb: 2 }}
      >
        Volver al listado
      </Button>

      <AdminPageHeader
        title={isNew ? 'Nuevo producto' : 'Editar producto'}
        subtitle={isNew ? 'Completá los datos para publicar en la tienda' : form.title}
      />

      {saved && !isNew && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Cambios guardados correctamente
        </Alert>
      )}

      <Paper sx={{ p: { xs: 2, md: 3 } }}>
        <AdminProductForm
          form={form}
          onChange={setForm}
          onSubmit={handleSubmit}
          submitLabel={isNew ? 'Crear producto' : hasChanges ? 'Guardar cambios' : 'Sin cambios'}
          disabled={!isNew && !hasChanges}
        />
      </Paper>

      <Snackbar
        open={snackbar}
        autoHideDuration={2500}
        onClose={() => setSnackbar(false)}
        message={isNew ? 'Producto creado' : 'Producto actualizado'}
      />
    </Box>
  );
}
