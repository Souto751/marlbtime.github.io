import categoriesData from '../data/categories.json';
import productDetailsData from '../data/productDetails.json';
import productsData from '../data/products.json';
import usersData from '../data/users.json';
import type {
  AuthUser,
  Category,
  Product,
  ProductDetails,
  ProductQuestion,
  ProductReview,
  ProductSpecification,
  StoreConfig,
  User,
} from '../types';
import {
  applyProductOverrides,
  getAdminCreatedProducts,
  getAdminDetailsEdits,
} from './adminData';
import {
  getTenantBySlug,
  tenantToStoreConfig,
} from './tenantData';
import {
  DEFAULT_TENANT_SLUG,
  getActiveTenantId,
  getPlatformStorageKey,
  getTenantStorageKey,
  resolveTenantSlugFromPath,
} from './tenantScope';

const USERS_KEY = 'registered_users';

export const categories: Category[] = categoriesData;
export const baseUsers: User[] = usersData as User[];

const productDetailsMap = productDetailsData as Record<string, ProductDetails>;

const SHOP_TENANT_ID = 'tenant-shop';

function assignTenantId(product: Product): Product {
  if (product.tenantId) return product;
  return { ...product, tenantId: SHOP_TENANT_ID };
}

export const baseProducts: Product[] = (productsData as Product[]).map(assignTenantId);

/** @deprecated Usar useTenant().storeConfig en componentes React. */
export function getStoreConfig(): StoreConfig {
  if (typeof window === 'undefined') {
    const tenant = getTenantBySlug(DEFAULT_TENANT_SLUG);
    return tenant ? tenantToStoreConfig(tenant) : fallbackStoreConfig();
  }
  const slug = resolveTenantSlugFromPath(window.location.pathname) ?? DEFAULT_TENANT_SLUG;
  const tenant = getTenantBySlug(slug);
  return tenant ? tenantToStoreConfig(tenant) : fallbackStoreConfig();
}

function fallbackStoreConfig(): StoreConfig {
  return {
    storeName: 'Shop',
    tagline: 'Tu marketplace de tecnología y gaming',
    whatsapp: '5491123456789',
    email: 'contacto@marlbtime.com',
    phone: '(011) 1234-5678',
    address: 'Av. Corrientes 1234, CABA, Argentina',
    website: 'shop.marlbtime.com',
  };
}

/** Compatibilidad temporal con imports existentes. */
export const storeConfig = getStoreConfig();

const DEFAULT_REVIEWS: ProductReview[] = [
  {
    id: 'default-r1',
    author: 'Comprador verificado',
    rating: 5,
    comment: 'Producto en excelente estado. La coordinación de entrega fue muy simple.',
    date: '2026-03-15',
  },
  {
    id: 'default-r2',
    author: 'Cliente',
    rating: 4,
    comment: 'Buena experiencia de compra. Recomiendo consultar por WhatsApp antes.',
    date: '2026-04-20',
  },
];

const DEFAULT_QUESTIONS: ProductQuestion[] = [
  {
    id: 'default-q1',
    author: 'Comprador interesado',
    question: '¿El producto incluye factura?',
    answer: 'Sí, consultá con el vendedor por WhatsApp para confirmar el tipo de comprobante.',
    answeredBy: 'Vendedor',
    date: '2026-03-10',
    answerDate: '2026-03-11',
  },
  {
    id: 'default-q2',
    author: 'Usuario',
    question: '¿Hacen envíos al interior del país?',
    answer: 'Sí, coordinamos envío por mensajería o retiro en persona según tu zona.',
    answeredBy: 'Vendedor',
    date: '2026-04-05',
    answerDate: '2026-04-06',
  },
];

function productsKey(): string {
  return `user_products`;
}

