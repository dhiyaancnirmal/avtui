// Theme selector modal component

import { useState } from 'react';
import { useKeyboard } from '@opentui/react';
import { useTheme } from '../hooks/useTheme';
import type { Theme } from '../types/theme';

interface ThemeSelectorProps {
  onClose: () => void;
  focused?: boolean;
}

export function ThemeSelector({ onClose, focused = true }: ThemeSelectorProps) {
  const { theme, themeId, setTheme, availableThemes } = useTheme();
  const [focusIndex, setFocusIndex] = useState(
    availableThemes.findIndex((t) => t.id === themeId)
  );

  useKeyboard(
    (key) => {
      if (!focused) return;

      switch (key.name) {
        case 'up':
        case 'k':
          setFocusIndex((prev) => Math.max(0, prev - 1));
          break;
        case 'down':
        case 'j':
          setFocusIndex((prev) => Math.min(availableThemes.length - 1, prev + 1));
          break;
        case 'return':
        case 'space':
          const selected = availableThemes[focusIndex];
          if (selected) {
            setTheme(selected.id as any);
          }
          break;
        case 'escape':
          onClose();
          break;
      }
    },
  );

  return (
    <box
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: 40,
        border: true,
        borderColor: theme.colors.borderFocus,
        backgroundColor: theme.colors.background,
        padding: 1,
        flexDirection: 'column',
      }}
      title="Select Theme"
    >
      {availableThemes.map((t, index) => {
        const isFocused = index === focusIndex;
        const isActive = t.id === themeId;

        return (
          <box
            key={t.id}
            style={{
              width: '100%',
              height: 1,
              flexDirection: 'row',
              backgroundColor: isFocused ? theme.colors.selection : 'transparent',
              paddingLeft: 1,
              paddingRight: 1,
            }}
          >
            <text fg={isFocused ? theme.colors.selectionText : theme.colors.text}>
              {isActive ? '● ' : '○ '}
              {t.name}
            </text>
          </box>
        );
      })}

      <box style={{ marginTop: 1 }}>
        <text fg={theme.colors.textMuted}>
          ↑↓ Navigate • Enter Select • Esc Close
        </text>
      </box>
    </box>
  );
}
