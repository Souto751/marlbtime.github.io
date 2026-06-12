export const DEFAULT_TENANT_SLUG = 'shop';

const RESERVED_PATH_SEGMENTS = new Set(['platform']);

let activeTenantId = 'tenant-shop';

export function setActiveTenantId(tenantId: string): void {
  activeTenantId = tenantId;
}

export function getActiveTenantId(): string {
  return activeTenantId;
}

export function getTenantStorageKey(suffix: string): string {
  return `marlbtime:${activeTenantId}:${suffix}`;
}

export function getPlatformStorageKey(suffix: string): string {
  return `marlbtime:platform:${suffix}`;
}

/** Extrae el slug de tienda del pathname: /shop/productos → shop */
export function resolveTenantSlugFromPath(pathname: string): string | null {
  const [first] = pathname.split('/').filter(Boolean);
  if (!first || RESERVED_PATH_SEGMENTS.has(first)) return null;
  return first;
}

/** @deprecated Usar resolveTenantSlugFromPath con useLocation */
export function resolveTenantSlugFromHost(): string | null {
  if (typeof window === 'undefined') return DEFAULT_TENANT_SLUG;
  return resolveTenantSlugFromPath(window.location.pathname);
}

export function isPlatformPath(pathname: string): boolean {
  const normalized = pathname.replace(/\/+$/, '') || '/';
  return normalized === '/platform' || normalized.startsWith('/platform/');
}

export function isPlatformHost(): boolean {
  if (typeof window === 'undefined') return false;
  return isPlatformPath(window.location.pathname);
}

/** Ruta interna para React Router (sin basename). Ej: tp('shop', '/productos') → /shop/productos */
export function tenantPath(tenantSlug: string | null | undefined, path: string): string {
  const [pathnamePart, ...searchParts] = path.split('?');
  const search = searchParts.length ? `?${searchParts.join('?')}` : '';
  const normalized = pathnamePart.startsWith('/') ? pathnamePart : `/${pathnamePart}`;

  if (!tenantSlug) {
    return `${normalized}${search}`;
  }

  if (normalized === '/') {
    return `/${tenantSlug}${search}`;
  }

  if (normalized === `/${tenantSlug}` || normalized.startsWith(`/${tenantSlug}/`)) {
    return `${normalized}${search}`;
  }

  return `/${tenantSlug}${normalized}${search}`;
}

/** URL completa para navegar entre tiendas (incluye basename de Vite). */
export function buildTenantUrl(subdomain: string, path = '/'): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const internal = tenantPath(subdomain, path);
  return `${base}${internal}`;
}

export const PLATFORM_DOMAIN = 'marlbtime.com';