function getUserProducts(): Product[] {
  try {
    const stored = localStorage.getItem(getTenantStorageKey(productsKey()));
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveUserProducts(products: Product[]): void {
  localStorage.setItem(getTenantStorageKey(productsKey()), JSON.stringify(products));
}

function getRegisteredUsers(): User[] {
  try {
    const stored = localStorage.getItem(getPlatformStorageKey(USERS_KEY));
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveRegisteredUsers(users: User[]): void {
  localStorage.setItem(getPlatformStorageKey(USERS_KEY), JSON.stringify(users));
}

function buildDefaultLongDescription(product: Product, category?: Category): string {
  const conditionText =
    product.condition === 'nuevo'
      ? 'Producto nuevo, en excelente estado.'
      : 'Producto usado en buen estado. Consultá por fotos adicionales si lo necesitás.';

  const categoryText = category ? `Categoría: ${category.name}.` : '';

  return `${product.description}\n\n${conditionText} ${categoryText} Stock disponible: ${product.stock} unidades.\n\nLas compras se coordinan por WhatsApp o email. Escribinos para consultar formas de pago, envío y garantía antes de confirmar.`;
}

export function getAllProducts(tenantId?: string): Product[] {
  const tid = tenantId ?? getActiveTenantId();
  const merged = applyProductOverrides([
    ...baseProducts,
    ...getUserProducts(),
    ...getAdminCreatedProducts(),
  ]);
  return merged.filter((p) => p.tenantId === tid);
}

export function getProductById(id: string, tenantId?: string): Product | undefined {
  return getAllProducts(tenantId).find((p) => p.id === id);
}

export function getProductImages(product: Product): string[] {
  const detailsEdit = getAdminDetailsEdits()[product.id];
  if (detailsEdit?.images?.length) return detailsEdit.images;
  const stored = productDetailsMap[product.id];
  if (stored?.images?.length) return stored.images;
  if (product.images?.length) return product.images;
  if (product.image?.trim()) return [product.image];
  return [];
}

export function getProductDetails(product: Product): ProductDetails {
  const stored = productDetailsMap[product.id];
  const detailsEdit = getAdminDetailsEdits()[product.id];
  const category = getCategoryById(product.categoryId);

  const baseSpecs: ProductSpecification[] = [
    { label: 'Condición', value: product.condition === 'nuevo' ? 'Nuevo' : 'Usado' },
    { label: 'Categoría', value: category?.name ?? 'General' },
    { label: 'Stock disponible', value: `${product.stock} unidades` },
    { label: 'Garantía', value: 'Consultar con el vendedor' },
    { label: 'Entrega', value: 'Coordinación por mensaje' },
  ];

  if (stored || detailsEdit) {
    return {
      specifications: detailsEdit?.specifications?.length
        ? detailsEdit.specifications
        : stored?.specifications ?? baseSpecs,
      reviews: stored?.reviews ?? DEFAULT_REVIEWS,
      longDescription:
        detailsEdit?.longDescription ??
        stored?.longDescription ??
        buildDefaultLongDescription(product, category),
      questions: stored?.questions?.length ? stored.questions : DEFAULT_QUESTIONS,
      images: detailsEdit?.images ?? stored?.images,
    };
  }

  return {
    specifications: baseSpecs,
    reviews: DEFAULT_REVIEWS,
    longDescription: buildDefaultLongDescription(product, category),
    questions: DEFAULT_QUESTIONS,
  };
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  const candidates = getAllProducts(product.tenantId).filter((p) => p.id !== product.id);

  const scored = candidates.map((candidate) => {
    let score = 0;
    if (candidate.categoryId === product.categoryId) score += 3;
    if (product.subcategory && candidate.subcategory === product.subcategory) score += 2;
    if (product.brand && candidate.brand === product.brand) score += 2;
    if (candidate.featured) score += 1;
    if (candidate.condition === product.condition) score += 1;
    return { product: candidate, score };
  });

  scored.sort((a, b) => b.score - a.score || a.product.title.localeCompare(b.product.title));

  const related = scored.filter((item) => item.score > 0).map((item) => item.product);
  const selected = [...related];

  if (selected.length < limit) {
    const selectedIds = new Set(selected.map((p) => p.id));
    for (const candidate of candidates) {
      if (!selectedIds.has(candidate.id)) {
        selected.push(candidate);
        if (selected.length >= limit) break;
      }
    }
  }

  return selected.slice(0, limit);
}

export function getProductsByCategory(categoryId: string, tenantId?: string): Product[] {
  return getAllProducts(tenantId).filter((p) => p.categoryId === categoryId);
}

export function getFeaturedProducts(tenantId?: string): Product[] {
  return getAllProducts(tenantId).filter((p) => p.featured);
}

export function getProductsBySeller(sellerId: string, tenantId?: string): Product[] {
  return getAllProducts(tenantId).filter((p) => p.sellerId === sellerId);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getCategoryById(id: string): Category | undefined {
  return categories.find((c) => c.id === id);
}

export function searchProducts(query: string, tenantId?: string): Product[] {
  const normalized = query.toLowerCase().trim();
  const all = getAllProducts(tenantId);
  if (!normalized) return all;
  return all.filter(
    (p) =>
      p.title.toLowerCase().includes(normalized) ||
      p.description.toLowerCase().includes(normalized),
  );
}

export function getAllUsers(): User[] {
  return [...baseUsers, ...getRegisteredUsers()];
}

export function loginUser(email: string, password: string): AuthUser | null {
  const user = getAllUsers().find((u) => u.email === email && u.password === password);
  if (!user) return null;
  return { id: user.id, email: user.email, name: user.name, phone: user.phone, role: user.role };
}

export function registerUser(data: {
  name: string;
  email: string;
  password: string;
  phone: string;
}): { success: boolean; error?: string; user?: AuthUser } {
  if (getAllUsers().some((u) => u.email === data.email)) {
    return { success: false, error: 'El email ya está registrado' };
  }

  const newUser: User = {
    id: `user-${Date.now()}`,
    ...data,
    role: 'buyer',
  };

  const registered = getRegisteredUsers();
  registered.push(newUser);
  saveRegisteredUsers(registered);

  return {
    success: true,
    user: {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      phone: newUser.phone,
      role: newUser.role,
    },
  };
}

export function createProduct(product: Omit<Product, 'id' | 'createdAt'>): Product {
  const newProduct: Product = {
    ...product,
    tenantId: product.tenantId ?? getActiveTenantId(),
    id: `prod-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };

  const userProducts = getUserProducts();
  userProducts.push(newProduct);
  saveUserProducts(userProducts);

  return newProduct;
}

export function deleteProduct(productId: string, sellerId: string): boolean {
  const userProducts = getUserProducts();
  const index = userProducts.findIndex((p) => p.id === productId && p.sellerId === sellerId);
  if (index === -1) return false;
  userProducts.splice(index, 1);
  saveUserProducts(userProducts);
  return true;
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  }).format(price);
}

export function hasProductOffer(product: Product): boolean {
  return !!product.originalPrice && product.originalPrice > product.price;
}

export function getDiscountPercent(product: Product): number {
  if (!hasProductOffer(product) || !product.originalPrice) return 0;
  return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
}

export function getUsedProducts(tenantId?: string): Product[] {
  return getAllProducts(tenantId).filter((p) => p.condition === 'usado');
}

export function getOfferProducts(tenantId?: string): Product[] {
  return getAllProducts(tenantId).filter((p) => p.featured || hasProductOffer(p));
}

export function buildWhatsAppLink(message: string, whatsapp?: string): string {
  const phone = (whatsapp ?? getStoreConfig().whatsapp).replace(/\D/g, '');
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
