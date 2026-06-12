import tenantsData from '../data/tenants.json';
import membershipsData from '../data/tenantMemberships.json';
import type { StoreConfig, Tenant, TenantMembership, TenantRole, User } from '../types';
import { getPlatformStorageKey, getTenantStorageKey } from './tenantScope';

const MEMBERSHIPS_KEY = 'memberships';
const TENANTS_KEY = 'tenants';

function loadPlatformJson<T>(suffix: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(getPlatformStorageKey(suffix));
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function savePlatformJson<T>(suffix: string, data: T): void {
  localStorage.setItem(getPlatformStorageKey(suffix), JSON.stringify(data));
}

export const seedTenants: Tenant[] = tenantsData as Tenant[];
export const seedMemberships: TenantMembership[] = membershipsData as TenantMembership[];

export function getAllTenants(): Tenant[] {
  const custom = loadPlatformJson<Tenant[]>(TENANTS_KEY, []);
  const byId = new Map<string, Tenant>();
  for (const t of [...seedTenants, ...custom]) byId.set(t.id, t);
  return [...byId.values()];
}

export function getTenantBySlug(slug: string): Tenant | undefined {
  return getAllTenants().find((t) => t.subdomain === slug);
}

export function getTenantById(id: string): Tenant | undefined {
  return getAllTenants().find((t) => t.id === id);
}

export function saveTenant(tenant: Tenant): void {
  const custom = loadPlatformJson<Tenant[]>(TENANTS_KEY, []);
  const index = custom.findIndex((t) => t.id === tenant.id);
  if (index >= 0) custom[index] = tenant;
  else custom.push(tenant);
  savePlatformJson(TENANTS_KEY, custom);
}

export function createTenant(data: Omit<Tenant, 'id'>): Tenant {
  const tenant: Tenant = { ...data, id: `tenant-${Date.now()}` };
  saveTenant(tenant);
  return tenant;
}

export function getAllMemberships(): TenantMembership[] {
  const custom = loadPlatformJson<TenantMembership[]>(MEMBERSHIPS_KEY, []);
  const key = (m: TenantMembership) => `${m.userId}:${m.tenantId}:${m.role}`;
  const map = new Map<string, TenantMembership>();
  for (const m of [...seedMemberships, ...custom]) map.set(key(m), m);
  return [...map.values()];
}

export function getMembershipsForTenant(tenantId: string): TenantMembership[] {
  return getAllMemberships().filter((m) => m.tenantId === tenantId);
}

export function getMembershipsForUser(userId: string): TenantMembership[] {
  return getAllMemberships().filter((m) => m.userId === userId);
}

export function getUserTenantRole(userId: string, tenantId: string): TenantRole | null {
  const memberships = getMembershipsForUser(userId).filter((m) => m.tenantId === tenantId && m.enabled);
  if (memberships.some((m) => m.role === 'tenant_admin')) return 'tenant_admin';
  if (memberships.some((m) => m.role === 'seller')) return 'seller';
  return null;
}

export function isTenantAdmin(userId: string, tenantId: string): boolean {
  return getUserTenantRole(userId, tenantId) === 'tenant_admin';
}

export function isEnabledSeller(userId: string, tenantId: string): boolean {
  const role = getUserTenantRole(userId, tenantId);
  return role === 'seller' || role === 'tenant_admin';
}

export function saveMembership(membership: TenantMembership): void {
  const custom = loadPlatformJson<TenantMembership[]>(MEMBERSHIPS_KEY, []);
  const index = custom.findIndex(
    (m) => m.userId === membership.userId && m.tenantId === membership.tenantId && m.role === membership.role,
  );
  if (index >= 0) custom[index] = membership;
  else custom.push(membership);
  savePlatformJson(MEMBERSHIPS_KEY, custom);
}

export function setSellerEnabled(
  userId: string,
  tenantId: string,
  enabled: boolean,
  createdBy?: string,
): void {
  saveMembership({
    userId,
    tenantId,
    role: 'seller',
    enabled,
    createdAt: new Date().toISOString(),
    createdBy,
  });
}

export function tenantToStoreConfig(tenant: Tenant): StoreConfig {
  return {
    storeName: tenant.storeName,
    tagline: tenant.tagline,
    whatsapp: tenant.whatsapp,
    email: tenant.email,
    phone: tenant.phone,
    address: tenant.address,
    website: tenant.website,
  };
}

export function findUserByEmail(users: User[], email: string): User | undefined {
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

/** Registro de actividad por tenant (opcional, demo). */
export function getTenantActivityKey(): string {
  return getTenantStorageKey('activity');
}
