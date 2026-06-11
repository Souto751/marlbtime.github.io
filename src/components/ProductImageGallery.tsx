import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ImageNotSupportedOutlinedIcon from '@mui/icons-material/ImageNotSupportedOutlined';
import { Box, IconButton, Stack, Typography } from '@mui/material';
import { useEffect, useState, type ReactNode } from 'react';

interface ProductImageGalleryProps {
  images: string[];
  alt: string;
  overlay?: ReactNode;
  maxHeight?: number;
}

export default function ProductImageGallery({
  images,
  alt,
  overlay,
  maxHeight = 450,
}: ProductImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [failedIndexes, setFailedIndexes] = useState<Set<number>>(new Set());

  useEffect(() => {
    setActiveIndex(0);
    setFailedIndexes(new Set());
  }, [images]);

  const hasMultiple = images.length > 1;

  const handleImageError = (index: number) => {
    setFailedIndexes((prev) => {
      const next = new Set(prev);
      next.add(index);
      return next;
    });
  };

  const goTo = (index: number) => {
    if (images.length === 0) return;
    setActiveIndex((index + images.length) % images.length);
  };

  const goPrev = () => goTo(activeIndex - 1);
  const goNext = () => goTo(activeIndex + 1);

  const currentSrc = images[activeIndex];
  const showPlaceholder = images.length === 0 || failedIndexes.has(activeIndex);

  return (
    <Box>
      <Box
        sx={{
          position: 'relative',
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          overflow: 'hidden',
          minHeight: { xs: 280, sm: 360 },
          maxHeight,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {overlay}

        {showPlaceholder ? (
          <Box
            sx={{
              width: '100%',
              minHeight: { xs: 280, sm: 360 },
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'grey.600',
              gap: 1,
            }}
          >
            <ImageNotSupportedOutlinedIcon sx={{ fontSize: 56, opacity: 0.5 }} />
            <Typography variant="body2" fontWeight={600}>
              Sin foto
            </Typography>
          </Box>
        ) : (
          <Box
            component="img"
            src={currentSrc}
            alt={`${alt} - imagen ${activeIndex + 1}`}
            onError={() => handleImageError(activeIndex)}
            sx={{
              width: '100%',
              maxHeight,
              objectFit: 'contain',
              display: 'block',
              p: { xs: 2, sm: 3 },
            }}
          />
        )}

        {hasMultiple && !showPlaceholder && (
          <>
            <IconButton
              onClick={goPrev}
              aria-label="Imagen anterior"
              sx={{
                position: 'absolute',
                left: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                boxShadow: 1,
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              <ChevronLeftIcon />
            </IconButton>
            <IconButton
              onClick={goNext}
              aria-label="Imagen siguiente"
              sx={{
                position: 'absolute',
                right: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                boxShadow: 1,
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              <ChevronRightIcon />
            </IconButton>
          </>
        )}
      </Box>

      {images.length > 1 && (
        <Stack
          direction="row"
          spacing={1.25}
          sx={{
            mt: 1.5,
            overflowX: 'auto',
            pb: 0.5,
            '&::-webkit-scrollbar': { height: 6 },
            '&::-webkit-scrollbar-thumb': {
              bgcolor: 'grey.400',
              borderRadius: 3,
            },
          }}
        >
          {images.map((src, index) => {
            const isActive = index === activeIndex;
            const thumbFailed = failedIndexes.has(index);

            return (
              <Box
                key={`${src}-${index}`}
                component="button"
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Ver imagen ${index + 1}`}
                aria-current={isActive ? 'true' : undefined}
                sx={{
                  flexShrink: 0,
                  width: 72,
                  height: 72,
                  p: 0.75,
                  border: '2px solid',
                  borderColor: isActive ? 'success.main' : 'divider',
                  borderRadius: 1,
                  bgcolor: 'background.paper',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'border-color 0.2s',
                  '&:hover': {
                    borderColor: isActive ? 'success.main' : 'primary.light',
                  },
                }}
              >
                {thumbFailed ? (
                  <ImageNotSupportedOutlinedIcon sx={{ fontSize: 28, color: 'grey.500' }} />
                ) : (
                  <Box
                    component="img"
                    src={src}
                    alt=""
                    onError={() => handleImageError(index)}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      display: 'block',
                    }}
                  />
                )}
              </Box>
            );
          })}
        </Stack>
      )}
    </Box>
  );
}
