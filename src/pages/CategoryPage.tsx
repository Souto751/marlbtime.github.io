import { Container, Typography } from '@mui/material';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import ProductListingPage from '../components/ProductListingPage';
import { getCategoryBySlug, getProductsByCategory } from '../services/mockData';

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const category = slug ? getCategoryBySlug(slug) : undefined;

  const baseProducts = useMemo(
    () => (category ? getProductsByCategory(category.id) : []),
    [category],
  );

  if (!category) {
    return (
      <Container>
        <Typography variant="h5" color="error">
          Categoría no encontrada
        </Typography>
      </Container>
    );
  }

  return (
    <ProductListingPage
      title={category.name}
      description={category.description}
      breadcrumbs={[
        { label: 'Inicio', to: '/' },
        { label: 'Productos', to: '/productos' },
        { label: category.name },
      ]}
      baseProducts={baseProducts}
      initialFilters={{ categoryIds: [category.id] }}
    />
  );
}
