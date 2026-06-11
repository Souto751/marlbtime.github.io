import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductListingPage from '../components/ProductListingPage';
import { getAllProducts, hasProductOffer, searchProducts } from '../services/mockData';

export default function Products() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const isOffers = searchParams.get('ofertas') === '1';
  const isUsed = searchParams.get('usados') === '1';

  const baseProducts = useMemo(() => {
    let result = query ? searchProducts(query) : getAllProducts();

    if (isOffers) {
      result = result.filter((p) => p.featured || hasProductOffer(p));
    }

    if (isUsed) {
      result = result.filter((p) => p.condition === 'usado');
    }

    return result;
  }, [query, isOffers, isUsed]);

  const title = isOffers
    ? 'Ofertas y descuentos'
    : isUsed
      ? 'Productos usados'
      : query
        ? `Resultados para "${query}"`
        : 'Todos los productos';

  const breadcrumbs = [
    { label: 'Inicio', to: '/' },
    { label: 'Productos', to: '/productos' },
    ...(query ? [{ label: query }] : isOffers ? [{ label: 'Ofertas' }] : isUsed ? [{ label: 'Usados' }] : []),
  ];

  return (
    <ProductListingPage
      title={title}
      breadcrumbs={breadcrumbs}
      baseProducts={baseProducts}
      initialFilters={{
        onOffer: isOffers,
        conditions: isUsed ? ['usado'] : [],
      }}
    />
  );
}
