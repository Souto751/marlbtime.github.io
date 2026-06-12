import { createTheme } from '@mui/material/styles';
import { expandPaletteColors } from './palettes';
import type { ThemePaletteColors } from '../types';

export function createAppTheme(mode: 'light' | 'dark', paletteColors: ThemePaletteColors) {
  const colors = expandPaletteColors(paletteColors);

  return createTheme({
    palette: {
      mode,
      primary: {
        main: colors.primaryMain,
        dark: colors.primaryDark,
        light: colors.primaryLight,
      },
      secondary: {
        main: colors.secondaryMain,
        dark: colors.secondaryDark,
        light: colors.secondaryLight,
      },
      background: {
        default: colors.backgroundDefault,
        paper: colors.backgroundPaper,
      },
      divider: mode === 'light' ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.12)',
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h4: { fontWeight: 700 },
      h5: { fontWeight: 600 },
      h6: { fontWeight: 600 },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow:
              mode === 'light' ? '0 2px 8px rgba(0,0,0,0.08)' : '0 2px 8px rgba(0,0,0,0.4)',
          },
        },
      },
    },
  });
}

export { BUILTIN_PALETTES, DEFAULT_PALETTE_ID, getBuiltinPalette } from './palettes';
