import type { ThemePaletteColors, ThemePaletteDefinition } from '../types';

export function shadeColor(hex: string, amount: number): string {
  const normalized = hex.replace('#', '');
  const num = Number.parseInt(normalized, 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amount));
  const b = Math.min(255, Math.max(0, (num & 0x0000ff) + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

export function expandPaletteColors(colors: ThemePaletteColors): ThemePaletteColors {
  return {
    ...colors,
    primaryDark: colors.primaryDark || shadeColor(colors.primaryMain, -30),
    primaryLight: colors.primaryLight || shadeColor(colors.primaryMain, 40),
    secondaryDark: colors.secondaryDark || shadeColor(colors.secondaryMain, -25),
    secondaryLight: colors.secondaryLight || shadeColor(colors.secondaryMain, 35),
  };
}

export const BUILTIN_PALETTES: ThemePaletteDefinition[] = [
  {
    id: 'tecnologico',
    name: 'Tecnológico',
    description: 'Azul eléctrico y naranja vibrante. Ideal para tech y gaming.',
    aspect: 'tecnologico',
    builtin: true,
    light: expandPaletteColors({
      primaryMain: '#1565c0',
      primaryDark: '#0d47a1',
      primaryLight: '#42a5f5',
      secondaryMain: '#ff6f00',
      secondaryDark: '#e65100',
      secondaryLight: '#ff9800',
      backgroundDefault: '#f5f7fa',
      backgroundPaper: '#ffffff',
    }),
    dark: expandPaletteColors({
      primaryMain: '#42a5f5',
      primaryDark: '#1565c0',
      primaryLight: '#90caf9',
      secondaryMain: '#ff9800',
      secondaryDark: '#ff6f00',
      secondaryLight: '#ffb74d',
      backgroundDefault: '#121212',
      backgroundPaper: '#252525',
    }),
  },
  {
    id: 'profesional',
    name: 'Profesional',
    description: 'Navy sobrio con acentos teal. Transmite confianza corporativa.',
    aspect: 'profesional',
    builtin: true,
    light: expandPaletteColors({
      primaryMain: '#1e3a5f',
      primaryDark: '#0f2744',
      primaryLight: '#3d5a80',
      secondaryMain: '#00695c',
      secondaryDark: '#004d40',
      secondaryLight: '#00897b',
      backgroundDefault: '#f4f6f8',
      backgroundPaper: '#ffffff',
    }),
    dark: expandPaletteColors({
      primaryMain: '#7eb8da',
      primaryDark: '#1a2a3a',
      primaryLight: '#a8d0ea',
      secondaryMain: '#3eb8aa',
      secondaryDark: '#2a8f84',
      secondaryLight: '#6ecec4',
      backgroundDefault: '#0f1218',
      backgroundPaper: '#1a2030',
    }),
  },
  {
    id: 'hacker',
    name: 'Hacker',
    description: 'Verde terminal sobre fondo oscuro. Estética cyber y consola.',
    aspect: 'hacker',
    builtin: true,
    light: expandPaletteColors({
      primaryMain: '#1b5e20',
      primaryDark: '#0d3d11',
      primaryLight: '#2e7d32',
      secondaryMain: '#00c853',
      secondaryDark: '#00a040',
      secondaryLight: '#69f0ae',
      backgroundDefault: '#e8f5e9',
      backgroundPaper: '#f1f8f2',
    }),
    dark: expandPaletteColors({
      primaryMain: '#4ade80',
      primaryDark: '#0f1812',
      primaryLight: '#86efac',
      secondaryMain: '#22d3ee',
      secondaryDark: '#0891b2',
      secondaryLight: '#67e8f9',
      backgroundDefault: '#090d0b',
      backgroundPaper: '#131a15',
    }),
  },
];

export const DEFAULT_PALETTE_ID = 'tecnologico';

export function getBuiltinPalette(id: string): ThemePaletteDefinition | undefined {
  return BUILTIN_PALETTES.find((p) => p.id === id);
}

export function createEmptyCustomPalette(name: string): ThemePaletteDefinition {
  const base = getBuiltinPalette(DEFAULT_PALETTE_ID)!;
  return {
    id: `custom-${Date.now()}`,
    name,
    description: 'Tema personalizado',
    aspect: 'custom',
    builtin: false,
    light: { ...base.light },
    dark: { ...base.dark },
  };
}
