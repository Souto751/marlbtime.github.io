import { Box, Chip, Stack, Typography } from '@mui/material';
import { formatPrice, getDiscountPercent, hasProductOffer } from '../services/mockData';
import type { Product } from '../types';

interface ProductPriceDisplayProps {
  product: Product;
  size?: 'card' | 'detail';
}

export default function ProductPriceDisplay({ product, size = 'card' }: ProductPriceDisplayProps) {
  const onOffer = hasProductOffer(product);
  const discount = getDiscountPercent(product);
  const priceVariant = size === 'detail' ? 'h4' : 'h6';

  return (
    <Stack spacing={0.5}>
      {onOffer && (
        <Stack direction="row" spacing={1} alignItems="center">
          <Chip
            label={`-${discount}% OFF`}
            size="small"
            color="secondary"
            sx={{ fontWeight: 700 }}
          />
          <Typography
            variant={size === 'detail' ? 'h6' : 'body2'}
            color="text.disabled"
            sx={{ textDecoration: 'line-through' }}
          >
            {formatPrice(product.originalPrice!)}
          </Typography>
        </Stack>
      )}
      <Typography variant={priceVariant} color={onOffer ? 'secondary.main' : 'primary.main'} fontWeight={800}>
        {formatPrice(product.price)}
      </Typography>
    </Stack>
  );
}

export function ProductBadgesOverlay({ product }: { product: Product }) {
  const onOffer = hasProductOffer(product);
  const discount = getDiscountPercent(product);

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 8,
        left: 8,
        display: 'flex',
        flexDirection: 'column',
        gap: 0.5,
        zIndex: 1,
      }}
    >
      {onOffer && (
        <Chip
          label={`-${discount}%`}
          size="small"
          color="secondary"
          sx={{ fontWeight: 700, height: 24 }}
        />
      )}
      {product.condition === 'usado' && (
        <Chip
          label="Usado"
          size="small"
          sx={{
            fontWeight: 700,
            height: 24,
            bgcolor: 'warning.dark',
            color: 'warning.contrastText',
          }}
        />
      )}
    </Box>
  );
}
