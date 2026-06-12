export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  phone: string;
  role: 'buyer' | 'platform_admin';
}

export interface Tenant {
  id: string;
  subdomain: string;
  storeName: string;
  tagline: string;
  status: 'active' | 'suspended';
  whatsapp: string;
  email: string;
  phone: string;
  address: string;
  website: string;
}

export type TenantRole = 'tenant_admin' | 'seller';

export interface TenantMembership {
  userId: string;
  tenantId: string;
  role: TenantRole;
  enabled: boolean;
  createdAt?: string;
  createdBy?: string;
}

export interface Product {
  id: string;
  tenantId: string;
  title: string;
  description: string;
  price: number;
  categoryId: string;
  sellerId: string;
  image: string;
  images?: string[];
  stock: number;
  featured: boolean;
  condition: 'nuevo' | 'usado';
  originalPrice?: number;
  brand?: string;
  subcategory?: string;
  tags?: string[];
  createdAt: string;
}

export interface ProductSpecification {
  label: string;
  value: string;
}

export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export interface ProductQuestion {
  id: string;
  author: string;
  question: string;
  answer?: string;
  answeredBy?: string;
  date: string;
  answerDate?: string;
}

export interface ProductDetails {
  specifications: ProductSpecification[];
  reviews: ProductReview[];
  longDescription?: string;
  questions?: ProductQuestion[];
  images?: string[];
}

export interface StoreConfig {
  storeName: string;
  tagline: string;
  whatsapp: string;
  email: string;
  phone: string;
  address: string;
  website: string;
}

export type ThemeAspect = 'tecnologico' | 'profesional' | 'hacker' | 'custom';

export interface ThemePaletteColors {
  primaryMain: string;
  primaryDark?: string;
  primaryLight?: string;
  secondaryMain: string;
  secondaryDark?: string;
  secondaryLight?: string;
  backgroundDefault: string;
  backgroundPaper: string;
}

export interface ThemePaletteDefinition {
  id: string;
  name: string;
  description: string;
  aspect: ThemeAspect;
  builtin: boolean;
  light: ThemePaletteColors;
  dark: ThemePaletteColors;
}

export interface ThemeSettings {
  activePaletteId: string;
  customPalettes: ThemePaletteDefinition[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: 'buyer' | 'platform_admin';
}

export type MessageStatus = 'pendiente' | 'leido' | 'respondido';
export type OrderStatus = 'pendiente' | 'confirmado' | 'enviado' | 'completado' | 'cancelado';
export type OrderType = 'compra' | 'venta';
export type SupplierStatus = 'activo' | 'inactivo';

export interface AdminMessage {
  id: string;
  from: string;
  email: string;
  subject: string;
  body: string;
  date: string;
  status: MessageStatus;
  channel: 'whatsapp' | 'email' | 'web';
}

export interface AdminOrder {
  id: string;
  type: OrderType;
  customer: string;
  productTitle: string;
  productId: string;
  quantity: number;
  amount: number;
  status: OrderStatus;
  date: string;
  supplierId?: string;
}

export interface Supplier {
  id: string;
  tenantId?: string;
  sellerId?: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  categories: string[];
  status: SupplierStatus;
  notes?: string;
}

export interface SalesStat {
  month: string;
  sales: number;
  purchases: number;
}

export interface AdminProductOverride {
  stock?: number;
  price?: number;
  originalPrice?: number | null;
  featured?: boolean;
}

export interface AdminCatalogEdit {
  title?: string;
  description?: string;
  price?: number;
  originalPrice?: number | null;
  stock?: number;
  featured?: boolean;
  categoryId?: string;
  condition?: 'nuevo' | 'usado';
  brand?: string;
  subcategory?: string;
  image?: string;
  images?: string[];
  tags?: string[];
}

export interface AdminDetailsEdit {
  longDescription?: string;
  specifications?: ProductSpecification[];
  images?: string[];
}

export interface AdminProductFormData {
  id?: string;
  title: string;
  description: string;
  longDescription: string;
  price: number;
  originalPrice: number | '';
  stock: number;
  categoryId: string;
  condition: 'nuevo' | 'usado';
  brand: string;
  subcategory: string;
  featured: boolean;
  tagsInput: string;
  image: string;
  galleryInput: string;
  specifications: ProductSpecification[];
}
