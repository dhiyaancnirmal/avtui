// Monokai theme - classic code editor theme

import type { Theme } from '../types/theme';

export const monokaiTheme: Theme = {
  name: 'Monokai',
  id: 'monokai',
  colors: {
    primary: '#F92672', // Pink/Red
    secondary: '#AE81FF', // Purple
    accent: '#66D9EF', // Cyan
    background: '#272822', // Background
    surface: '#3E3D32', // Selection
    surfaceHover: '#49483E',
    text: '#F8F8F2', // Foreground
    textMuted: '#75715E', // Comment
    textInverse: '#272822',
    success: '#A6E22E', // Green
    error: '#F92672', // Pink/Red
    warning: '#E6DB74', // Yellow
    info: '#66D9EF', // Cyan
    border: '#3E3D32',
    borderFocus: '#F92672',
    highlight: '#F9267220',
    progressBar: '#A6E22E',
    progressTrack: '#3E3D32',
    selection: '#49483E',
    selectionText: '#F8F8F2',
  },
};
