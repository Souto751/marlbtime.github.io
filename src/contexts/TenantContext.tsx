import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from 'react';
import { useLocation } from 'react-router-dom';
import {
  getTenantBySlug,
  getUserTenantRole,
  isEnabledSeller,
  isTenantAdmin,
  tenantToStoreConfig,
} from '../services/tenantData';
import {
  buildTenantUrl,
  isPlatformPath,
  resolveTenantSlugFromPath,
  setActiveTenantId,
} from '../services/tenantScope';
import type { StoreConfig, Tenant, TenantRole } from '../types';

interface TenantContextValue {
  tenant: Tenant | null;
  storeConfig: StoreConfig;
  isPlatform: boolean;
  tenantSlug: string | null;
  tenantRole: TenantRole | null;
  isTenantAdmin: boolean;
  isEnabledSeller: boolean;
  canAccessTenantAdmin: boolean;
  resolveTenantUrl: (subdomain: string, path?: string) => string;
}

const TenantContext = createContext<TenantContextValue | null>(null);

const FALLBACK_STORE: StoreConfig = {
  storeName: 'Marlbtime Platform',
  tagline: 'Plataforma multi-tienda',
  whatsapp: '5491123456789',
  email: 'contacto@marlbtime.com',
  phone: '(011) 1234-5678',
  address: 'Argentina',
  website: 'marlbtime.com',
};

export function TenantProvider({
  children,
  userId,
}: {
  children: ReactNode;
  userId?: string | null;
}) {
  const location = useLocation();
  const slug = useMemo(
    () => resolveTenantSlugFromPath(location.pathname),
    [location.pathname],
  );
  const isPlatform = isPlatformPath(location.pathname);
  const tenant = useMemo(() => (slug ? getTenantBySlug(slug) ?? null : null), [slug]);

  useEffect(() => {
    if (tenant) setActiveTenantId(tenant.id);
  }, [tenant]);

  const storeConfig = useMemo(
    () => (tenant ? tenantToStoreConfig(tenant) : FALLBACK_STORE),
    [tenant],
  );

  const tenantRole = useMemo(() => {
    if (!userId || !tenant) return null;
    return getUserTenantRole(userId, tenant.id);
  }, [userId, tenant]);

  const tenantAdmin = useMemo(() => {
    if (!userId || !tenant) return false;
    return isTenantAdmin(userId, tenant.id);
  }, [userId, tenant]);

  const enabledSeller = useMemo(() => {
    if (!userId || !tenant) return false;
    return isEnabledSeller(userId, tenant.id);
  }, [userId, tenant]);

  const value = useMemo(
    () => ({
      tenant,
      storeConfig,
      isPlatform,
      tenantSlug: slug,
      tenantRole,
      isTenantAdmin: tenantAdmin,
      isEnabledSeller: enabledSeller,
      canAccessTenantAdmin: tenantAdmin || enabledSeller,
      resolveTenantUrl: buildTenantUrl,
    }),
    [tenant, storeConfig, isPlatform, slug, tenantRole, tenantAdmin, enabledSeller],
  );

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (!context) throw new Error('useTenant debe usarse dentro de TenantProvider');
  return context;
}
