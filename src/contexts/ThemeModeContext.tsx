import { CssBaseline, ThemeProvider } from '@mui/material';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { createAppTheme } from '../theme';
import {
  deleteCustomPalette,
  getActivePalette,
  getAllPalettes,
  getThemeSettings,
  resolvePalette,
  saveCustomPalette,
  setActivePalette,
} from '../services/themeSettings';
import type { ThemePaletteDefinition } from '../types';

const THEME_MODE_KEY = 'marlbtime_theme_mode';

type ThemeMode = 'light' | 'dark';

interface ThemeModeContextValue {
  mode: ThemeMode;
  toggleMode: () => void;
  paletteId: string;
  activePalette: ThemePaletteDefinition;
  palettes: ThemePaletteDefinition[];
  customPalettes: ThemePaletteDefinition[];
  setPalette: (id: string) => void;
  saveCustomPalette: (palette: ThemePaletteDefinition) => void;
  removeCustomPalette: (id: string) => void;
}

const ThemeModeContext = createContext<ThemeModeContextValue | null>(null);

function loadMode(): ThemeMode {
  try {
    const stored = localStorage.getItem(THEME_MODE_KEY);
    return stored === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

function loadInitialState() {
  const settings = getThemeSettings();
  return {
    mode: loadMode(),
    paletteId: settings.activePaletteId,
    palettes: getAllPalettes(),
    activePalette: getActivePalette(),
  };
}

export function ThemeModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(() => loadInitialState().mode);
  const [paletteId, setPaletteId] = useState(() => loadInitialState().paletteId);
  const [palettes, setPalettes] = useState(() => loadInitialState().palettes);

  const activePalette = useMemo(() => resolvePalette(paletteId), [paletteId]);

  const customPalettes = useMemo(
    () => palettes.filter((p) => !p.builtin),
    [palettes],
  );

  const toggleMode = useCallback(() => {
    setMode((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem(THEME_MODE_KEY, next);
      return next;
    });
  }, []);

  const applyPalette = useCallback((id: string) => {
    const next = setActivePalette(id);
    setPaletteId(next.activePaletteId);
  }, []);

  const persistCustomPalette = useCallback((palette: ThemePaletteDefinition) => {
    const next = saveCustomPalette(palette);
    setPalettes(getAllPalettes());
    setPaletteId(next.activePaletteId);
  }, []);

  const removeCustomPalette = useCallback((id: string) => {
    const next = deleteCustomPalette(id);
    setPalettes(getAllPalettes());
    setPaletteId(next.activePaletteId);
  }, []);

  const theme = useMemo(
    () => createAppTheme(mode, mode === 'light' ? activePalette.light : activePalette.dark),
    [mode, activePalette],
  );

  const value = useMemo(
    () => ({
      mode,
      toggleMode,
      paletteId,
      activePalette,
      palettes,
      customPalettes,
      setPalette: applyPalette,
      saveCustomPalette: persistCustomPalette,
      removeCustomPalette,
    }),
    [
      mode,
      toggleMode,
      paletteId,
      activePalette,
      palettes,
      customPalettes,
      applyPalette,
      persistCustomPalette,
      removeCustomPalette,
    ],
  );

  return (
    <ThemeModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}

export function useThemeMode() {
  const context = useContext(ThemeModeContext);
  if (!context) throw new Error('useThemeMode debe usarse dentro de ThemeModeProvider');
  return context;
}
