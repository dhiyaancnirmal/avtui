// Conversion screen with progress display

import { useEffect } from 'react';
import { useKeyboard } from '@opentui/react';
import { useTheme } from '../hooks/useTheme';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { ProgressBar } from '../components/ProgressBar';
import type { ScreenProps } from '../types/screens';
import type { ProgressInfo } from '../types/ffmpeg';
import type { ConversionStatus, FileInfo } from '../types/conversion';
import { basename } from 'node:path';

interface ConversionScreenProps extends ScreenProps {
  files: FileInfo[];
  currentFileIndex: number;
  status: ConversionStatus;
  progress: ProgressInfo | null;
  totalDuration: number;
  command: string | null;
  onCancel: () => void;
}

export function ConversionScreen({
  onNavigate,
  files,
  currentFileIndex,
  status,
  progress,
  totalDuration,
  command,
  onCancel,
  disabled,
}: ConversionScreenProps) {
  const { theme } = useTheme();

  const currentFile = files[currentFileIndex];
  const isMultiFile = files.length > 1;

  useKeyboard((key) => {
    if (disabled) return;
    
    if (key.name === 'escape') {
      onCancel();
    }
  });

  // Navigate to success/error when complete
  useEffect(() => {
    if (status === 'completed') {
      onNavigate('success');
    } else if (status === 'failed') {
      onNavigate('error');
    } else if (status === 'cancelled') {
      onNavigate('error');
    }
  }, [status, onNavigate]);

  const getStatusDisplay = () => {
    switch (status) {
      case 'preparing':
        return { text: 'Preparing...', color: theme.colors.warning };
      case 'converting':
        return { text: 'Converting...', color: theme.colors.primary };
      case 'completed':
        return { text: 'Completed!', color: theme.colors.success };
      case 'failed':
        return { text: 'Failed', color: theme.colors.error };
      case 'cancelled':
        return { text: 'Cancelled', color: theme.colors.warning };
      default:
        return { text: 'Idle', color: theme.colors.textMuted };
    }
  };

  const statusDisplay = getStatusDisplay();

  return (
    <box
      style={{
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        backgroundColor: theme.colors.background,
      }}
    >
      <Header compact title="Converting..." />

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
        {/* Status */}
        <box style={{ flexDirection: 'row', gap: 1 }}>
          <text fg={statusDisplay.color}>
            <strong>{status === 'converting' ? '◉' : status === 'completed' ? '✓' : '○'}</strong>
          </text>
          <text fg={statusDisplay.color}>
            <strong>{statusDisplay.text}</strong>
          </text>
        </box>

        {/* Multi-file progress */}
        {isMultiFile && (
          <text fg={theme.colors.textMuted}>
            File {currentFileIndex + 1} of {files.length}
          </text>
        )}

        {/* Current file */}
        <box
          style={{
            width: 70,
            border: true,
            borderColor: theme.colors.border,
            padding: 1,
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <text fg={theme.colors.text}>
            <strong>{currentFile ? basename(currentFile.path) : 'Unknown'}</strong>
          </text>
        </box>

        {/* Progress bar */}
        <box style={{ width: 70 }}>
          <ProgressBar
            progress={progress}
            totalDuration={totalDuration}
            width={60}
            showStats={true}
          />
        </box>

        {/* Command preview (collapsed) */}
        {command && (
          <box
            style={{
              width: 70,
              marginTop: 1,
              padding: 1,
              backgroundColor: theme.colors.surface,
            }}
          >
            <text fg={theme.colors.textMuted}>
              {command.length > 80 ? command.slice(0, 77) + '...' : command}
            </text>
          </box>
        )}

        {/* Cancel hint */}
        {status === 'converting' && (
          <box style={{ marginTop: 2 }}>
            <text fg={theme.colors.warning}>Press Esc to cancel</text>
          </box>
        )}
      </box>

      <Footer
        bindings={
          status === 'converting'
            ? [{ key: 'Esc', label: 'Cancel' }]
            : [{ key: 'q', label: 'Quit' }]
        }
      />
    </box>
  );
}
