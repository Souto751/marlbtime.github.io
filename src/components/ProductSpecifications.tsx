import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  useTheme,
} from '@mui/material';
import type { ProductSpecification } from '../types';

interface ProductSpecificationsProps {
  specifications: ProductSpecification[];
}

export default function ProductSpecifications({ specifications }: ProductSpecificationsProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const stripeColor = isDark ? 'rgba(255, 255, 255, 0.04)' : theme.palette.grey[50];

  return (
    <Box component="section" aria-labelledby="product-specs-heading">
      <Typography id="product-specs-heading" variant="h6" fontWeight={700} gutterBottom>
        Características
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
        Especificaciones técnicas del producto
      </Typography>

      <TableContainer
        sx={{
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
          overflow: 'hidden',
        }}
      >
        <Table
          size="small"
          sx={{
            tableLayout: 'fixed',
            width: '100%',
            borderCollapse: 'collapse',
            '& .MuiTableCell-root': {
              borderBottom: '1px solid',
              borderColor: 'divider',
              py: 1.5,
              px: 2,
              lineHeight: 1.5,
            },
            '& .MuiTableRow:last-of-type .MuiTableCell-root': {
              borderBottom: 'none',
            },
          }}
        >
          <TableBody>
            {specifications.map((spec, index) => (
              <TableRow
                key={`${spec.label}-${index}`}
                sx={{ bgcolor: index % 2 === 0 ? stripeColor : 'transparent' }}
              >
                <TableCell
                  component="th"
                  scope="row"
                  sx={{
                    fontWeight: 600,
                    width: { xs: '38%', sm: '32%' },
                    color: 'text.primary',
                    verticalAlign: 'top',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {spec.label}
                </TableCell>
                <TableCell
                  sx={{
                    color: 'text.primary',
                    fontWeight: 400,
                    verticalAlign: 'top',
                    wordBreak: 'break-word',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {spec.value}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
