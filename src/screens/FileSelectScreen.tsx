// File selection screen

import { useState } from 'react';
import { useKeyboard } from '@opentui/react';
import { useTheme } from '../hooks/useTheme';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { FileBrowser } from '../components/FileBrowser';
import type { ScreenProps } from '../types/screens';
import type { FileInfo } from '../types/conversion';

interface FileSelectScreenProps extends ScreenProps {
  onFilesSelected: (files: FileInfo[]) => void;
  initialPath?: string;
}

export function FileSelectScreen({
  onNavigate,
  onBack,
  onQuit,
  onFilesSelected,
  initialPath,
}: FileSelectScreenProps) {
  const { theme } = useTheme();
  const [multiSelect, setMultiSelect] = useState(false);

  useKeyboard((key) => {
    switch (key.name) {
      case 'q':
        onQuit();
        break;
      case 'm':
        setMultiSelect((prev) => !prev);
        break;
    }
  });

  const handleSelect = (files: FileInfo[]) => {
    if (files.length > 0) {
      onFilesSelected(files);
      onNavigate('settings');
    }
  };

  return (
    <box
      style={{
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        backgroundColor: theme.colors.background,
      }}
    >
      <Header compact title="Select Input File(s)" />

      <box
        style={{
          flexGrow: 1,
          padding: 1,
          flexDirection: 'column',
        }}
      >
        {/* Mode indicator */}
        <box
          style={{
            marginBottom: 1,
            flexDirection: 'row',
            gap: 2,
          }}
        >
          <text fg={theme.colors.textMuted}>Mode:</text>
          <text fg={multiSelect ? theme.colors.success : theme.colors.text}>
            {multiSelect ? 'Multi-select (Space to toggle, C to confirm)' : 'Single file'}
          </text>
          <text fg={theme.colors.textMuted}>| Press M to toggle</text>
        </box>

        {/* File browser */}
        <FileBrowser
          onSelect={handleSelect}
          onCancel={onBack}
          focused={true}
          multiSelect={multiSelect}
          mediaOnly={false}
          initialPath={initialPath}
        />
      </box>

      <Footer
        bindings={[
          { key: '↑↓', label: 'Navigate' },
          { key: 'Enter', label: 'Select/Open' },
          { key: 'Backspace', label: 'Parent' },
          { key: 'm', label: 'Multi-select' },
          { key: 'Ctrl+H', label: 'Hidden' },
          { key: 'Esc', label: 'Back' },
          { key: 'q', label: 'Quit' },
        ]}
      />
    </box>
  );
}
