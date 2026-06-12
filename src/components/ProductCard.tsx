import {
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Stack,
  Typography,
  Box,
} from '@mui/material';
import { Link } from 'react-router-dom';
import ProductImage from './ProductImage';
import ProductPriceDisplay, { ProductBadgesOverlay } from './ProductPriceDisplay';
import { getCategoryById } from '../services/mockData';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

import { useTenantPath } from '../hooks/useTenantPath';

export default function ProductCard({ product }: ProductCardProps) {
  const category = getCategoryById(product.categoryId);
  const { tp } = useTenantPath();

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardActionArea component={Link} to={tp(`/producto/${product.id}`)} sx={{ flex: 1 }}>
        <Box sx={{ position: 'relative' }}>
          <ProductBadgesOverlay product={product} />
          <ProductImage src={product.image} alt={product.title} height={180} />
        </Box>
        <CardContent>
          <Stack direction="row" spacing={1} mb={1} flexWrap="wrap" useFlexGap>
            {category && (
              <Chip label={category.name} size="small" variant="outlined" color="primary" />
            )}
            {product.condition === 'nuevo' && (
              <Chip label="Nuevo" size="small" color="success" />
            )}
          </Stack>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom noWrap>
            {product.title}
          </Typography>
          <ProductPriceDisplay product={product} />
          {product.stock <= 3 && product.stock > 0 && (
            <Typography variant="caption" color="warning.main" display="block" mt={0.5}>
              ¡Últimas {product.stock} unidades!
            </Typography>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
