import categoriesData from '../data/categories.json';
import productDetailsData from '../data/productDetails.json';
import productsData from '../data/products.json';
import usersData from '../data/users.json';
import storeData from '../data/store.json';
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
import { applyProductOverrides, getAdminCreatedProducts, getAdminDetailsEdits } from './adminData';

const PRODUCTS_KEY = 'marlbtime_user_products';
const USERS_KEY = 'marlbtime_registered_users';

export const storeConfig: StoreConfig = storeData;
export const categories: Category[] = categoriesData;
export const baseProducts: Product[] = productsData as Product[];
export const baseUsers: User[] = usersData as User[];

const productDetailsMap = productDetailsData as Record<string, ProductDetails>;

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
    author: 'Cliente Marlbtime',
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
    author: 'Usuario Marlbtime',
    question: '¿Hacen envíos al interior del país?',
    answer: 'Sí, coordinamos envío por mensajería o retiro en persona según tu zona.',
    answeredBy: 'Vendedor',
    date: '2026-04-05',
    answerDate: '2026-04-06',
  },
];

function buildDefaultLongDescription(product: Product, category?: Category): string {
  const conditionText =
    product.condition === 'nuevo'
      ? 'Producto nuevo, en excelente estado.'
      : 'Producto usado en buen estado. Consultá por fotos adicionales si lo necesitás.';

  const categoryText = category ? `Categoría: ${category.name}.` : '';

  return `${product.description}\n\n${conditionText} ${categoryText} Stock disponible: ${product.stock} unidades.\n\nLas compras se coordinan por WhatsApp o email. Escribinos para consultar formas de pago, envío y garantía antes de confirmar.`;
}

function getUserProducts(): Product[] {
  try {
    const stored = localStorage.getItem(PRODUCTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveUserProducts(products: Product[]): void {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
}

function getRegisteredUsers(): User[] {
  try {
    const stored = localStorage.getItem(USERS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveRegisteredUsers(users: User[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getAllProducts(): Product[] {
  return applyProductOverrides([
    ...baseProducts,
    ...getUserProducts(),
    ...getAdminCreatedProducts(),
  ]);
}

export function getProductById(id: string): Product | undefined {
  return getAllProducts().find((p) => p.id === id);
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
  const candidates = getAllProducts().filter((p) => p.id !== product.id);

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

export function getProductsByCategory(categoryId: string): Product[] {
  return getAllProducts().filter((p) => p.categoryId === categoryId);
}

export function getFeaturedProducts(): Product[] {
  return getAllProducts().filter((p) => p.featured);
}

export function getProductsBySeller(sellerId: string): Product[] {
  return getAllProducts().filter((p) => p.sellerId === sellerId);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getCategoryById(id: string): Category | undefined {
  return categories.find((c) => c.id === id);
}

export function searchProducts(query: string): Product[] {
  const normalized = query.toLowerCase().trim();
  if (!normalized) return getAllProducts();
  return getAllProducts().filter(
    (p) =>
      p.title.toLowerCase().includes(normalized) ||
      p.description.toLowerCase().includes(normalized),
  );
}

export function loginUser(email: string, password: string): AuthUser | null {
  const allUsers = [...baseUsers, ...getRegisteredUsers()];
  const user = allUsers.find((u) => u.email === email && u.password === password);
  if (!user) return null;
  return { id: user.id, email: user.email, name: user.name, phone: user.phone, role: user.role };
}

export function registerUser(data: {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: 'buyer' | 'seller';
}): { success: boolean; error?: string; user?: AuthUser } {
  const allUsers = [...baseUsers, ...getRegisteredUsers()];
  if (allUsers.some((u) => u.email === data.email)) {
    return { success: false, error: 'El email ya está registrado' };
  }

  const newUser: User = {
    id: `user-${Date.now()}`,
    ...data,
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

export function createProduct(
  product: Omit<Product, 'id' | 'createdAt'>,
): Product {
  const newProduct: Product = {
    ...product,
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

export function getUsedProducts(): Product[] {
  return getAllProducts().filter((p) => p.condition === 'usado');
}

export function getOfferProducts(): Product[] {
  return getAllProducts().filter((p) => p.featured || hasProductOffer(p));
}

export function buildWhatsAppLink(message: string): string {
  const phone = storeConfig.whatsapp.replace(/\D/g, '');
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
