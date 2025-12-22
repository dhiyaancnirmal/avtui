// File browser component with navigation and multi-select

import { useState, useEffect, useCallback } from 'react';
import { useKeyboard } from '@opentui/react';
import { useTheme } from '../hooks/useTheme';
import { useFileSystem } from '../hooks/useFileSystem';
import { FileItem } from './FileItem';
import { shortenPath } from '../utils/path';
import type { FileInfo } from '../types/conversion';

interface FileBrowserProps {
  onSelect: (files: FileInfo[]) => void;
  onCancel: () => void;
  focused?: boolean;
  multiSelect?: boolean;
  mediaOnly?: boolean;
  initialPath?: string;
}

export function FileBrowser({
  onSelect,
  onCancel,
  focused = true,
  multiSelect = false,
  mediaOnly = false,
  initialPath,
}: FileBrowserProps) {
  const { theme } = useTheme();
  const {
    currentPath,
    files,
    selectedFiles,
    loading,
    error,
    navigateTo,
    navigateUp,
    toggleSelection,
    selectAll,
    clearSelection,
    setShowHidden,
    showHidden,
  } = useFileSystem({ initialPath, mediaOnly });

  const [focusIndex, setFocusIndex] = useState(0);
  const [viewportStart, setViewportStart] = useState(0);
  const viewportHeight = 15; // Number of visible items

  // Adjust focus index when files change
  useEffect(() => {
    if (focusIndex >= files.length) {
      setFocusIndex(Math.max(0, files.length - 1));
    }
  }, [files.length, focusIndex]);

  // Scroll viewport to keep focus visible
  useEffect(() => {
    if (focusIndex < viewportStart) {
      setViewportStart(focusIndex);
    } else if (focusIndex >= viewportStart + viewportHeight) {
      setViewportStart(focusIndex - viewportHeight + 1);
    }
  }, [focusIndex, viewportStart, viewportHeight]);

  const handleKeyPress = useCallback(
    async (key: { name: string; ctrl?: boolean; shift?: boolean }) => {
      if (!focused) return;

      const currentFile = files[focusIndex];

      switch (key.name) {
        case 'up':
        case 'k':
          setFocusIndex((prev) => Math.max(0, prev - 1));
          break;

        case 'down':
        case 'j':
          setFocusIndex((prev) => Math.min(files.length - 1, prev + 1));
          break;

        case 'pageup':
          setFocusIndex((prev) => Math.max(0, prev - viewportHeight));
          break;

        case 'pagedown':
          setFocusIndex((prev) => Math.min(files.length - 1, prev + viewportHeight));
          break;

        case 'home':
        case 'g':
          setFocusIndex(0);
          break;

        case 'end':
          setFocusIndex(files.length - 1);
          break;

        case 'return':
          if (currentFile) {
            if (currentFile.isDirectory) {
              await navigateTo(currentFile.path);
              setFocusIndex(0);
            } else if (multiSelect) {
              toggleSelection(currentFile.path);
            } else {
              onSelect([currentFile]);
            }
          }
          break;

        case 'space':
          if (currentFile && !currentFile.isDirectory && multiSelect) {
            toggleSelection(currentFile.path);
          }
          break;

        case 'backspace':
          await navigateUp();
          setFocusIndex(0);
          break;

        case 'escape':
          if (selectedFiles.size > 0) {
            clearSelection();
          } else {
            onCancel();
          }
          break;

        case 'a':
          if (key.ctrl) {
            selectAll();
          }
          break;

        case 'h':
          if (key.ctrl) {
            setShowHidden(!showHidden);
          }
          break;

        case 'c':
          if (multiSelect && selectedFiles.size > 0) {
            const selected = files.filter((f) => selectedFiles.has(f.path));
            onSelect(selected);
          }
          break;

        default:
          break;
      }
    },
    [
      focused,
      files,
      focusIndex,
      multiSelect,
      selectedFiles,
      showHidden,
      navigateTo,
      navigateUp,
      toggleSelection,
      selectAll,
      clearSelection,
      setShowHidden,
      onSelect,
      onCancel,
    ]
  );

  useKeyboard(handleKeyPress);

  const visibleFiles = files.slice(viewportStart, viewportStart + viewportHeight);

  return (
    <box
      style={{
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        border: true,
        borderColor: focused ? theme.colors.borderFocus : theme.colors.border,
      }}
    >
      {/* Path header */}
      <box
        style={{
          width: '100%',
          height: 1,
          backgroundColor: theme.colors.surface,
          paddingLeft: 1,
          paddingRight: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <text fg={theme.colors.primary}>
          <strong>{shortenPath(currentPath, 50)}</strong>
        </text>
        {multiSelect && selectedFiles.size > 0 && (
          <text fg={theme.colors.success}>{selectedFiles.size} selected</text>
        )}
      </box>

      {/* File list */}
      <box style={{ width: '100%', flexGrow: 1, flexDirection: 'column' }}>
        {loading ? (
          <text fg={theme.colors.textMuted}>
            Loading...
          </text>
        ) : error ? (
          <text fg={theme.colors.error}>
            Error: {error}
          </text>
        ) : files.length === 0 ? (
          <text fg={theme.colors.textMuted}>
            No files found
          </text>
        ) : (
          visibleFiles.map((file, index) => {
            const actualIndex = viewportStart + index;
            return (
              <FileItem
                key={file.path}
                file={file}
                isFocused={actualIndex === focusIndex}
                isSelected={false}
                isChecked={selectedFiles.has(file.path)}
                showCheckbox={multiSelect && !file.isDirectory}
              />
            );
          })
        )}
      </box>

      {/* Scroll indicator */}
      {files.length > viewportHeight && (
        <box
          style={{
            width: '100%',
            height: 1,
            backgroundColor: theme.colors.surface,
            paddingLeft: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <text fg={theme.colors.textMuted}>
            {focusIndex + 1}/{files.length}
          </text>
          <text fg={theme.colors.textMuted}>
            {showHidden ? '[H] Hidden: On' : '[H] Hidden: Off'}
          </text>
        </box>
      )}
    </box>
  );
}
