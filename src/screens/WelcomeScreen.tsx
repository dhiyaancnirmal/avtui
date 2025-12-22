// Welcome screen with ASCII art and quick start

import { useKeyboard } from '@opentui/react';
import { useTheme } from '../hooks/useTheme';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import type { ScreenProps } from '../types/screens';

interface WelcomeScreenProps extends ScreenProps {
  ffmpegVersion?: string;
}

export function WelcomeScreen({ onNavigate, disabled, ffmpegVersion }: WelcomeScreenProps) {
  const { theme } = useTheme();

  useKeyboard((key) => {
    if (disabled) return;

    switch (key.name) {
      case 'return':
      case 'space':
        onNavigate('file-select');
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
      <Header subtitle="A beautiful TUI for FFmpeg media conversion" />

      <box
        style={{
          flexGrow: 1,
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
        }}
      >
        {/* Features */}
        <box
          style={{
            border: true,
            borderColor: theme.colors.border,
            padding: 2,
            width: 60,
            flexDirection: 'column',
            gap: 1,
          }}
        >
          <text fg={theme.colors.text}>
            <strong>Features:</strong>
          </text>
          <text fg={theme.colors.textMuted}>
            • Convert videos and audio to any format
          </text>
          <text fg={theme.colors.textMuted}>
            • Adjust quality, resolution, and frame rate
          </text>
          <text fg={theme.colors.textMuted}>
            • Trim and cut media files
          </text>
          <text fg={theme.colors.textMuted}>
            • Batch convert multiple files
          </text>
          <text fg={theme.colors.textMuted}>
            • Extract audio from videos
          </text>
          <text fg={theme.colors.textMuted}>
            • Real-time progress tracking
          </text>
        </box>

        {/* FFmpeg status */}
        <box style={{ flexDirection: 'row', gap: 1 }}>
          <text fg={theme.colors.success}>✓</text>
          <text fg={theme.colors.textMuted}>FFmpeg {ffmpegVersion || 'installed'}</text>
        </box>

        {/* Call to action */}
        <box
          style={{
            marginTop: 2,
            padding: 1,
            paddingLeft: 3,
            paddingRight: 3,
            backgroundColor: theme.colors.primary,
          }}
        >
          <text fg={theme.colors.textInverse}>
            <strong>Press Enter to start</strong>
          </text>
        </box>
      </box>

      <Footer
        bindings={[
          { key: 'Enter', label: 'Start' },
          { key: 't', label: 'Theme' },
          { key: 'q', label: 'Quit' },
        ]}
      />
    </box>
  );
}
