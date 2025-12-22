// OpenCode theme - the default dark theme matching OpenCode's aesthetic

import type { Theme } from '../types/theme';

export const opencodeTheme: Theme = {
  name: 'OpenCode',
  id: 'opencode',
  colors: {
    primary: '#7C3AED', // Vibrant purple
    secondary: '#4F46E5', // Indigo
    accent: '#06B6D4', // Cyan
    background: '#0A0A0A', // Near black
    surface: '#141414', // Dark gray
    surfaceHover: '#1F1F1F', // Lighter dark gray
    text: '#FAFAFA', // Almost white
    textMuted: '#71717A', // Muted gray
    textInverse: '#0A0A0A', // For light backgrounds
    success: '#22C55E', // Green
    error: '#EF4444', // Red
    warning: '#F59E0B', // Amber
    info: '#3B82F6', // Blue
    border: '#27272A', // Dark border
    borderFocus: '#7C3AED', // Purple border on focus
    highlight: '#7C3AED20', // Purple with transparency
    progressBar: '#7C3AED', // Purple progress
    progressTrack: '#27272A', // Dark track
    selection: '#7C3AED', // Purple selection
    selectionText: '#FAFAFA', // White text on selection
  },
};
