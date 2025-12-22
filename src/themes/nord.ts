// Nord theme - arctic, north-bluish color palette

import type { Theme } from '../types/theme';

export const nordTheme: Theme = {
  name: 'Nord',
  id: 'nord',
  colors: {
    primary: '#88C0D0', // Nord8 - frost
    secondary: '#81A1C1', // Nord9
    accent: '#5E81AC', // Nord10
    background: '#2E3440', // Nord0
    surface: '#3B4252', // Nord1
    surfaceHover: '#434C5E', // Nord2
    text: '#ECEFF4', // Nord6
    textMuted: '#D8DEE9', // Nord4
    textInverse: '#2E3440',
    success: '#A3BE8C', // Nord14
    error: '#BF616A', // Nord11
    warning: '#EBCB8B', // Nord13
    info: '#88C0D0', // Nord8
    border: '#4C566A', // Nord3
    borderFocus: '#88C0D0',
    highlight: '#88C0D020',
    progressBar: '#88C0D0',
    progressTrack: '#3B4252',
    selection: '#4C566A',
    selectionText: '#ECEFF4',
  },
};
