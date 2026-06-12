import { useMemo } from 'react';
import { useTenant } from '../contexts/TenantContext';
import { DEFAULT_TENANT_SLUG, tenantPath } from '../services/tenantScope';

export function useTenantPath() {
  const { tenantSlug } = useTenant();

  return useMemo(
    () => ({
      tenantSlug,
      /** Prefija la ruta con /nombre_tienda */
      tp: (path: string) => tenantPath(tenantSlug ?? DEFAULT_TENANT_SLUG, path),
      home: tenantPath(tenantSlug ?? DEFAULT_TENANT_SLUG, '/'),
    }),
    [tenantSlug],
  );
}

export { tenantPath };
