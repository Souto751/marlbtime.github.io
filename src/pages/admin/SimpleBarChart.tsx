import { Box, Paper, Typography } from '@mui/material';

interface SimpleBarChartProps {
  title: string;
  data: { label: string; value: number; color?: string }[];
  formatValue?: (value: number) => string;
}

export default function SimpleBarChart({ title, data, formatValue }: SimpleBarChartProps) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const format = formatValue ?? ((v: number) => v.toLocaleString('es-AR'));

  return (
    <Paper sx={{ p: { xs: 2, md: 2.5 }, height: '100%' }}>
      <Typography variant="subtitle1" fontWeight={700} gutterBottom sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}>
        {title}
      </Typography>
      <Box
        sx={{
          mt: 2,
          display: 'flex',
          alignItems: 'flex-end',
          gap: { xs: 0.5, sm: 1, md: 1.5 },
          minHeight: { xs: 140, md: 180 },
          overflowX: 'auto',
          pb: 0.5,
        }}
      >
        {data.map((item) => (
          <Box key={item.label} sx={{ flex: '1 0 36px', minWidth: 36, textAlign: 'center' }}>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
              mb={0.5}
              sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' }, lineHeight: 1.2 }}
            >
              {format(item.value)}
            </Typography>
            <Box
              sx={{
                height: `${(item.value / max) * (120)}px`,
                minHeight: 8,
                bgcolor: item.color ?? 'primary.main',
                borderRadius: 1,
                mx: 'auto',
                maxWidth: 48,
              }}
            />
            <Typography
              variant="caption"
              display="block"
              mt={1}
              fontWeight={600}
              sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
            >
              {item.label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
}
