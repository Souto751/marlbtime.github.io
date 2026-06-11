import {
  Box,
  Breadcrumbs,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import BackButton from './BackButton';
import ProductCard from './ProductCard';
import ProductFiltersSidebar from './ProductFiltersSidebar';
import {
  EMPTY_FILTERS,
  applyProductFilters,
  buildFilterOptions,
  sortProducts,
  toggleFilter,
  type ProductFilterState,
} from '../services/productFilters';
import type { Product } from '../types';

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface ProductListingPageProps {
  title: string;
  description?: string;
  breadcrumbs: BreadcrumbItem[];
  baseProducts: Product[];
  initialFilters?: Partial<ProductFilterState>;
}

export default function ProductListingPage({
  title,
  description,
  breadcrumbs,
  baseProducts,
  initialFilters = {},
}: ProductListingPageProps) {
  const [filters, setFilters] = useState<ProductFilterState>({
    ...EMPTY_FILTERS,
    ...initialFilters,
  });
  const [sortBy, setSortBy] = useState('price-asc');

  const filterOptions = useMemo(() => buildFilterOptions(baseProducts), [baseProducts]);

  const filteredProducts = useMemo(() => {
    const filtered = applyProductFilters(baseProducts, filters);
    return sortProducts(filtered, sortBy);
  }, [baseProducts, filters, sortBy]);

  const handleToggle = <K extends keyof ProductFilterState>(
    key: K,
    value: ProductFilterState[K] extends Array<infer U> ? U : never,
  ) => {
    setFilters((prev) => toggleFilter(prev, key, value));
  };

  const handleToggleBoolean = (key: 'inStock' | 'onOffer' | 'featured') => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePriceChange = (field: 'minPrice' | 'maxPrice', value: number | null) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Container maxWidth="xl">
      <BackButton fallback="/productos" />
      <Breadcrumbs sx={{ mb: 2 }}>
        {breadcrumbs.map((item, index) =>
          item.to ? (
            <Typography
              key={item.label}
              component={Link}
              to={item.to}
              color={index === breadcrumbs.length - 1 ? 'text.primary' : 'inherit'}
              sx={{ textDecoration: 'none' }}
            >
              {item.label}
            </Typography>
          ) : (
            <Typography key={item.label} color="text.primary">
              {item.label}
            </Typography>
          ),
        )}
      </Breadcrumbs>

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        spacing={2}
        mb={3}
      >
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom={!!description}>
            {title}
          </Typography>
          {description && (
            <Typography variant="body1" color="text.secondary">
              {description}
            </Typography>
          )}
        </Box>

        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Ordenar por</InputLabel>
          <Select
            label="Ordenar por"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <MenuItem value="price-asc">Menor precio</MenuItem>
            <MenuItem value="price-desc">Mayor precio</MenuItem>
            <MenuItem value="newest">Más recientes</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 3, lg: 2.8 }}>
          <ProductFiltersSidebar
            filters={filters}
            options={filterOptions}
            initialFilters={initialFilters}
            onToggle={handleToggle}
            onToggleBoolean={handleToggleBoolean}
            onPriceChange={handlePriceChange}
            onClear={() => setFilters({ ...EMPTY_FILTERS, ...initialFilters })}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 9, lg: 9.2 }}>
          <Typography variant="body2" color="text.secondary" mb={2}>
            {filteredProducts.length}{' '}
            {filteredProducts.length === 1 ? 'producto encontrado' : 'productos encontrados'}
          </Typography>

          {filteredProducts.length === 0 ? (
            <Box textAlign="center" py={8}>
              <Typography color="text.secondary">
                No hay productos con los filtros seleccionados
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {filteredProducts.map((product) => (
                <Grid key={product.id} size={{ xs: 12, sm: 6, lg: 4 }}>
                  <ProductCard product={product} />
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}
