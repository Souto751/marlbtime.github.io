import { Avatar, Box, Divider, Rating, Stack, Typography } from '@mui/material';
import type { ProductReview } from '../types';

interface ProductReviewsProps {
  reviews: ProductReview[];
}

function formatReviewDate(date: string): string {
  return new Intl.DateTimeFormat('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

export default function ProductReviews({ reviews }: ProductReviewsProps) {
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  return (
    <Box component="section" aria-labelledby="product-reviews-heading">
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ sm: 'center' }}
        spacing={2}
        mb={2.5}
      >
        <Box>
          <Typography id="product-reviews-heading" variant="h6" fontWeight={700} gutterBottom>
            Opiniones de clientes
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {reviews.length} {reviews.length === 1 ? 'reseña' : 'reseñas'}
          </Typography>
        </Box>
        {reviews.length > 0 && (
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Typography variant="h5" fontWeight={700} color="primary.main" lineHeight={1}>
              {averageRating.toFixed(1)}
            </Typography>
            <Box>
              <Rating value={averageRating} precision={0.1} readOnly size="small" />
              <Typography variant="caption" color="text.secondary" display="block">
                Promedio general
              </Typography>
            </Box>
          </Stack>
        )}
      </Stack>

      {reviews.length === 0 ? (
        <Typography variant="body1" color="text.secondary" py={1}>
          Todavía no hay reseñas para este producto. Sé el primero en consultar y comprar.
        </Typography>
      ) : (
        <Stack
          divider={<Divider flexItem sx={{ borderColor: 'divider' }} />}
          spacing={2.5}
          sx={{
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            px: { xs: 2, sm: 2.5 },
            py: { xs: 2, sm: 2.5 },
          }}
        >
          {reviews.map((review) => (
            <Box key={review.id}>
              <Stack direction="row" spacing={2} alignItems="flex-start">
                <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main', fontSize: '0.875rem' }}>
                  {getInitials(review.author)}
                </Avatar>
                <Box flex={1}>
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    justifyContent="space-between"
                    alignItems={{ sm: 'center' }}
                    mb={0.5}
                    spacing={0.5}
                  >
                    <Typography variant="subtitle2" fontWeight={600}>
                      {review.author}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatReviewDate(review.date)}
                    </Typography>
                  </Stack>
                  <Rating value={review.rating} readOnly size="small" sx={{ mb: 0.75 }} />
                  <Typography variant="body2" color="text.secondary">
                    {review.comment}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          ))}
        </Stack>
      )}
    </Box>
  );
}
