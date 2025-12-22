// Light theme for users who prefer light mode

import type { Theme } from '../types/theme';

export const lightTheme: Theme = {
  name: 'Light',
  id: 'light',
  colors: {
    primary: '#7C3AED',
    secondary: '#4F46E5',
    accent: '#0891B2',
    background: '#FAFAFA',
    surface: '#FFFFFF',
    surfaceHover: '#F4F4F5',
    text: '#18181B',
    textMuted: '#71717A',
    textInverse: '#FAFAFA',
    success: '#16A34A',
    error: '#DC2626',
    warning: '#D97706',
    info: '#2563EB',
    border: '#E4E4E7',
    borderFocus: '#7C3AED',
    highlight: '#7C3AED20',
    progressBar: '#7C3AED',
    progressTrack: '#E4E4E7',
    selection: '#7C3AED',
    selectionText: '#FAFAFA',
  },
};
