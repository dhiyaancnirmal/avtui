// ASCII art header component

import { useTheme } from '../hooks/useTheme';

// Bigger, bolder logo - properly aligned
const LOGO = `
 ███████╗██╗   ██╗████████╗██╗   ██╗██╗
 ██╔══██║██║   ██║╚══██╔══╝██║   ██║██║
 ███████║██║   ██║   ██║   ██║   ██║██║
 ██╔══██║╚██╗ ██╔╝   ██║   ██║   ██║██║
 ██║  ██║ ╚████╔╝    ██║   ╚██████╔╝██║
 ╚═╝  ╚═╝  ╚═══╝     ╚═╝    ╚═════╝ ╚═╝
`.trimEnd().substring(1);

const LOGO_SMALL = '◆ AVTUI';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  compact?: boolean;
}

export function Header({ title, subtitle, compact = false }: HeaderProps) {
  const { theme } = useTheme();

  if (compact) {
    return (
      <box
        style={{
          width: '100%',
          height: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingLeft: 1,
          paddingRight: 1,
          backgroundColor: theme.colors.surface,
        }}
      >
        <text fg={theme.colors.primary}>
          <strong>{LOGO_SMALL}</strong>
        </text>
        {title && <text fg={theme.colors.textMuted}>{title}</text>}
      </box>
    );
  }

  return (
    <box
      style={{
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 2,
        paddingBottom: 1,
      }}
    >
      <text fg={theme.colors.primary}>{LOGO}</text>
      {subtitle && (
        <box style={{ marginTop: 1 }}>
          <text fg={theme.colors.textMuted}>{subtitle}</text>
        </box>
      )}
    </box>
  );
}
