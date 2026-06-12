import type { ThemePaletteDefinition, ThemeSettings } from '../types';
import { BUILTIN_PALETTES, DEFAULT_PALETTE_ID, getBuiltinPalette } from '../theme/palettes';
import { getTenantStorageKey } from './tenantScope';

const THEME_SETTINGS_SUFFIX = 'theme_settings';

function loadSettings(): ThemeSettings {
  try {
    const stored = localStorage.getItem(getTenantStorageKey(THEME_SETTINGS_SUFFIX));
    if (stored) {
      const parsed = JSON.parse(stored) as ThemeSettings;
      return {
        activePaletteId: parsed.activePaletteId || DEFAULT_PALETTE_ID,
        customPalettes: parsed.customPalettes ?? [],
      };
    }
  } catch {
    /* use defaults */
  }
  return { activePaletteId: DEFAULT_PALETTE_ID, customPalettes: [] };
}

function saveSettings(settings: ThemeSettings): void {
  localStorage.setItem(getTenantStorageKey(THEME_SETTINGS_SUFFIX), JSON.stringify(settings));
}

export function getThemeSettings(): ThemeSettings {
  return loadSettings();
}

export function getCustomPalettes(): ThemePaletteDefinition[] {
  return loadSettings().customPalettes;
}

export function resolvePalette(id: string): ThemePaletteDefinition {
  const builtin = getBuiltinPalette(id);
  if (builtin) return builtin;

  const custom = loadSettings().customPalettes.find((p) => p.id === id);
  if (custom) return custom;

  return getBuiltinPalette(DEFAULT_PALETTE_ID)!;
}

export function getActivePalette(): ThemePaletteDefinition {
  const { activePaletteId } = loadSettings();
  return resolvePalette(activePaletteId);
}

export function setActivePalette(id: string): ThemeSettings {
  const settings = loadSettings();
  const next = { ...settings, activePaletteId: id };
  saveSettings(next);
  return next;
}

export function saveCustomPalette(palette: ThemePaletteDefinition): ThemeSettings {
  const settings = loadSettings();
  const index = settings.customPalettes.findIndex((p) => p.id === palette.id);
  const customPalettes = [...settings.customPalettes];
  if (index >= 0) customPalettes[index] = palette;
  else customPalettes.push(palette);

  const next = { ...settings, customPalettes };
  saveSettings(next);
  return next;
}

export function deleteCustomPalette(id: string): ThemeSettings {
  const settings = loadSettings();
  const customPalettes = settings.customPalettes.filter((p) => p.id !== id);
  const activePaletteId =
    settings.activePaletteId === id ? DEFAULT_PALETTE_ID : settings.activePaletteId;
  const next = { activePaletteId, customPalettes };
  saveSettings(next);
  return next;
}

export function getAllPalettes(): ThemePaletteDefinition[] {
  const { customPalettes } = loadSettings();
  return [...BUILTIN_PALETTES, ...customPalettes];
}
