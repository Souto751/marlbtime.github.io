import {
  Box,
  Button,
  Chip,
  IconButton,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { useMemo, useState } from 'react';
import UnsavedChangesPrompt from '../../components/UnsavedChangesPrompt';
import { updateProductOverride } from '../../services/adminData';
import { getAllProducts, getCategoryById } from '../../services/mockData';
import {
  AdminFieldRow,
  AdminMobileCard,
  AdminPageHeader,
  AdminScrollTable,
  adminResponsiveTable,
} from './adminUi';

export default function AdminStock() {
  const [refresh, setRefresh] = useState(0);
  const [drafts, setDrafts] = useState<Record<string, number>>({});
  const [snackbar, setSnackbar] = useState(false);

  const products = useMemo(() => getAllProducts(), [refresh]);

  const hasChanges = (id: string, stock: number) => {
    const draft = drafts[id];
    return draft !== undefined && draft !== stock;
  };

  const hasUnsavedChanges = products.some((p) => hasChanges(p.id, p.stock));

  const handleChange = (id: string, value: number, currentStock: number) => {
    if (value === currentStock) {
      setDrafts((prev) => {
        if (prev[id] === undefined) return prev;
        const next = { ...prev };
        delete next[id];
        return next;
      });
      return;
    }
    setDrafts((prev) => ({ ...prev, [id]: value }));
  };

  const handleSave = (id: string) => {
    const stock = drafts[id];
    if (stock === undefined || stock < 0) return;
    updateProductOverride(id, { stock });
    setDrafts((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    setRefresh((r) => r + 1);
    setSnackbar(true);
  };

  const renderStatus = (stock: number) => {
    if (stock === 0) return <Chip label="Sin stock" size="small" color="error" />;
    if (stock <= 3) return <Chip label="Stock bajo" size="small" color="warning" />;
    return <Chip label="OK" size="small" color="success" variant="outlined" />;
  };

  return (
    <Box>
      <UnsavedChangesPrompt when={hasUnsavedChanges} />
      <AdminPageHeader
        title="Gestión de stock"
        subtitle="Editá el stock disponible de cada producto. Los cambios se reflejan en la tienda."
      />

      <Box sx={adminResponsiveTable.desktop}>
        <AdminScrollTable>
          <Table size="small" sx={{ minWidth: 640 }}>
            <TableHead>
              <TableRow>
                <TableCell>Producto</TableCell>
                <TableCell>Categoría</TableCell>
                <TableCell width={120}>Stock</TableCell>
                <TableCell width={100}>Estado</TableCell>
                <TableCell width={80} align="center">
                  Guardar
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => {
                const stock = drafts[product.id] ?? product.stock;
                return (
                  <TableRow key={product.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {product.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {product.id}
                      </Typography>
                    </TableCell>
                    <TableCell>{getCategoryById(product.categoryId)?.name ?? '-'}</TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        size="small"
                        value={stock}
                        onChange={(e) =>
                          handleChange(
                            product.id,
                            Math.max(0, Number(e.target.value)),
                            product.stock,
                          )
                        }
                        inputProps={{ min: 0 }}
                        sx={{ width: 80 }}
                      />
                    </TableCell>
                    <TableCell>{renderStatus(stock)}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleSave(product.id)}
                        disabled={!hasChanges(product.id, product.stock)}
                      >
                        <SaveIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </AdminScrollTable>
      </Box>

      <Box sx={adminResponsiveTable.mobile}>
        <Stack spacing={0}>
          {products.map((product) => {
            const stock = drafts[product.id] ?? product.stock;
            return (
              <AdminMobileCard
                key={product.id}
                title={product.title}
                subtitle={`${product.id} · ${getCategoryById(product.categoryId)?.name ?? '-'}`}
                actions={
                  <Button
                    size="small"
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={() => handleSave(product.id)}
                    disabled={!hasChanges(product.id, product.stock)}
                    fullWidth
                  >
                    Guardar
                  </Button>
                }
              >
                <AdminFieldRow
                  label="Stock"
                  value={
                    <TextField
                      type="number"
                      size="small"
                      fullWidth
                      value={stock}
                      onChange={(e) =>
                        handleChange(
                          product.id,
                          Math.max(0, Number(e.target.value)),
                          product.stock,
                        )
                      }
                      inputProps={{ min: 0 }}
                    />
                  }
                />
                <AdminFieldRow label="Estado" value={renderStatus(stock)} />
              </AdminMobileCard>
            );
          })}
        </Stack>
      </Box>

      <Snackbar
        open={snackbar}
        autoHideDuration={2500}
        onClose={() => setSnackbar(false)}
        message="Stock actualizado"
      />
    </Box>
  );
}
