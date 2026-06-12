import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTenant } from '../contexts/TenantContext';
import { useTenantPath } from '../hooks/useTenantPath';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireSeller?: boolean;
  requireAdmin?: boolean;
  requirePlatformAdmin?: boolean;
  requireTenantAdminOnly?: boolean;
}

export default function ProtectedRoute({
  children,
  requireSeller = false,
  requireAdmin = false,
  requirePlatformAdmin = false,
  requireTenantAdminOnly = false,
}: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();
  const { tenant, isTenantAdmin, isEnabledSeller, canAccessTenantAdmin } = useTenant();
  const { tp, home } = useTenantPath();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={tp('/login')} state={{ from: location.pathname }} replace />;
  }

  if (requirePlatformAdmin && user?.role !== 'platform_admin') {
    return <Navigate to={home} replace />;
  }

  if (requireAdmin || requireTenantAdminOnly || requireSeller) {
    if (user?.role === 'platform_admin') {
      return <>{children}</>;
    }

    if (!tenant) {
      return <Navigate to="/platform" replace />;
    }

    if (requireTenantAdminOnly && !isTenantAdmin) {
      return <Navigate to={home} replace />;
    }

    if (requireAdmin && !canAccessTenantAdmin) {
      return <Navigate to={home} replace />;
    }

    if (requireSeller && !isEnabledSeller) {
      return <Navigate to={home} replace />;
    }
  }

  return <>{children}</>;
}
