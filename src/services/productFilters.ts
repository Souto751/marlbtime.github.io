import type { Product } from '../types';
import priceRangesData from '../data/priceRanges.json';
import { categories, formatPrice, getCategoryById, hasProductOffer } from './mockData';

export interface PriceRangeOption {
  id: string;
  label: string;
  min: number;
  max: number | null;
}

export const PRICE_RANGES: PriceRangeOption[] = priceRangesData;

export interface ProductFilterState {
  inStock: boolean;
  categoryIds: string[];
  subcategories: string[];
  brands: string[];
  conditions: Array<'nuevo' | 'usado'>;
  priceRanges: string[];
  minPrice: number | null;
  maxPrice: number | null;
  onOffer: boolean;
  featured: boolean;
}

export const EMPTY_FILTERS: ProductFilterState = {
  inStock: false,
  categoryIds: [],
  subcategories: [],
  brands: [],
  conditions: [],
  priceRanges: [],
  minPrice: null,
  maxPrice: null,
  onOffer: false,
  featured: false,
};

export function inferBrand(product: Product): string | null {
  if (product.brand) return product.brand;

  const title = product.title.toUpperCase();
  const rules: Array<[string, string]> = [
    ['MSI', 'MSI'],
    ['ASUS', 'Asus'],
    ['GIGABYTE', 'Gigabyte'],
    ['SAMSUNG', 'Samsung'],
    ['GALAXY', 'Samsung'],
    ['IPHONE', 'Apple'],
    ['MACBOOK', 'Apple'],
    ['PLAYSTATION', 'Sony'],
    ['PS4', 'Sony'],
    ['PS5', 'Sony'],
    ['XBOX', 'Microsoft'],
    ['MOTOROLA', 'Motorola'],
    ['XIAOMI', 'Xiaomi'],
    ['REDMI', 'Xiaomi'],
    ['LOGITECH', 'Logitech'],
    ['SONY', 'Sony'],
    ['NVIDIA', 'NVIDIA'],
    ['RTX', 'NVIDIA'],
    ['GEFORCE', 'NVIDIA'],
    ['AMD', 'AMD'],
    ['RYZEN', 'AMD'],
    ['INTEL', 'Intel'],
    ['LENOVO', 'Lenovo'],
    ['REDRAGON', 'Redragon'],
    ['NINTENDO', 'Nintendo'],
  ];

  for (const [needle, brand] of rules) {
    if (title.includes(needle)) return brand;
  }

  return null;
}

export function inferSubcategory(product: Product): string | null {
  if (product.subcategory) return product.subcategory;

  const title = product.title.toLowerCase();

  if (title.includes('rtx') || (title.includes('placa') && title.includes('nvidia'))) {
    return 'Placas de Video Nvidia';
  }
  if (title.includes('radeon') || (title.includes('placa') && title.includes('amd'))) {
    return 'Placas de Video AMD';
  }
  if (title.includes('procesador') || title.includes('ryzen') || title.includes('core i')) {
    return 'Procesadores';
  }
  if (title.includes('memoria') || title.includes('ram') || title.includes('ddr')) {
    return 'Memorias RAM';
  }
  if (title.includes('ssd') || title.includes('nvme')) {
    return 'Almacenamiento';
  }
  if (title.includes('monitor')) return 'Monitores';
  if (title.includes('teclado')) return 'Teclados';
  if (title.includes('mouse')) return 'Mouse';
  if (title.includes('auricular')) return 'Auriculares';
  if (title.includes('notebook') || title.includes('macbook')) return 'Notebooks';
  if (title.includes('iphone') || (title.includes('galaxy') && !title.includes('tab') && !title.includes('watch'))) {
    return 'Smartphones';
  }
  if (title.includes('tablet') || title.includes('tab ')) return 'Tablets';
  if (title.includes('playstation') || title.includes('ps4') || title.includes('ps5')) {
    return 'PlayStation';
  }
  if (title.includes('xbox')) return 'Xbox';
  if (title.includes('nintendo') || title.includes('switch')) return 'Nintendo';

  const category = getCategoryById(product.categoryId);
  return category?.name ?? null;
}

function toggleValue<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

export function toggleFilter<K extends keyof ProductFilterState>(
  filters: ProductFilterState,
  key: K,
  value: ProductFilterState[K] extends Array<infer U> ? U : never,
): ProductFilterState {
  const current = filters[key];
  if (Array.isArray(current)) {
    return { ...filters, [key]: toggleValue(current, value) };
  }
  return filters;
}

function matchesPriceRange(price: number, range: PriceRangeOption): boolean {
  if (range.max === null) return price >= range.min;
  if (range.min === 0) return price <= range.max;
  return price > range.min && price <= range.max;
}

