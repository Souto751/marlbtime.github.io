import {
  Alert,
  Button,
  Chip,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTenant } from '../../contexts/TenantContext';
import { getAllUsers } from '../../services/mockData';
import { getMembershipsForTenant, setSellerEnabled } from '../../services/tenantData';
import { AdminPageHeader } from './adminUi';

export default function AdminVendors() {
  const { user } = useAuth();
  const { tenant, isTenantAdmin } = useTenant();
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState('');
  const [, tick] = useState(0);

  if (!tenant) return null;

  const memberships = getMembershipsForTenant(tenant.id).filter((m) => m.role === 'seller');
  const users = getAllUsers();

  const handleEnable = () => {
    const found = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!found) {
      setFeedback('El usuario debe registrarse como comprador antes de ser habilitado.');
      return;
    }
    setSellerEnabled(found.id, tenant.id, true, user?.id);
    setEmail('');
    setFeedback(`${found.name} habilitado como vendedor.`);
    tick((n) => n + 1);
  };

  const toggle = (userId: string, enabled: boolean) => {
    setSellerEnabled(userId, tenant.id, enabled, user?.id);
    tick((n) => n + 1);
  };

  return (
    <>
      <AdminPageHeader
        title="Vendedores"
        subtitle="Habilitá cuentas de vendedor para esta tienda. No pueden auto-registrarse."
      />

      {!isTenantAdmin && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Solo el administrador de la tienda puede habilitar vendedores.
        </Alert>
      )}

      {feedback && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setFeedback('')}>
          {feedback}
        </Alert>
      )}

      {isTenantAdmin && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              label="Email del comprador"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button variant="contained" onClick={handleEnable} sx={{ flexShrink: 0 }}>
              Habilitar
            </Button>
          </Stack>
        </Paper>
      )}

      <Paper variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Vendedor</TableCell>
              <TableCell>Estado</TableCell>
              {isTenantAdmin && <TableCell align="right">Acción</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {memberships.map((m) => {
              const u = users.find((x) => x.id === m.userId);
              if (!u) return null;
              return (
                <TableRow key={m.userId}>
                  <TableCell>
                    <Typography fontWeight={600}>{u.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {u.email}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={m.enabled ? 'Activo' : 'Inactivo'}
                      color={m.enabled ? 'success' : 'default'}
                    />
                  </TableCell>
                  {isTenantAdmin && (
                    <TableCell align="right">
                      <Button size="small" onClick={() => toggle(m.userId, !m.enabled)}>
                        {m.enabled ? 'Deshabilitar' : 'Habilitar'}
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>
    </>
  );
}
