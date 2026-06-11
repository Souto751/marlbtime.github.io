import { Box, Typography } from '@mui/material';

interface ProductDescriptionProps {
  description: string;
}

export default function ProductDescription({ description }: ProductDescriptionProps) {
  const paragraphs = description.split(/\n\n+/).filter(Boolean);

  return (
    <Box component="section" aria-labelledby="product-description-heading">
      <Typography id="product-description-heading" variant="h6" fontWeight={700} gutterBottom>
        Descripción
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
        Información detallada del producto
      </Typography>

      <Box
        sx={{
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
          px: { xs: 2, sm: 2.5 },
          py: { xs: 2, sm: 2.5 },
        }}
      >
        {paragraphs.map((paragraph, index) => (
          <Typography
            key={index}
            variant="body1"
            color="text.secondary"
            sx={{
              lineHeight: 1.7,
              mb: index < paragraphs.length - 1 ? 2 : 0,
            }}
          >
            {paragraph}
          </Typography>
        ))}
      </Box>
    </Box>
  );
}
