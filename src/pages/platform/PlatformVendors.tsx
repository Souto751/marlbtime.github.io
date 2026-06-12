import {
  Alert,
  Box,
  Button,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { useMemo, useState } from 'react';
import { getAllUsers } from '../../services/mockData';
import {
  getAllMemberships,
  getAllTenants,
  getMembershipsForTenant,
  setSellerEnabled,
} from '../../services/tenantData';
import { AdminPageHeader } from '../admin/adminUi';

export default function PlatformVendors() {
  const [tenantId, setTenantId] = useState(getAllTenants()[0]?.id ?? '');
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState('');
  const [, tick] = useState(0);

  const tenants = getAllTenants();
  const users = getAllUsers();
  const memberships = useMemo(() => getMembershipsForTenant(tenantId), [tenantId, feedback]);

  const handleEnable = () => {
    const user = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!user) {
      setFeedback('No existe un usuario con ese email. Debe registrarse como comprador primero.');
      return;
    }
    setSellerEnabled(user.id, tenantId, true, 'platform');
    setEmail('');
    setFeedback(`Vendedor habilitado: ${user.name}`);
    tick((n) => n + 1);
  };

  const toggleMembership = (userId: string, enabled: boolean) => {
    setSellerEnabled(userId, tenantId, enabled, 'platform');
    tick((n) => n + 1);
  };

  return (
    <>
      <AdminPageHeader
        title="Habilitación de vendedores"
        subtitle="Los vendedores no se registran solos: un admin los habilita por tienda."
      />

      {feedback && (
        <Alert severity={feedback.startsWith('No') ? 'warning' : 'success'} sx={{ mb: 2 }} onClose={() => setFeedback('')}>
          {feedback}
        </Alert>
      )}

      <Paper sx={{ p: 3, mb: 3 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'flex-end' }}>
          <FormControl sx={{ minWidth: 220 }}>
            <InputLabel>Tienda</InputLabel>
            <Select label="Tienda" value={tenantId} onChange={(e) => setTenantId(e.target.value)}>
              {tenants.map((t) => (
                <MenuItem key={t.id} value={t.id}>
                  {t.storeName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Email del usuario"
            placeholder="usuario@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ flex: 1 }}
          />
          <Button variant="contained" onClick={handleEnable}>
            Habilitar vendedor
          </Button>
        </Stack>
      </Paper>

      <Paper variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Usuario</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="right">Acción</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {memberships.map((m) => {
              const user = users.find((u) => u.id === m.userId);
              if (!user) return null;
              return (
                <TableRow key={`${m.userId}-${m.role}`}>
                  <TableCell>
                    <Typography fontWeight={600}>{user.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {user.email}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={m.role === 'tenant_admin' ? 'Admin tienda' : 'Vendedor'}
                      color={m.role === 'tenant_admin' ? 'primary' : 'default'}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={m.enabled ? 'Habilitado' : 'Deshabilitado'}
                      color={m.enabled ? 'success' : 'default'}
                    />
                  </TableCell>
                  <TableCell align="right">
                    {m.role === 'seller' && (
                      <Button
                        size="small"
                        onClick={() => toggleMembership(m.userId, !m.enabled)}
                      >
                        {m.enabled ? 'Deshabilitar' : 'Habilitar'}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>

      <Box sx={{ mt: 2 }}>
        <Typography variant="caption" color="text.secondary">
          Total membresías en plataforma: {getAllMemberships().length}
        </Typography>
      </Box>
    </>
  );
}
