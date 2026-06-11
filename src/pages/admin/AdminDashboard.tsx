import {
  Box,
  Chip,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import InventoryIcon from '@mui/icons-material/Inventory';
import MailIcon from '@mui/icons-material/Mail';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { useMemo } from 'react';
import {
  getAdminDashboardStats,
  getSalesStats,
  ORDER_STATUS_LABELS,
} from '../../services/adminData';
import { formatPrice, getAllProducts } from '../../services/mockData';
import { AdminPageHeader, AdminScrollTable, adminResponsiveTable } from './adminUi';
import SimpleBarChart from './SimpleBarChart';

function StatCard({
  title,
  value,
  subtitle,
  icon,
  color,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <Paper sx={{ p: { xs: 2, md: 2.5 }, height: '100%' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h5" fontWeight={700} sx={{ fontSize: { xs: '1.15rem', md: '1.5rem' } }}>
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="caption" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
        <Box
          sx={{
            bgcolor: `${color}18`,
            color,
            p: 1,
            borderRadius: 2,
            display: 'flex',
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
      </Stack>
    </Paper>
  );
}

export default function AdminDashboard() {
  const products = getAllProducts();
  const stats = useMemo(() => getAdminDashboardStats(products), [products]);
  const salesStats = getSalesStats();

  const salesChart = salesStats.map((s) => ({
    label: s.month,
    value: s.sales,
    color: 'primary.main',
  }));

  const purchasesChart = salesStats.map((s) => ({
    label: s.month,
    value: s.purchases,
    color: 'secondary.main',
  }));

  return (
    <Box>
      <AdminPageHeader
        title="Dashboard"
        subtitle="Resumen general del sistema Marlbtime Store"
      />

      <Grid2 container spacing={2} sx={{ mb: 2.5 }}>
        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Ventas del mes"
            value={formatPrice(stats.currentMonthSales)}
            subtitle="Junio 2026"
            icon={<AttachMoneyIcon />}
            color="#1565c0"
          />
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Stock bajo"
            value={stats.lowStock}
            subtitle="Productos con ≤ 3 unidades"
            icon={<InventoryIcon />}
            color="#ed6c02"
          />
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Mensajes pendientes"
            value={stats.pendingMessages}
            icon={<MailIcon />}
            color="#9c27b0"
          />
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Proveedores activos"
            value={stats.activeSuppliers}
            icon={<LocalShippingIcon />}
            color="#2e7d32"
          />
        </Grid2>
      </Grid2>

      <Grid2 container spacing={2} sx={{ mb: 2.5 }}>
        <Grid2 size={{ xs: 12, md: 6 }}>
          <SimpleBarChart
            title="Ventas mensuales"
            data={salesChart}
            formatValue={(v) => `$${(v / 1000000).toFixed(1)}M`}
          />
        </Grid2>
        <Grid2 size={{ xs: 12, md: 6 }}>
          <SimpleBarChart
            title="Compras a proveedores"
            data={purchasesChart}
            formatValue={(v) => `$${(v / 1000000).toFixed(1)}M`}
          />
        </Grid2>
      </Grid2>

      <Grid2 container spacing={2}>
        <Grid2 size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: { xs: 2, md: 2.5 } }}>
            <Typography variant="subtitle1" fontWeight={700} gutterBottom>
              Totales acumulados
            </Typography>
            <Stack spacing={1.5} mt={2}>
              <Stack direction="row" justifyContent="space-between" gap={2}>
                <Typography variant="body2" color="text.secondary">
                  Ventas totales
                </Typography>
                <Typography fontWeight={600} textAlign="right">
                  {formatPrice(stats.totalSales)}
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between" gap={2}>
                <Typography variant="body2" color="text.secondary">
                  Compras totales
                </Typography>
                <Typography fontWeight={600} textAlign="right">
                  {formatPrice(stats.totalPurchases)}
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between" gap={2}>
                <Typography variant="body2" color="text.secondary">
                  Margen estimado
                </Typography>
                <Typography fontWeight={600} color="success.main" textAlign="right">
                  {formatPrice(stats.totalSales - stats.totalPurchases)}
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between" gap={2}>
                <Typography variant="body2" color="text.secondary">
                  Productos en catálogo
                </Typography>
                <Typography fontWeight={600}>{products.length}</Typography>
              </Stack>
            </Stack>
          </Paper>
        </Grid2>

        <Grid2 size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: { xs: 2, md: 2.5 } }}>
            <Typography variant="subtitle1" fontWeight={700} gutterBottom>
              Últimas transacciones
            </Typography>

            <Box sx={adminResponsiveTable.desktop}>
              <AdminScrollTable sx={{ boxShadow: 'none' }}>
                <Table size="small" sx={{ minWidth: 400 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Tipo</TableCell>
                      <TableCell>Monto</TableCell>
                      <TableCell>Estado</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stats.recentOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>{order.id}</TableCell>
                        <TableCell>
                          <Chip
                            label={order.type === 'venta' ? 'Venta' : 'Compra'}
                            size="small"
                            color={order.type === 'venta' ? 'primary' : 'secondary'}
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>{formatPrice(order.amount)}</TableCell>
                        <TableCell>
                          <Chip label={ORDER_STATUS_LABELS[order.status]} size="small" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </AdminScrollTable>
            </Box>

            <Stack spacing={1.5} sx={{ ...adminResponsiveTable.mobile, mt: 1 }}>
              {stats.recentOrders.map((order) => (
                <Box
                  key={order.id}
                  sx={{
                    p: 1.5,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.5}>
                    <Typography variant="body2" fontWeight={600}>
                      {order.id}
                    </Typography>
                    <Chip label={ORDER_STATUS_LABELS[order.status]} size="small" />
                  </Stack>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Chip
                      label={order.type === 'venta' ? 'Venta' : 'Compra'}
                      size="small"
                      color={order.type === 'venta' ? 'primary' : 'secondary'}
                      variant="outlined"
                    />
                    <Typography variant="body2" fontWeight={600}>
                      {formatPrice(order.amount)}
                    </Typography>
                  </Stack>
                </Box>
              ))}
            </Stack>
          </Paper>
        </Grid2>
      </Grid2>
    </Box>
  );
}
