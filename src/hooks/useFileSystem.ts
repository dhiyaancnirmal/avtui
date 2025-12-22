// File system hook for browsing directories

import { useState, useCallback, useEffect } from 'react';
import { readdir, stat } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import type { FileInfo } from '../types/conversion';
import { isMediaFile, getMediaType } from '../utils/media';
import { getExtension, expandPath } from '../utils/path';

interface UseFileSystemOptions {
  initialPath?: string;
  showHidden?: boolean;
  mediaOnly?: boolean;
}

interface UseFileSystemReturn {
  currentPath: string;
  files: FileInfo[];
  selectedFiles: Set<string>;
  loading: boolean;
  error: string | null;
  navigateTo: (path: string) => Promise<void>;
  navigateUp: () => Promise<void>;
  refresh: () => Promise<void>;
  toggleSelection: (path: string) => void;
  selectAll: () => void;
  clearSelection: () => void;
  setShowHidden: (show: boolean) => void;
  showHidden: boolean;
}

export function useFileSystem(options: UseFileSystemOptions = {}): UseFileSystemReturn {
  const [currentPath, setCurrentPath] = useState(expandPath(options.initialPath || process.cwd()));
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showHidden, setShowHidden] = useState(options.showHidden ?? false);

  const loadDirectory = useCallback(
    async (path: string) => {
      setLoading(true);
      setError(null);

      try {
        const expandedPath = expandPath(path);
        const entries = await readdir(expandedPath, { withFileTypes: true });
        const fileInfos: FileInfo[] = [];

        for (const entry of entries) {
          // Skip hidden files if not showing them
          const isHidden = entry.name.startsWith('.');
          if (isHidden && !showHidden) continue;

          const fullPath = join(expandedPath, entry.name);
          const isDirectory = entry.isDirectory();
          const extension = isDirectory ? '' : getExtension(entry.name);
          const isMedia = isDirectory ? false : isMediaFile(entry.name);

          // Skip non-media files if mediaOnly is true
          if (options.mediaOnly && !isDirectory && !isMedia) continue;

          let size = 0;
          let modifiedAt = new Date();

          try {
            const stats = await stat(fullPath);
            size = stats.size;
            modifiedAt = stats.mtime;
          } catch {
            // Ignore stat errors (permission issues, etc.)
          }

          const mediaType = isMedia ? getMediaType(entry.name) : undefined;
          
          fileInfos.push({
            name: entry.name,
            path: fullPath,
            size,
            isDirectory,
            isHidden,
            extension,
            isMediaFile: isMedia,
            mediaType: (mediaType === 'video' || mediaType === 'audio') ? mediaType : undefined,
            modifiedAt,
          });
        }

        // Sort: directories first, then by name
        fileInfos.sort((a, b) => {
          if (a.isDirectory && !b.isDirectory) return -1;
          if (!a.isDirectory && b.isDirectory) return 1;
          return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
        });

        setFiles(fileInfos);
        setCurrentPath(expandedPath);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to read directory');
        setFiles([]);
      } finally {
        setLoading(false);
      }
    },
    [showHidden, options.mediaOnly]
  );

  const navigateTo = useCallback(
    async (path: string) => {
      await loadDirectory(path);
      setSelectedFiles(new Set());
    },
    [loadDirectory]
  );

  const navigateUp = useCallback(async () => {
    const parent = dirname(currentPath);
    if (parent !== currentPath) {
      await navigateTo(parent);
    }
  }, [currentPath, navigateTo]);

  const refresh = useCallback(async () => {
    await loadDirectory(currentPath);
  }, [currentPath, loadDirectory]);

  const toggleSelection = useCallback((path: string) => {
    setSelectedFiles((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  }, []);

  const selectAll = useCallback(() => {
    const mediaFiles = files.filter((f) => !f.isDirectory && f.isMediaFile);
    setSelectedFiles(new Set(mediaFiles.map((f) => f.path)));
  }, [files]);

  const clearSelection = useCallback(() => {
    setSelectedFiles(new Set());
  }, []);

  // Load initial directory
  useEffect(() => {
    loadDirectory(currentPath);
  }, []);

  // Reload when showHidden changes
  useEffect(() => {
    loadDirectory(currentPath);
  }, [showHidden]);

  return {
    currentPath,
    files,
    selectedFiles,
    loading,
    error,
    navigateTo,
    navigateUp,
    refresh,
    toggleSelection,
    selectAll,
    clearSelection,
    setShowHidden,
    showHidden,
  };
}
