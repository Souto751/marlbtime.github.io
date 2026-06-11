import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

interface NavigationDrawerContextValue {
  isOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const NavigationDrawerContext = createContext<NavigationDrawerContextValue | null>(null);

export function NavigationDrawerProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openDrawer = useCallback(() => setIsOpen(true), []);
  const closeDrawer = useCallback(() => setIsOpen(false), []);

  const value = useMemo(
    () => ({ isOpen, openDrawer, closeDrawer }),
    [isOpen, openDrawer, closeDrawer],
  );

  return (
    <NavigationDrawerContext.Provider value={value}>{children}</NavigationDrawerContext.Provider>
  );
}

export function useNavigationDrawer() {
  const context = useContext(NavigationDrawerContext);
  if (!context) {
    throw new Error('useNavigationDrawer debe usarse dentro de NavigationDrawerProvider');
  }
  return context;
}
