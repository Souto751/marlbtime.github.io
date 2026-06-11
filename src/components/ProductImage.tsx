import ImageNotSupportedOutlinedIcon from '@mui/icons-material/ImageNotSupportedOutlined';
import { Box, Typography } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import { useState } from 'react';

interface ProductImageProps {
  src?: string;
  alt: string;
  height?: number | string;
  sx?: SxProps<Theme>;
}

export default function ProductImage({ src, alt, height = 180, sx }: ProductImageProps) {
  const [hasError, setHasError] = useState(false);
  const showPlaceholder = !src?.trim() || hasError;

  if (showPlaceholder) {
    return (
      <Box
        sx={{
          height,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'grey.200',
          color: 'grey.600',
          gap: 1,
          ...sx,
        }}
      >
        <ImageNotSupportedOutlinedIcon sx={{ fontSize: 48, opacity: 0.5 }} />
        <Typography variant="body2" fontWeight={600}>
          Sin foto
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      component="img"
      src={src}
      alt={alt}
      onError={() => setHasError(true)}
      sx={{
        height,
        width: '100%',
        objectFit: 'cover',
        display: 'block',
        ...sx,
      }}
    />
  );
}
