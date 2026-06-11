import {
  Box,
  Chip,
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
import { useMemo, useState } from 'react';
import {
  ORDER_STATUS_LABELS,
  formatAdminDate,
  getAdminOrders,
  getAdminSuppliers,
  updateOrderStatus,
} from '../../services/adminData';
import { formatPrice } from '../../services/mockData';
import type { OrderStatus, OrderType } from '../../types';
import {
  AdminFieldRow,
  AdminMobileCard,
  AdminPageHeader,
  AdminScrollTable,
  adminResponsiveTable,
} from './adminUi';

export default function AdminTransactions() {
  const [refresh, setRefresh] = useState(0);
  const [typeFilter, setTypeFilter] = useState<OrderType | 'todos'>('todos');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'todos'>('todos');

  const orders = useMemo(() => getAdminOrders(), [refresh]);
  const suppliers = useMemo(() => getAdminSuppliers(), [refresh]);

  const filtered = orders.filter((o) => {
    if (typeFilter !== 'todos' && o.type !== typeFilter) return false;
    if (statusFilter !== 'todos' && o.status !== statusFilter) return false;
    return true;
  });

  const getSupplierName = (id?: string) => suppliers.find((s) => s.id === id)?.name ?? '—';

  const handleStatusChange = (id: string, status: OrderStatus) => {
    updateOrderStatus(id, status);
    setRefresh((r) => r + 1);
  };

  const totalFiltered = filtered.reduce((sum, o) => sum + o.amount, 0);

  const typeChip = (type: OrderType) => (
    <Chip
      label={type === 'venta' ? 'Venta' : 'Compra'}
      size="small"
      color={type === 'venta' ? 'primary' : 'secondary'}
      variant="outlined"
    />
  );

  const statusSelect = (orderId: string, status: OrderStatus, fullWidth = false) => (
    <TextField
      select
      size="small"
      value={status}
      onChange={(e) => handleStatusChange(orderId, e.target.value as OrderStatus)}
      variant="outlined"
      fullWidth={fullWidth}
      sx={{ minWidth: fullWidth ? undefined : 130 }}
    >
      {(Object.keys(ORDER_STATUS_LABELS) as OrderStatus[]).map((s) => (
        <MenuItem key={s} value={s}>
          {ORDER_STATUS_LABELS[s]}
        </MenuItem>
      ))}
    </TextField>
  );

  return (
    <Box>
      <AdminPageHeader
        title="Compras y ventas"
        subtitle={`Total filtrado: ${formatPrice(totalFiltered)}`}
        actions={
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ width: '100%' }}>
            <TextField
              select
              size="small"
              label="Tipo"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as OrderType | 'todos')}
              fullWidth
            >
              <MenuItem value="todos">Todos</MenuItem>
              <MenuItem value="venta">Ventas</MenuItem>
              <MenuItem value="compra">Compras</MenuItem>
            </TextField>
            <TextField
              select
              size="small"
              label="Estado"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'todos')}
              fullWidth
            >
              <MenuItem value="todos">Todos</MenuItem>
              {(Object.keys(ORDER_STATUS_LABELS) as OrderStatus[]).map((s) => (
                <MenuItem key={s} value={s}>
                  {ORDER_STATUS_LABELS[s]}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        }
      />

      <Box sx={adminResponsiveTable.desktop}>
        <AdminScrollTable>
          <Table size="small" sx={{ minWidth: 960 }}>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Cliente</TableCell>
                <TableCell>Producto</TableCell>
                <TableCell align="center">Cant.</TableCell>
                <TableCell>Monto</TableCell>
                <TableCell>Proveedor</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell width={150}>Estado</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((order) => (
                <TableRow key={order.id} hover>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{typeChip(order.type)}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ maxWidth: 200 }}>
                      {order.productTitle}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">{order.quantity}</TableCell>
                  <TableCell>{formatPrice(order.amount)}</TableCell>
                  <TableCell>{getSupplierName(order.supplierId)}</TableCell>
                  <TableCell>{formatAdminDate(order.date)}</TableCell>
                  <TableCell>{statusSelect(order.id, order.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </AdminScrollTable>
      </Box>

      <Box sx={adminResponsiveTable.mobile}>
        {filtered.map((order) => (
          <AdminMobileCard
            key={order.id}
            title={order.productTitle}
            subtitle={`${order.id} · ${formatAdminDate(order.date)}`}
          >
            <AdminFieldRow label="Tipo" value={typeChip(order.type)} />
            <AdminFieldRow label="Cliente" value={order.customer} />
            <AdminFieldRow label="Cantidad" value={order.quantity} />
            <AdminFieldRow label="Monto" value={formatPrice(order.amount)} />
            {order.supplierId && (
              <AdminFieldRow label="Proveedor" value={getSupplierName(order.supplierId)} />
            )}
            <AdminFieldRow
              label="Estado"
              value={statusSelect(order.id, order.status, true)}
            />
          </AdminMobileCard>
        ))}
      </Box>
    </Box>
  );
}
