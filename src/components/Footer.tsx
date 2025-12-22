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
        gap: 2,
        border: true,
        borderColor: theme.colors.border,
        paddingTop: 0,
      }}
    >
      {bindings.map((binding, index) => (
        <box key={index} style={{ flexDirection: 'row', gap: 0 }}>
          <text fg={theme.colors.primary}>
            <strong>{binding.key}</strong>
          </text>
          <text fg={theme.colors.textMuted}> {binding.label}</text>
          {index < bindings.length - 1 && <text fg={theme.colors.border}> │</text>}
        </box>
      ))}
    </box>
  );
}
