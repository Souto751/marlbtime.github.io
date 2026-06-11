import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { useMemo, useState } from 'react';
import {
  createSupplierId,
  deleteSupplier,
  getAdminSuppliers,
  getSupplierStatusLabel,
  saveSupplier,
} from '../../services/adminData';
import type { Supplier, SupplierStatus } from '../../types';
import {
  AdminFieldRow,
  AdminMobileCard,
  AdminPageHeader,
  AdminScrollTable,
  adminResponsiveTable,
} from './adminUi';

const EMPTY_SUPPLIER: Supplier = {
  id: '',
  name: '',
  contact: '',
  email: '',
  phone: '',
  categories: [],
  status: 'activo',
  notes: '',
};

export default function AdminSuppliers() {
  const [refresh, setRefresh] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<Supplier>(EMPTY_SUPPLIER);
  const [isNew, setIsNew] = useState(true);
  const [categoriesInput, setCategoriesInput] = useState('');

  const suppliers = useMemo(() => getAdminSuppliers(), [refresh]);

  const openCreate = () => {
    setForm({ ...EMPTY_SUPPLIER, id: createSupplierId() });
    setCategoriesInput('');
    setIsNew(true);
    setDialogOpen(true);
  };

  const openEdit = (supplier: Supplier) => {
    setForm(supplier);
    setCategoriesInput(supplier.categories.join(', '));
    setIsNew(false);
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) return;
    const categories = categoriesInput
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);
    saveSupplier({ ...form, categories });
    setDialogOpen(false);
    setRefresh((r) => r + 1);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Eliminar este proveedor?')) {
      deleteSupplier(id);
      setRefresh((r) => r + 1);
    }
  };

  const statusChip = (status: SupplierStatus) => (
    <Chip
      label={getSupplierStatusLabel(status)}
      size="small"
      color={status === 'activo' ? 'success' : 'default'}
    />
  );

  return (
    <Box>
      <AdminPageHeader
        title="Proveedores"
        subtitle="Gestión de proveedores y contactos de compras"
        actions={
          <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate} fullWidth sx={{ maxWidth: { sm: 220 } }}>
            Nuevo proveedor
          </Button>
        }
      />

      <Box sx={adminResponsiveTable.desktop}>
        <AdminScrollTable>
          <Table size="small" sx={{ minWidth: 880 }}>
            <TableHead>
              <TableRow>
                <TableCell>Empresa</TableCell>
                <TableCell>Contacto</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Teléfono</TableCell>
                <TableCell>Categorías</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell width={100} align="center">
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {suppliers.map((supplier) => (
                <TableRow key={supplier.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight={600}>
                      {supplier.name}
                    </Typography>
                    {supplier.notes && (
                      <Typography variant="caption" color="text.secondary">
                        {supplier.notes}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>{supplier.contact}</TableCell>
                  <TableCell>{supplier.email}</TableCell>
                  <TableCell>{supplier.phone}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                      {supplier.categories.map((cat) => (
                        <Chip key={cat} label={cat} size="small" variant="outlined" />
                      ))}
                    </Stack>
                  </TableCell>
                  <TableCell>{statusChip(supplier.status)}</TableCell>
                  <TableCell align="center">
                    <IconButton size="small" onClick={() => openEdit(supplier)}>
                      <EditOutlinedIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDelete(supplier.id)}>
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </AdminScrollTable>
      </Box>

      <Box sx={adminResponsiveTable.mobile}>
        {suppliers.map((supplier) => (
          <AdminMobileCard
            key={supplier.id}
            title={supplier.name}
            subtitle={supplier.notes}
            actions={
              <>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<EditOutlinedIcon />}
                  onClick={() => openEdit(supplier)}
                  fullWidth
                >
                  Editar
                </Button>
                <Button
                  size="small"
                  color="error"
                  startIcon={<DeleteOutlineIcon />}
                  onClick={() => handleDelete(supplier.id)}
                  fullWidth
                >
                  Eliminar
                </Button>
              </>
            }
          >
            <AdminFieldRow label="Contacto" value={supplier.contact} />
            <AdminFieldRow label="Email" value={supplier.email} />
            <AdminFieldRow label="Teléfono" value={supplier.phone} />
            <AdminFieldRow
              label="Categorías"
              value={
                <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                  {supplier.categories.map((cat) => (
                    <Chip key={cat} label={cat} size="small" variant="outlined" />
                  ))}
                </Stack>
              }
            />
            <AdminFieldRow label="Estado" value={statusChip(supplier.status)} />
          </AdminMobileCard>
        ))}
      </Box>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        sx={{ '& .MuiDialog-paper': { m: { xs: 1, sm: 2 } } }}
      >
        <DialogTitle>{isNew ? 'Nuevo proveedor' : 'Editar proveedor'}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              label="Empresa"
              fullWidth
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <TextField
              label="Contacto"
              fullWidth
              value={form.contact}
              onChange={(e) => setForm({ ...form, contact: e.target.value })}
            />
            <TextField
              label="Email"
              type="email"
              fullWidth
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <TextField
              label="Teléfono"
              fullWidth
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            <TextField
              label="Categorías (separadas por coma)"
              fullWidth
              value={categoriesInput}
              onChange={(e) => setCategoriesInput(e.target.value)}
              placeholder="Componentes PC, Periféricos"
            />
            <TextField
              select
              label="Estado"
              fullWidth
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as SupplierStatus })}
            >
              <MenuItem value="activo">Activo</MenuItem>
              <MenuItem value="inactivo">Inactivo</MenuItem>
            </TextField>
            <TextField
              label="Notas"
              fullWidth
              multiline
              rows={2}
              value={form.notes ?? ''}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2, flexWrap: 'wrap', gap: 1 }}>
          <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
