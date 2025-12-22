// Dracula theme - popular dark theme

import type { Theme } from '../types/theme';

export const draculaTheme: Theme = {
  name: 'Dracula',
  id: 'dracula',
  colors: {
    primary: '#BD93F9', // Purple
    secondary: '#FF79C6', // Pink
    accent: '#8BE9FD', // Cyan
    background: '#282A36', // Background
    surface: '#44475A', // Current line
    surfaceHover: '#6272A4', // Comment
    text: '#F8F8F2', // Foreground
    textMuted: '#6272A4', // Comment
    textInverse: '#282A36',
    success: '#50FA7B', // Green
    error: '#FF5555', // Red
    warning: '#FFB86C', // Orange
    info: '#8BE9FD', // Cyan
    border: '#44475A',
    borderFocus: '#BD93F9',
    highlight: '#BD93F920',
    progressBar: '#BD93F9',
    progressTrack: '#44475A',
    selection: '#44475A',
    selectionText: '#F8F8F2',
  },
};
