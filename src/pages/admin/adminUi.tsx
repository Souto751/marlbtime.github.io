import { Box, Paper, Stack, Typography, type SxProps, type Theme } from '@mui/material';
import type { ReactNode } from 'react';

interface AdminPageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export function AdminPageHeader({ title, subtitle, actions }: AdminPageHeaderProps) {
  return (
    <Box
      sx={{
        mb: { xs: 2, md: 3 },
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 2,
        justifyContent: 'space-between',
        alignItems: { sm: 'center' },
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="h5" fontWeight={700} gutterBottom sx={{ fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Box>
      {actions && <Box sx={{ width: { xs: '100%', sm: 'auto' }, flexShrink: 0 }}>{actions}</Box>}
    </Box>
  );
}

interface AdminScrollTableProps {
  children: ReactNode;
  maxHeight?: number | { xs?: number; md?: number };
  sx?: SxProps<Theme>;
}

export function AdminScrollTable({ children, maxHeight, sx }: AdminScrollTableProps) {
  return (
    <Paper sx={{ overflow: 'hidden', ...sx }}>
      <Box
        sx={{
          display: { xs: 'block', md: 'none' },
          px: 1.5,
          py: 1,
          bgcolor: 'action.hover',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography variant="caption" color="text.secondary">
          Deslizá horizontalmente para ver más columnas
        </Typography>
      </Box>
      <Box
        sx={{
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          maxHeight,
        }}
      >
        {children}
      </Box>
    </Paper>
  );
}

interface AdminMobileCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  actions?: ReactNode;
}

export function AdminMobileCard({ title, subtitle, children, actions }: AdminMobileCardProps) {
  return (
    <Paper sx={{ p: 2, mb: 1.5 }}>
      <Typography variant="subtitle2" fontWeight={700} sx={{ wordBreak: 'break-word' }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="caption" color="text.secondary" display="block" mt={0.25}>
          {subtitle}
        </Typography>
      )}
      <Stack spacing={1.25} sx={{ mt: 1.5 }}>
        {children}
      </Stack>
      {actions && (
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 2 }}>
          {actions}
        </Stack>
      )}
    </Paper>
  );
}

export function AdminFieldRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      justifyContent="space-between"
      alignItems={{ xs: 'flex-start', sm: 'center' }}
      spacing={0.5}
      gap={1}
    >
      <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0 }}>
        {label}
      </Typography>
      <Box sx={{ width: { xs: '100%', sm: 'auto' }, minWidth: 0 }}>{value}</Box>
    </Stack>
  );
}

export const adminResponsiveTable = {
  desktop: { display: { xs: 'none', md: 'block' } },
  mobile: { display: { xs: 'block', md: 'none' } },
} as const;
