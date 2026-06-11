import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
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
  MESSAGE_STATUS_LABELS,
  formatAdminDate,
  getAdminMessages,
  updateMessageStatus,
} from '../../services/adminData';
import type { AdminMessage, MessageStatus } from '../../types';
import {
  AdminFieldRow,
  AdminMobileCard,
  AdminPageHeader,
  AdminScrollTable,
  adminResponsiveTable,
} from './adminUi';

const CHANNEL_LABELS = {
  whatsapp: 'WhatsApp',
  email: 'Email',
  web: 'Web',
};

export default function AdminMessages() {
  const [refresh, setRefresh] = useState(0);
  const [filter, setFilter] = useState<MessageStatus | 'todos'>('todos');
  const [selected, setSelected] = useState<AdminMessage | null>(null);

  const messages = useMemo(() => getAdminMessages(), [refresh]);

  const filtered =
    filter === 'todos' ? messages : messages.filter((m) => m.status === filter);

  const handleStatusChange = (id: string, status: MessageStatus) => {
    updateMessageStatus(id, status);
    setRefresh((r) => r + 1);
    if (selected?.id === id) {
      setSelected((prev) => (prev ? { ...prev, status } : null));
    }
  };

  const statusChip = (status: MessageStatus) => (
    <Chip
      label={MESSAGE_STATUS_LABELS[status]}
      size="small"
      color={
        status === 'pendiente' ? 'warning' : status === 'respondido' ? 'success' : 'default'
      }
    />
  );

  return (
    <Box>
      <AdminPageHeader
        title="Mensajes"
        subtitle="Consultas de clientes por WhatsApp, email y web"
        actions={
          <TextField
            select
            size="small"
            label="Filtrar"
            value={filter}
            onChange={(e) => setFilter(e.target.value as MessageStatus | 'todos')}
            fullWidth
            sx={{ minWidth: { sm: 160 } }}
          >
            <MenuItem value="todos">Todos</MenuItem>
            <MenuItem value="pendiente">Pendientes</MenuItem>
            <MenuItem value="leido">Leídos</MenuItem>
            <MenuItem value="respondido">Respondidos</MenuItem>
          </TextField>
        }
      />

      <Box sx={adminResponsiveTable.desktop}>
        <AdminScrollTable>
          <Table size="small" sx={{ minWidth: 760 }}>
            <TableHead>
              <TableRow>
                <TableCell>De</TableCell>
                <TableCell>Asunto</TableCell>
                <TableCell>Canal</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell width={160}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((msg) => (
                <TableRow key={msg.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight={600}>
                      {msg.from}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {msg.email}
                    </Typography>
                  </TableCell>
                  <TableCell>{msg.subject}</TableCell>
                  <TableCell>
                    <Chip label={CHANNEL_LABELS[msg.channel]} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>{formatAdminDate(msg.date)}</TableCell>
                  <TableCell>{statusChip(msg.status)}</TableCell>
                  <TableCell>
                    <Button size="small" onClick={() => setSelected(msg)}>
                      Ver
                    </Button>
                    {msg.status === 'pendiente' && (
                      <Button size="small" onClick={() => handleStatusChange(msg.id, 'leido')}>
                        Leído
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </AdminScrollTable>
      </Box>

      <Box sx={adminResponsiveTable.mobile}>
        {filtered.map((msg) => (
          <AdminMobileCard
            key={msg.id}
            title={msg.subject}
            subtitle={`${msg.from} · ${formatAdminDate(msg.date)}`}
            actions={
              <>
                <Button size="small" variant="outlined" onClick={() => setSelected(msg)} fullWidth>
                  Ver mensaje
                </Button>
                {msg.status === 'pendiente' && (
                  <Button size="small" onClick={() => handleStatusChange(msg.id, 'leido')} fullWidth>
                    Marcar leído
                  </Button>
                )}
              </>
            }
          >
            <AdminFieldRow
              label="Canal"
              value={<Chip label={CHANNEL_LABELS[msg.channel]} size="small" variant="outlined" />}
            />
            <AdminFieldRow label="Estado" value={statusChip(msg.status)} />
            <Typography variant="body2" color="text.secondary" noWrap>
              {msg.email}
            </Typography>
          </AdminMobileCard>
        ))}
      </Box>

      <Dialog
        open={!!selected}
        onClose={() => setSelected(null)}
        maxWidth="sm"
        fullWidth
        fullScreen={false}
        sx={{ '& .MuiDialog-paper': { m: { xs: 1, sm: 2 } } }}
      >
        {selected && (
          <>
            <DialogTitle sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}>{selected.subject}</DialogTitle>
            <DialogContent dividers>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                De: {selected.from} ({selected.email})
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {formatAdminDate(selected.date)} · {CHANNEL_LABELS[selected.channel]}
              </Typography>
              <Typography variant="body1" sx={{ mt: 2, whiteSpace: 'pre-wrap' }}>
                {selected.body}
              </Typography>
            </DialogContent>
            <DialogActions sx={{ flexWrap: 'wrap', gap: 1, p: 2 }}>
              {selected.status !== 'respondido' && (
                <Button onClick={() => handleStatusChange(selected.id, 'respondido')}>
                  Marcar respondido
                </Button>
              )}
              <Button onClick={() => setSelected(null)}>Cerrar</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
