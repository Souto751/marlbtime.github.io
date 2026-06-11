import {
  Box,
  Button,
  Chip,
  IconButton,
  InputAdornment,
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
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import SearchIcon from '@mui/icons-material/Search';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { formatPrice, getAllProducts, getCategoryById } from '../../services/mockData';
import { AdminPageHeader, AdminScrollTable, adminResponsiveTable } from './adminUi';

export default function AdminProducts() {
  const [search, setSearch] = useState('');

  const products = useMemo(() => getAllProducts(), []);

  const filtered = products.filter((p) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      p.title.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q) ||
      p.tags?.some((t) => t.toLowerCase().includes(q))
    );
  });

  return (
    <Box>
      <AdminPageHeader
        title="Productos"
        subtitle="Alta, edición de stock, imágenes, tags, descripción y características"
        actions={
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ width: '100%' }}>
            <TextField
              size="small"
              placeholder="Buscar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              fullWidth
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{ minWidth: { sm: 220 } }}
            />
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              component={Link}
              to="/admin/productos/nuevo"
              sx={{ whiteSpace: 'nowrap' }}
            >
              Nuevo producto
            </Button>
          </Stack>
        }
      />

      <Box sx={adminResponsiveTable.desktop}>
        <AdminScrollTable>
          <Table size="small" sx={{ minWidth: 800 }}>
            <TableHead>
              <TableRow>
                <TableCell>Producto</TableCell>
                <TableCell>Categoría</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Precio</TableCell>
                <TableCell>Tags</TableCell>
                <TableCell width={120} align="center">
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((product) => (
                <TableRow key={product.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight={600}>
                      {product.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {product.id}
                    </Typography>
                  </TableCell>
                  <TableCell>{getCategoryById(product.categoryId)?.name ?? '—'}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>{formatPrice(product.price)}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                      {product.tags?.slice(0, 3).map((tag) => (
                        <Chip key={tag} label={tag} size="small" variant="outlined" />
                      ))}
                    </Stack>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      component={Link}
                      to={`/admin/productos/${product.id}`}
                      aria-label="Editar"
                    >
                      <EditOutlinedIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      component={Link}
                      to={`/producto/${product.id}`}
                      target="_blank"
                      aria-label="Ver en tienda"
                    >
                      <OpenInNewIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </AdminScrollTable>
      </Box>

      <Box sx={adminResponsiveTable.mobile}>
        {filtered.map((product) => (
          <Paper key={product.id} sx={{ p: 2, mb: 1.5 }}>
            <Typography variant="subtitle2" fontWeight={700} gutterBottom>
              {product.title}
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block" mb={1}>
              {product.id} · Stock: {product.stock} · {formatPrice(product.price)}
            </Typography>
            {product.tags && product.tags.length > 0 && (
              <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap mb={1.5}>
                {product.tags.map((tag) => (
                  <Chip key={tag} label={tag} size="small" variant="outlined" />
                ))}
              </Stack>
            )}
            <Stack direction="row" spacing={1}>
              <Button
                size="small"
                variant="contained"
                component={Link}
                to={`/admin/productos/${product.id}`}
                fullWidth
              >
                Editar
              </Button>
              <Button
                size="small"
                variant="outlined"
                component={Link}
                to={`/producto/${product.id}`}
                target="_blank"
                fullWidth
              >
                Ver
              </Button>
            </Stack>
          </Paper>
        ))}
      </Box>
    </Box>
  );
}
