import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTenantPath } from './useTenantPath';

function canGoBackInHistory(): boolean {
  const idx = window.history.state?.idx;
  return typeof idx === 'number' && idx > 0;
}

export function useAppNavigate() {
  const navigate = useNavigate();
  const { home } = useTenantPath();

  const goBack = useCallback(
    (fallback = home) => {
      if (canGoBackInHistory()) {
        navigate(-1);
      } else {
        navigate(fallback);
      }
    },
    [navigate, home],
  );

  return { navigate, goBack, canGoBack: canGoBackInHistory };
}
