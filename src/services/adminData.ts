import adminMessagesData from '../data/adminMessages.json';
import adminOrdersData from '../data/adminOrders.json';
import adminSalesStatsData from '../data/adminSalesStats.json';
import adminSuppliersData from '../data/adminSuppliers.json';
import type {
  AdminCatalogEdit,
  AdminDetailsEdit,
  AdminMessage,
  AdminOrder,
  AdminProductFormData,
  AdminProductOverride,
  MessageStatus,
  OrderStatus,
  Product,
  ProductDetails,
  SalesStat,
  Supplier,
  SupplierStatus,
} from '../types';
import { getActiveTenantId, getTenantStorageKey } from './tenantScope';

const MESSAGES_SUFFIX = 'admin_messages';
const ORDERS_SUFFIX = 'admin_orders';
const SUPPLIERS_SUFFIX = 'admin_suppliers';
const OVERRIDES_SUFFIX = 'admin_product_overrides';
const CREATED_PRODUCTS_SUFFIX = 'admin_created_products';
const CATALOG_EDITS_SUFFIX = 'admin_catalog_edits';
const DETAILS_EDITS_SUFFIX = 'admin_details_edits';

function loadJson<T>(suffix: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(getTenantStorageKey(suffix));
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function saveJson<T>(suffix: string, data: T): void {
  localStorage.setItem(getTenantStorageKey(suffix), JSON.stringify(data));
}

export function getProductOverrides(): Record<string, AdminProductOverride> {
  return loadJson(OVERRIDES_SUFFIX, {});
}

export function getAdminCreatedProducts(): Product[] {
  return loadJson(CREATED_PRODUCTS_SUFFIX, []);
}

export function saveAdminCreatedProduct(product: Product): void {
  const products = getAdminCreatedProducts();
  const index = products.findIndex((p) => p.id === product.id);
  if (index >= 0) products[index] = product;
  else products.push(product);
  saveJson(CREATED_PRODUCTS_SUFFIX, products);
}

export function deleteAdminCreatedProduct(id: string): void {
  saveJson(
    CREATED_PRODUCTS_SUFFIX,
    getAdminCreatedProducts().filter((p) => p.id !== id),
  );
}

export function isAdminCreatedProduct(id: string): boolean {
  return getAdminCreatedProducts().some((p) => p.id === id);
}

export function getAdminCatalogEdits(): Record<string, AdminCatalogEdit> {
  const legacy = getProductOverrides() as Record<string, AdminCatalogEdit>;
  const edits = loadJson<Record<string, AdminCatalogEdit>>(CATALOG_EDITS_SUFFIX, {});
  return { ...legacy, ...edits };
}

export function saveAdminCatalogEdit(productId: string, data: AdminCatalogEdit): void {
  const edits = loadJson<Record<string, AdminCatalogEdit>>(CATALOG_EDITS_SUFFIX, {});
  edits[productId] = { ...edits[productId], ...data };
  if (data.originalPrice === null) {
    edits[productId].originalPrice = null;
  }
  saveJson(CATALOG_EDITS_SUFFIX, edits);

  const legacy: AdminProductOverride = {};
  if (data.stock !== undefined) legacy.stock = data.stock;
  if (data.price !== undefined) legacy.price = data.price;
  if (data.originalPrice !== undefined) legacy.originalPrice = data.originalPrice;
  if (data.featured !== undefined) legacy.featured = data.featured;
  if (Object.keys(legacy).length > 0) {
    updateProductOverride(productId, legacy);
  }
}

export function getAdminDetailsEdits(): Record<string, AdminDetailsEdit> {
  return loadJson(DETAILS_EDITS_SUFFIX, {});
}

export function saveAdminDetailsEdit(productId: string, data: AdminDetailsEdit): void {
  const edits = loadJson<Record<string, AdminDetailsEdit>>(DETAILS_EDITS_SUFFIX, {});
  edits[productId] = { ...edits[productId], ...data };
  saveJson(DETAILS_EDITS_SUFFIX, edits);
}

function applyCatalogEdit(product: Product, edit: AdminCatalogEdit): Product {
  const { originalPrice, images, tags, ...rest } = edit;
  const updated: Product = { ...product, ...rest };

  if (images !== undefined) updated.images = images;
  if (tags !== undefined) updated.tags = tags;
  if (edit.image !== undefined) updated.image = edit.image;

  if (originalPrice === null) {
    delete updated.originalPrice;
  } else if (originalPrice !== undefined) {
    updated.originalPrice = originalPrice;
  }

  return updated;
}

export function applyProductOverrides(products: Product[]): Product[] {
  const catalogEdits = getAdminCatalogEdits();
  return products.map((product) => {
    const edit = catalogEdits[product.id];
    return edit ? applyCatalogEdit(product, edit) : product;
  });
}

export function createAdminProductId(): string {
  return `prod-admin-${Date.now()}`;
}

export function parseTagsInput(input: string): string[] {
  return input
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function tagsToInput(tags?: string[]): string {
  return tags?.join(', ') ?? '';
}

export function parseGalleryInput(input: string): string[] {
  return input
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

export function galleryToInput(images?: string[]): string {
  return images?.join('\n') ?? '';
}

export function buildAdminProductFormData(
  product: Product,
  details: ProductDetails,
): AdminProductFormData {
  const gallery =
    details.images?.length ? details.images : product.images?.length ? product.images : product.image ? [product.image] : [];

  return {
    id: product.id,
    title: product.title,
    description: product.description,
    longDescription: details.longDescription ?? product.description,
    price: product.price,
    originalPrice: product.originalPrice ?? '',
    stock: product.stock,
    categoryId: product.categoryId,
    condition: product.condition,
    brand: product.brand ?? '',
    subcategory: product.subcategory ?? '',
    featured: product.featured,
    tagsInput: tagsToInput(product.tags),
    image: product.image,
    galleryInput: galleryToInput(gallery),
    specifications: details.specifications.length
      ? details.specifications
      : [{ label: '', value: '' }],
  };
}

export function emptyAdminProductFormData(): AdminProductFormData {
  return {
    title: '',
    description: '',
    longDescription: '',
    price: 0,
    originalPrice: '',
    stock: 1,
    categoryId: '',
    condition: 'nuevo',
    brand: '',
    subcategory: '',
    featured: false,
    tagsInput: '',
    image: '',
    galleryInput: '',
    specifications: [{ label: '', value: '' }],
  };
}

export function saveAdminProductForm(
  form: AdminProductFormData,
  sellerId: string,
  isNew: boolean,
): Product {
  const tags = parseTagsInput(form.tagsInput);
  const gallery = parseGalleryInput(form.galleryInput);
  const mainImage = form.image.trim() || gallery[0] || '';
  const specifications = form.specifications.filter((s) => s.label.trim() && s.value.trim());

  const productBase = {
    tenantId: getActiveTenantId(),
    title: form.title.trim(),
    description: form.description.trim(),
    price: form.price,
    categoryId: form.categoryId,
    sellerId,
    image: mainImage,
    images: gallery.length ? gallery : mainImage ? [mainImage] : [],
    stock: form.stock,
    featured: form.featured,
    condition: form.condition,
    brand: form.brand.trim() || undefined,
    subcategory: form.subcategory.trim() || undefined,
    tags: tags.length ? tags : undefined,
    originalPrice:
      form.originalPrice !== '' && Number(form.originalPrice) > form.price
        ? Number(form.originalPrice)
        : undefined,
  };

  let product: Product;

  if (isNew) {
    product = {
      ...productBase,
      id: createAdminProductId(),
      createdAt: new Date().toISOString(),
    };
    saveAdminCreatedProduct(product);
  } else if (form.id && isAdminCreatedProduct(form.id)) {
    const existing = getAdminCreatedProducts().find((p) => p.id === form.id);
    product = {
      ...productBase,
      id: form.id,
      createdAt: existing?.createdAt ?? new Date().toISOString(),
    };
    saveAdminCreatedProduct(product);
  } else if (form.id) {
    saveAdminCatalogEdit(form.id, {
      title: productBase.title,
      description: productBase.description,
      price: productBase.price,
      originalPrice: productBase.originalPrice ?? null,
      stock: productBase.stock,
      featured: productBase.featured,
      categoryId: productBase.categoryId,
      condition: productBase.condition,
      brand: productBase.brand,
      subcategory: productBase.subcategory,
      image: productBase.image,
      images: productBase.images,
      tags: productBase.tags,
    });
    product = { ...productBase, id: form.id, createdAt: '' } as Product;
  } else {
    throw new Error('Producto inválido');
  }

  if (form.id || product.id) {
    const productId = form.id ?? product.id;
    saveAdminDetailsEdit(productId, {
      longDescription: form.longDescription.trim(),
      specifications,
      images: gallery.length ? gallery : undefined,
    });
  }

  return product;
}

export function updateProductOverride(
  productId: string,
  data: AdminProductOverride,
): void {
  const overrides = getProductOverrides();
  const current = overrides[productId] ?? {};
  const merged = { ...current, ...data };

  if (data.originalPrice === null) {
    merged.originalPrice = null;
  }

  overrides[productId] = merged;
  saveJson(OVERRIDES_SUFFIX, overrides);
}

export function getAdminMessages(): AdminMessage[] {
  return loadJson(MESSAGES_SUFFIX, adminMessagesData as AdminMessage[]);
}

export function updateMessageStatus(id: string, status: MessageStatus): void {
  const messages = getAdminMessages();
  const index = messages.findIndex((m) => m.id === id);
  if (index === -1) return;
  messages[index] = { ...messages[index], status };
  saveJson(MESSAGES_SUFFIX, messages);
}

export function getAdminOrders(): AdminOrder[] {
  return loadJson(ORDERS_SUFFIX, adminOrdersData as AdminOrder[]);
}

export function updateOrderStatus(id: string, status: OrderStatus): void {
  const orders = getAdminOrders();
  const index = orders.findIndex((o) => o.id === id);
  if (index === -1) return;
  orders[index] = { ...orders[index], status };
  saveJson(ORDERS_SUFFIX, orders);
}

export function getAdminSuppliers(sellerId?: string): Supplier[] {
  const suppliers = loadJson(SUPPLIERS_SUFFIX, adminSuppliersData as Supplier[]).map((s) => ({
    ...s,
    tenantId: s.tenantId ?? getActiveTenantId(),
  }));
  if (!sellerId) return suppliers;
  return suppliers.filter((s) => !s.sellerId || s.sellerId === sellerId);
}

export function saveSupplier(supplier: Supplier): void {
  const suppliers = getAdminSuppliers();
  const index = suppliers.findIndex((s) => s.id === supplier.id);
  if (index >= 0) {
    suppliers[index] = supplier;
  } else {
    suppliers.push(supplier);
  }
  saveJson(SUPPLIERS_SUFFIX, suppliers);
}

export function deleteSupplier(id: string): void {
  const suppliers = getAdminSuppliers().filter((s) => s.id !== id);
  saveJson(SUPPLIERS_SUFFIX, suppliers);
}

export function getSalesStats(): SalesStat[] {
  return adminSalesStatsData as SalesStat[];
}

export function getAdminDashboardStats(products: Product[]) {
  const orders = getAdminOrders();
  const messages = getAdminMessages();
  const suppliers = getAdminSuppliers();
  const salesStats = getSalesStats();

  const currentMonthSales = salesStats[salesStats.length - 1]?.sales ?? 0;
  const lowStock = products.filter((p) => p.stock <= 3).length;
  const pendingMessages = messages.filter((m) => m.status === 'pendiente').length;
  const activeSuppliers = suppliers.filter((s) => s.status === 'activo').length;
  const totalSales = orders
    .filter((o) => o.type === 'venta' && o.status !== 'cancelado')
    .reduce((sum, o) => sum + o.amount, 0);
  const totalPurchases = orders
    .filter((o) => o.type === 'compra' && o.status !== 'cancelado')
    .reduce((sum, o) => sum + o.amount, 0);

  return {
    currentMonthSales,
    lowStock,
    pendingMessages,
    activeSuppliers,
    totalSales,
    totalPurchases,
    recentOrders: [...orders]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5),
  };
}

export function formatAdminDate(date: string): string {
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export function createSupplierId(): string {
  return `sup-${Date.now()}`;
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pendiente: 'Pendiente',
  confirmado: 'Confirmado',
  enviado: 'Enviado',
  completado: 'Completado',
  cancelado: 'Cancelado',
};

export const MESSAGE_STATUS_LABELS: Record<MessageStatus, string> = {
  pendiente: 'Pendiente',
  leido: 'Leído',
  respondido: 'Respondido',
};

export function getSupplierStatusLabel(status: SupplierStatus): string {
  return status === 'activo' ? 'Activo' : 'Inactivo';
}
