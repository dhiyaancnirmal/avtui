// Error screen for failed conversions

import { useKeyboard } from '@opentui/react';
import { useTheme } from '../hooks/useTheme';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import type { ScreenProps } from '../types/screens';

interface ErrorScreenProps extends ScreenProps {
  error: string | null;
  onRetry: () => void;
}

export function ErrorScreen({ onNavigate, onBack, error, onRetry, disabled }: ErrorScreenProps) {
  const { theme } = useTheme();

  useKeyboard((key) => {
    if (disabled) return;

    switch (key.name) {
      case 'r':
        onRetry();
        onNavigate('converting');
        break;
      case 'b':
      case 'escape':
        onBack();
        break;
    }
  });

  return (
    <box
      style={{
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        backgroundColor: theme.colors.background,
      }}
    >
      <Header compact title="Conversion Failed" />

      <box
        style={{
          flexGrow: 1,
          padding: 2,
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
        }}
      >
        {/* Error icon */}
        <text fg={theme.colors.error}>
          <strong>{'  ✗ ERROR  '}</strong>
        </text>

        {/* Error message */}
        <box
          style={{
            border: true,
            borderColor: theme.colors.error,
            padding: 2,
            width: 70,
            maxHeight: 15,
            flexDirection: 'column',
          }}
          title="Error Details"
        >
          <text fg={theme.colors.text}>{error || 'An unknown error occurred'}</text>
        </box>

        {/* Common solutions */}
        <box
          style={{
            border: true,
            borderColor: theme.colors.border,
            padding: 1,
            width: 70,
            flexDirection: 'column',
          }}
          title="Possible Solutions"
        >
          <text fg={theme.colors.textMuted}>• Check if the input file is corrupted</text>
          <text fg={theme.colors.textMuted}>• Try a different output format</text>
          <text fg={theme.colors.textMuted}>• Ensure you have write permissions</text>
          <text fg={theme.colors.textMuted}>• Check available disk space</text>
          <text fg={theme.colors.textMuted}>• Update FFmpeg to the latest version</text>
        </box>

        {/* Actions */}
        <box style={{ flexDirection: 'row', gap: 2, marginTop: 1 }}>
          <box
            style={{
              padding: 1,
              paddingLeft: 2,
              paddingRight: 2,
              border: true,
              borderColor: theme.colors.warning,
            }}
          >
            <text fg={theme.colors.warning}>[R] Retry</text>
          </box>
          <box
            style={{
              padding: 1,
              paddingLeft: 2,
              paddingRight: 2,
              border: true,
              borderColor: theme.colors.accent,
            }}
          >
            <text fg={theme.colors.accent}>[B] Back to Settings</text>
          </box>
          <box
            style={{
              padding: 1,
              paddingLeft: 2,
              paddingRight: 2,
              border: true,
              borderColor: theme.colors.textMuted,
            }}
          >
            <text fg={theme.colors.textMuted}>[Q] Quit</text>
          </box>
        </box>
      </box>

      <Footer
        bindings={[
          { key: 'r', label: 'Retry' },
          { key: 'b', label: 'Back' },
          { key: 'q', label: 'Quit' },
        ]}
      />
    </box>
  );
}
