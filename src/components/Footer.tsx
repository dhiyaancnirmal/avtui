// Footer component with keyboard shortcuts

import { useTheme } from '../hooks/useTheme';

interface KeyBinding {
  key: string;
  label: string;
}

interface FooterProps {
  bindings?: KeyBinding[];
}

const defaultBindings: KeyBinding[] = [
  { key: 'q', label: 'Quit' },
  { key: 'esc', label: 'Back' },
  { key: '?', label: 'Help' },
];

export function Footer({ bindings = defaultBindings }: FooterProps) {
  const { theme } = useTheme();

  return (
    <box
      style={{
        width: '100%',
        height: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 3,
        backgroundColor: theme.colors.surface,
      }}
    >
      {bindings.map((binding) => (
        <box key={binding.key} style={{ flexDirection: 'row' }}>
          <text fg={theme.colors.primary}>
            <strong>{binding.key}</strong>
          </text>
          <text fg={theme.colors.textMuted}> {binding.label}</text>
        </box>
      ))}
    </box>
  );
}
