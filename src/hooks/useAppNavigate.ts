import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

function canGoBackInHistory(): boolean {
  const idx = window.history.state?.idx;
  return typeof idx === 'number' && idx > 0;
}

export function useAppNavigate() {
  const navigate = useNavigate();

  const goBack = useCallback(
    (fallback = '/') => {
      if (canGoBackInHistory()) {
        navigate(-1);
      } else {
        navigate(fallback);
      }
    },
    [navigate],
  );

  return { navigate, goBack, canGoBack: canGoBackInHistory };
}
