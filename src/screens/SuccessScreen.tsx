// Success screen after conversion completes

import { useKeyboard } from '@opentui/react';
import { useTheme } from '../hooks/useTheme';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import type { ScreenProps } from '../types/screens';
import type { ConversionResult } from '../types/conversion';
import { formatBytes } from '../utils/formatBytes';
import { formatDurationShort } from '../utils/formatTime';
import { basename, dirname } from 'node:path';
import { exec } from 'node:child_process';

interface SuccessScreenProps extends ScreenProps {
  results: ConversionResult[];
  onNewConversion: () => void;
}

export function SuccessScreen({
  onNavigate,
  onQuit,
  results,
  onNewConversion,
}: SuccessScreenProps) {
  const { theme } = useTheme();

  const successCount = results.filter((r) => r.status === 'completed').length;
  const failedCount = results.filter((r) => r.status === 'failed').length;
  const totalSize = results
    .filter((r) => r.status === 'completed')
    .reduce((sum, r) => sum + r.outputSize, 0);
  const totalTime = results.reduce((sum, r) => sum + r.duration, 0);

  const openOutputFolder = () => {
    if (results.length > 0 && results[0].outputPath) {
      const folder = dirname(results[0].outputPath);
      // Open folder in system file manager
      const cmd = process.platform === 'darwin' ? 'open' : 'xdg-open';
      exec(`${cmd} "${folder}"`);
    }
  };

  useKeyboard((key) => {
    switch (key.name) {
      case 'n':
        onNewConversion();
        onNavigate('file-select');
        break;
      case 'o':
        openOutputFolder();
        break;
      case 'q':
      case 'escape':
        onQuit();
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
      <Header compact title="Conversion Complete" />

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
        {/* Success icon */}
        <text fg={theme.colors.success}>
          <strong>{'  ✓ SUCCESS  '}</strong>
        </text>

        {/* Summary */}
        <box
          style={{
            border: true,
            borderColor: theme.colors.success,
            padding: 2,
            width: 60,
            flexDirection: 'column',
            gap: 1,
          }}
          title="Summary"
        >
          <box style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <text fg={theme.colors.textMuted}>Files converted:</text>
            <text fg={theme.colors.success}>{successCount}</text>
          </box>

          {failedCount > 0 && (
            <box style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <text fg={theme.colors.textMuted}>Failed:</text>
              <text fg={theme.colors.error}>{failedCount}</text>
            </box>
          )}

          <box style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <text fg={theme.colors.textMuted}>Total output size:</text>
            <text fg={theme.colors.text}>{formatBytes(totalSize)}</text>
          </box>

          <box style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <text fg={theme.colors.textMuted}>Time taken:</text>
            <text fg={theme.colors.text}>{formatDurationShort(totalTime / 1000)}</text>
          </box>
        </box>

        {/* Output files */}
        <box
          style={{
            border: true,
            borderColor: theme.colors.border,
            padding: 1,
            width: 60,
            maxHeight: 8,
            flexDirection: 'column',
          }}
          title="Output Files"
        >
          {results.slice(0, 5).map((result, index) => (
            <box key={index} style={{ flexDirection: 'row', gap: 1 }}>
              <text fg={result.status === 'completed' ? theme.colors.success : theme.colors.error}>
                {result.status === 'completed' ? '✓' : '✗'}
              </text>
              <text fg={theme.colors.text}>{basename(result.outputPath)}</text>
              {result.status === 'completed' && (
                <text fg={theme.colors.textMuted}>({formatBytes(result.outputSize)})</text>
              )}
            </box>
          ))}
          {results.length > 5 && (
            <text fg={theme.colors.textMuted}>... and {results.length - 5} more</text>
          )}
        </box>

        {/* Actions */}
        <box style={{ flexDirection: 'row', gap: 2, marginTop: 1 }}>
          <box
            style={{
              padding: 1,
              paddingLeft: 2,
              paddingRight: 2,
              border: true,
              borderColor: theme.colors.primary,
            }}
          >
            <text fg={theme.colors.primary}>[N] New Conversion</text>
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
            <text fg={theme.colors.accent}>[O] Open Folder</text>
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
          { key: 'n', label: 'New' },
          { key: 'o', label: 'Open Folder' },
          { key: 'q', label: 'Quit' },
        ]}
      />
    </box>
  );
}
