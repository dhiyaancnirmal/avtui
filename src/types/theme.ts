// Theme type definitions for avtui

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  surfaceHover: string;
  text: string;
  textMuted: string;
  textInverse: string;
  success: string;
  error: string;
  warning: string;
  info: string;
  border: string;
  borderFocus: string;
  highlight: string;
  progressBar: string;
  progressTrack: string;
  selection: string;
  selectionText: string;
}

export interface Theme {
  name: string;
  id: string;
  colors: ThemeColors;
}

export type ThemeId = 'opencode' | 'light' | 'dracula' | 'nord' | 'monokai' | 'gruvbox';