export function applyProductFilters(products: Product[], filters: ProductFilterState): Product[] {
  return products.filter((product) => {
    if (filters.inStock && product.stock <= 0) return false;

    if (filters.categoryIds.length > 0 && !filters.categoryIds.includes(product.categoryId)) {
      return false;
    }

    if (filters.conditions.length > 0 && !filters.conditions.includes(product.condition)) {
      return false;
    }

    if (filters.onOffer && !hasProductOffer(product) && !product.featured) {
      return false;
    }

    if (filters.featured && !product.featured) {
      return false;
    }

    if (filters.minPrice !== null && product.price < filters.minPrice) return false;
    if (filters.maxPrice !== null && product.price > filters.maxPrice) return false;

    if (filters.priceRanges.length > 0) {
      const inSelectedRange = filters.priceRanges.some((rangeId) => {
        const range = PRICE_RANGES.find((item) => item.id === rangeId);
        return range ? matchesPriceRange(product.price, range) : false;
      });
      if (!inSelectedRange) return false;
    }

    const subcategory = inferSubcategory(product);
    if (filters.subcategories.length > 0 && (!subcategory || !filters.subcategories.includes(subcategory))) {
      return false;
    }

    const brand = inferBrand(product);
    if (filters.brands.length > 0 && (!brand || !filters.brands.includes(brand))) {
      return false;
    }

    return true;
  });
}

export function sortProducts(products: Product[], sortBy: string): Product[] {
  switch (sortBy) {
    case 'price-asc':
      return [...products].sort((a, b) => a.price - b.price);
    case 'price-desc':
      return [...products].sort((a, b) => b.price - a.price);
    case 'newest':
    default:
      return [...products].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }
}

function countBy<T extends string>(
  products: Product[],
  getter: (product: Product) => T | null,
): Array<{ value: T; count: number }> {
  const map = new Map<T, number>();
  for (const product of products) {
    const value = getter(product);
    if (!value) continue;
    map.set(value, (map.get(value) ?? 0) + 1);
  }

  return [...map.entries()]
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => a.value.localeCompare(b.value, 'es'));
}

export interface FilterOptions {
  categories: Array<{ id: string; name: string; count: number }>;
  subcategories: Array<{ value: string; count: number }>;
  brands: Array<{ value: string; count: number }>;
  conditions: Array<{ value: 'nuevo' | 'usado'; count: number }>;
  priceRanges: Array<{ id: string; label: string; count: number }>;
  inStockCount: number;
  onOfferCount: number;
  featuredCount: number;
  minAvailablePrice: number;
  maxAvailablePrice: number;
}

export function hasActiveFilters(
  filters: ProductFilterState,
  initialFilters: Partial<ProductFilterState> = {},
): boolean {
  const merged = { ...EMPTY_FILTERS, ...initialFilters };
  return (
    filters.inStock !== merged.inStock ||
    filters.onOffer !== merged.onOffer ||
    filters.featured !== merged.featured ||
    filters.minPrice !== null ||
    filters.maxPrice !== null ||
    filters.priceRanges.length > 0 ||
    filters.categoryIds.length !== merged.categoryIds.length ||
    filters.categoryIds.some((id) => !merged.categoryIds.includes(id)) ||
    filters.subcategories.length > 0 ||
    filters.brands.length > 0 ||
    filters.conditions.length !== merged.conditions.length ||
    filters.conditions.some((c) => !merged.conditions.includes(c))
  );
}

export function buildFilterOptions(products: Product[]): FilterOptions {
  const prices = products.map((product) => product.price);

  return {
    categories: categories
      .map((category) => ({
        id: category.id,
        name: category.name,
        count: products.filter((product) => product.categoryId === category.id).length,
      }))
      .filter((item) => item.count > 0),
    subcategories: countBy(products, inferSubcategory),
    brands: countBy(products, inferBrand),
    conditions: (['nuevo', 'usado'] as const)
      .map((condition) => ({
        value: condition,
        count: products.filter((product) => product.condition === condition).length,
      }))
      .filter((item) => item.count > 0),
    priceRanges: PRICE_RANGES.map((range) => ({
      id: range.id,
      label: range.label,
      count: products.filter((product) => matchesPriceRange(product.price, range)).length,
    })).filter((item) => item.count > 0),
    inStockCount: products.filter((product) => product.stock > 0).length,
    onOfferCount: products.filter((product) => hasProductOffer(product) || product.featured).length,
    featuredCount: products.filter((product) => product.featured).length,
    minAvailablePrice: prices.length ? Math.min(...prices) : 0,
    maxAvailablePrice: prices.length ? Math.max(...prices) : 0,
  };
}

export { formatPrice };
