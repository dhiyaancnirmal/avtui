// Theme context and hook

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Theme, ThemeId } from '../types/theme';
import { themes, defaultTheme, getTheme } from '../themes';

interface ThemeContextValue {
  theme: Theme;
  themeId: ThemeId;
  setTheme: (id: ThemeId) => void;
  availableThemes: Theme[];
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps {
  children: ReactNode;
  initialTheme?: ThemeId;
}

export function ThemeProvider({ children, initialTheme = 'ayudark' }: ThemeProviderProps) {
  const [themeId, setThemeId] = useState<ThemeId>(initialTheme);
  const theme = getTheme(themeId);

  const setTheme = useCallback((id: ThemeId) => {
    setThemeId(id);
  }, []);

  const value: ThemeContextValue = {
    theme,
    themeId,
    setTheme,
    availableThemes: Object.values(themes),
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    // Return default theme if used outside provider
    return {
      theme: defaultTheme,
      themeId: 'ayudark',
      setTheme: () => {},
      availableThemes: Object.values(themes),
    };
  }
  return context;
}
