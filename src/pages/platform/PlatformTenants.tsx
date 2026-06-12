import {
  Alert,
  Box,
  Button,
  Chip,
  Grid2 as Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useState } from 'react';
import {
  createTenant,
  getAllTenants,
  getMembershipsForTenant,
} from '../../services/tenantData';
import { buildTenantUrl } from '../../services/tenantScope';
import { AdminPageHeader } from '../admin/adminUi';

export default function PlatformTenants() {
  const [tenants, setTenants] = useState(getAllTenants());
  const [form, setForm] = useState({
    subdomain: '',
    storeName: '',
    tagline: '',
    email: '',
    whatsapp: '',
  });
  const [message, setMessage] = useState('');

  const refresh = () => setTenants(getAllTenants());

  const handleCreate = () => {
    if (!form.subdomain.trim() || !form.storeName.trim()) return;
    createTenant({
      subdomain: form.subdomain.trim().toLowerCase(),
      storeName: form.storeName.trim(),
      tagline: form.tagline.trim() || 'Tu tienda online',
      status: 'active',
      whatsapp: form.whatsapp.trim() || '5491100000000',
      email: form.email.trim() || `contacto@${form.subdomain}.com`,
      phone: '(011) 0000-0000',
      address: 'Argentina',
      website: `${form.subdomain.trim().toLowerCase()}.marlbtime.com`,
    });
    setForm({ subdomain: '', storeName: '', tagline: '', email: '', whatsapp: '' });
    setMessage('Tienda creada correctamente.');
    refresh();
  };

  return (
    <>
      <AdminPageHeader
        title="Empresas y tiendas"
        subtitle="Cada empresa opera con su subdominio: tienda.marlbtime.com"
      />

      {message && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setMessage('')}>
          {message}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Stack spacing={2}>
            {tenants.map((tenant) => {
              const members = getMembershipsForTenant(tenant.id);
              const sellers = members.filter((m) => m.role === 'seller' && m.enabled).length;
              return (
                <Paper key={tenant.id} variant="outlined" sx={{ p: 2.5 }}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between">
                    <Box>
                      <Typography variant="h6" fontWeight={700}>
                        {tenant.storeName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {tenant.subdomain}.marlbtime.com · {tenant.tagline}
                      </Typography>
                      <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                        <Chip
                          size="small"
                          label={tenant.status === 'active' ? 'Activa' : 'Suspendida'}
                          color={tenant.status === 'active' ? 'success' : 'default'}
                        />
                        <Chip size="small" label={`${sellers} vendedor(es)`} variant="outlined" />
                      </Stack>
                    </Box>
                    <Button
                      variant="outlined"
                      endIcon={<OpenInNewIcon />}
                      href={buildTenantUrl(tenant.subdomain)}
                      onClick={(e) => {
                        e.preventDefault();
                        window.location.href = buildTenantUrl(tenant.subdomain);
                      }}
                      sx={{ alignSelf: { sm: 'center' } }}
                    >
                      Visitar
                    </Button>
                  </Stack>
                </Paper>
              );
            })}
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Nueva tienda
            </Typography>
            <Stack spacing={2}>
              <TextField
                label="Subdominio"
                placeholder="miempresa"
                helperText="miempresa.marlbtime.com"
                value={form.subdomain}
                onChange={(e) => setForm((f) => ({ ...f, subdomain: e.target.value }))}
              />
              <TextField
                label="Nombre de la tienda"
                value={form.storeName}
                onChange={(e) => setForm((f) => ({ ...f, storeName: e.target.value }))}
              />
              <TextField
                label="Eslogan"
                value={form.tagline}
                onChange={(e) => setForm((f) => ({ ...f, tagline: e.target.value }))}
              />
              <TextField
                label="Email de contacto"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              />
              <TextField
                label="WhatsApp"
                value={form.whatsapp}
                onChange={(e) => setForm((f) => ({ ...f, whatsapp: e.target.value }))}
              />
              <Button variant="contained" onClick={handleCreate}>
                Crear tienda
              </Button>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}
