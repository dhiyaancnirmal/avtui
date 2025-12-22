// Theme registry and utilities

import type { Theme, ThemeId } from '../types/theme';
import { opencodeTheme } from './opencode';
import { lightTheme } from './light';
import { draculaTheme } from './dracula';
import { nordTheme } from './nord';
import { monokaiTheme } from './monokai';
import { gruvboxTheme } from './gruvbox';

export const themes: Record<ThemeId, Theme> = {
  opencode: opencodeTheme,
  light: lightTheme,
  dracula: draculaTheme,
  nord: nordTheme,
  monokai: monokaiTheme,
  gruvbox: gruvboxTheme,
};

export const themeList: Theme[] = Object.values(themes);

export const defaultTheme: Theme = opencodeTheme;

export function getTheme(id: ThemeId): Theme {
  return themes[id] || defaultTheme;
}

export function getThemeIds(): ThemeId[] {
  return Object.keys(themes) as ThemeId[];
}

export { opencodeTheme, lightTheme, draculaTheme, nordTheme, monokaiTheme, gruvboxTheme };
