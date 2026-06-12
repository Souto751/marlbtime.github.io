import {
  Alert,
  Box,
  Breadcrumbs,
  Button,
  Chip,
  Container,
  Divider,
  Snackbar,
  Stack,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { Link, useParams } from 'react-router-dom';
import { useState } from 'react';
import BackButton from '../components/BackButton';
import { useCart } from '../contexts/CartContext';
import ProductImageGallery from '../components/ProductImageGallery';
import ProductPriceDisplay, { ProductBadgesOverlay } from '../components/ProductPriceDisplay';
import ProductDescription from '../components/ProductDescription';
import ProductQuestions from '../components/ProductQuestions';
import ProductReviews from '../components/ProductReviews';
import ProductSpecifications from '../components/ProductSpecifications';
import RelatedProducts from '../components/RelatedProducts';
import { useTenantPath } from '../hooks/useTenantPath';
import {
  buildWhatsAppLink,
  formatPrice,
  getCategoryById,
  getProductById,
  getProductDetails,
  getProductImages,
  getRelatedProducts,
  hasProductOffer,
  storeConfig,
} from '../services/mockData';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { tp, home } = useTenantPath();
  const product = id ? getProductById(id) : undefined;
  const { addToCart } = useCart();
  const [snackbar, setSnackbar] = useState(false);

  if (!product) {
    return (
      <Container>
        <Typography variant="h5" color="error">
          Producto no encontrado
        </Typography>
      </Container>
    );
  }

  const category = getCategoryById(product.categoryId);
  const { specifications, reviews, longDescription, questions } = getProductDetails(product);
  const relatedProducts = getRelatedProducts(product);
  const productImages = getProductImages(product);
  const whatsappMessage = `Hola! Me interesa el producto "${product.title}" (${formatPrice(product.price)}). ¿Está disponible?`;
  const whatsappQuestionMessage = `Hola! Tengo una consulta sobre el producto "${product.title}". `;

  const handleAddToCart = () => {
    addToCart(product);
    setSnackbar(true);
  };

  const handleAskQuestion = () => {
    window.open(buildWhatsAppLink(whatsappQuestionMessage), '_blank', 'noopener,noreferrer');
  };

  return (
    <Container maxWidth="lg">
      <BackButton fallback={category ? tp(`/categoria/${category.slug}`) : tp('/productos')} />
      <Breadcrumbs sx={{ mb: 2 }}>
        <Typography component={Link} to={home} color="inherit" sx={{ textDecoration: 'none' }}>
          Inicio
        </Typography>
        <Typography component={Link} to={tp('/productos')} color="inherit" sx={{ textDecoration: 'none' }}>
          Productos
        </Typography>
        {category && (
          <Typography
            component={Link}
            to={tp(`/categoria/${category.slug}`)}
            color="inherit"
            sx={{ textDecoration: 'none' }}
          >
            {category.name}
          </Typography>
        )}
        <Typography color="text.primary">{product.title}</Typography>
      </Breadcrumbs>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 6 }}>
          <ProductImageGallery
            images={productImages}
            alt={product.title}
            overlay={<ProductBadgesOverlay product={product} />}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Stack spacing={2}>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {category && <Chip label={category.name} color="primary" variant="outlined" />}
              <Chip
                label={product.condition === 'nuevo' ? 'Nuevo' : 'Usado'}
                color={product.condition === 'nuevo' ? 'success' : 'warning'}
              />
              {hasProductOffer(product) && (
                <Chip label="En oferta" color="secondary" />
              )}
              {product.tags?.map((tag) => (
                <Chip key={tag} label={tag} size="small" variant="outlined" />
              ))}
            </Stack>

            <Typography variant="h4" fontWeight={700}>
              {product.title}
            </Typography>

            <ProductPriceDisplay product={product} size="detail" />

            <Typography variant="body2">
              Stock disponible: <strong>{product.stock}</strong> unidades
            </Typography>

            <Alert severity="info" variant="outlined">
              Las compras se coordinan por mensaje. No hay pasarela de pagos integrada.
            </Alert>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button
                variant="contained"
                size="large"
                startIcon={<AddShoppingCartIcon />}
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                Agregar al carrito
              </Button>
              <Button
                variant="outlined"
                size="large"
                color="success"
                startIcon={<WhatsAppIcon />}
                href={buildWhatsAppLink(whatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Consultar por WhatsApp
              </Button>
            </Stack>

            <Typography variant="caption" color="text.secondary">
              Contacto: {storeConfig.phone} · {storeConfig.email}
            </Typography>
          </Stack>
        </Grid>
      </Grid>

      <Box
        component="section"
        sx={{
          mt: { xs: 4, md: 5 },
          pt: { xs: 3, md: 4 },
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Stack
          spacing={{ xs: 3.5, md: 4 }}
          divider={<Divider flexItem sx={{ borderColor: 'divider' }} />}
        >
          {longDescription && <ProductDescription description={longDescription} />}
          <ProductSpecifications specifications={specifications} />
          <ProductReviews reviews={reviews} />
          <ProductQuestions questions={questions ?? []} onAskQuestion={handleAskQuestion} />
        </Stack>
      </Box>

      {relatedProducts.length > 0 && (
        <Box
          sx={{
            mt: { xs: 4, md: 5 },
            pt: { xs: 3, md: 4 },
            borderTop: '1px solid',
            borderColor: 'divider',
          }}
        >
          <RelatedProducts products={relatedProducts} />
        </Box>
      )}

      <Snackbar
        open={snackbar}
        autoHideDuration={3000}
        onClose={() => setSnackbar(false)}
        message="Producto agregado al carrito"
      />
    </Container>
  );
}
