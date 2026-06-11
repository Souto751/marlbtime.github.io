import { Box, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import ProductCard from './ProductCard';
import type { Product } from '../types';

interface RelatedProductsProps {
  products: Product[];
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  if (products.length === 0) return null;

  return (
    <Box component="section" aria-labelledby="related-products-heading">
      <Typography id="related-products-heading" variant="h6" fontWeight={700} gutterBottom>
        Productos relacionados
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
        Otros productos que podrían interesarte
      </Typography>

      <Grid container spacing={2.5}>
        {products.map((product) => (
          <Grid key={product.id} size={{ xs: 12, sm: 6, md: 3 }}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
