// File item component for file browser

import { useTheme } from '../hooks/useTheme';
import type { FileInfo } from '../types/conversion';
import { formatBytes } from '../utils/formatBytes';
import { getFileIcon } from '../utils/media';

interface FileItemProps {
  file: FileInfo;
  isSelected: boolean;
  isFocused: boolean;
  isChecked?: boolean;
  showCheckbox?: boolean;
}

export function FileItem({
  file,
  isSelected,
  isFocused,
  isChecked = false,
  showCheckbox = false,
}: FileItemProps) {
  const { theme } = useTheme();

  const icon = getFileIcon(file.path, file.isDirectory);

  // Determine colors based on state
  let bgColor = 'transparent';
  let fgColor = theme.colors.text;

  if (isFocused) {
    bgColor = theme.colors.selection;
    fgColor = theme.colors.selectionText;
  } else if (isSelected) {
    bgColor = theme.colors.highlight;
  }

  if (file.isDirectory) {
    fgColor = isFocused ? theme.colors.selectionText : theme.colors.accent;
  } else if (file.isMediaFile) {
    fgColor = isFocused ? theme.colors.selectionText : theme.colors.success;
  } else if (file.isHidden) {
    fgColor = isFocused ? theme.colors.selectionText : theme.colors.textMuted;
  }

  const checkbox = showCheckbox ? (isChecked ? '[✓] ' : '[ ] ') : '';

  return (
    <box
      style={{
        width: '100%',
        height: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: bgColor,
        paddingLeft: 1,
        paddingRight: 1,
      }}
    >
      <box style={{ flexDirection: 'row', gap: 1, flexShrink: 1 }}>
        {showCheckbox && (
          <text fg={isChecked ? theme.colors.success : theme.colors.textMuted}>{checkbox}</text>
        )}
        <text>{icon}</text>
        <text fg={fgColor}>
          {file.isDirectory ? <strong>{file.name}/</strong> : file.name}
        </text>
      </box>

      {!file.isDirectory && (
        <text fg={theme.colors.textMuted}>{formatBytes(file.size)}</text>
      )}
    </box>
  );
}
