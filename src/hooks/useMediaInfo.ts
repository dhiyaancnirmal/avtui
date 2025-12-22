// Media info hook

import { useState, useEffect, useCallback } from 'react';
import type { MediaInfo } from '../types/ffmpeg';
import { getMediaInfo } from '../ffmpeg/probe';

interface UseMediaInfoReturn {
  mediaInfo: MediaInfo | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useMediaInfo(filePath: string | null): UseMediaInfoReturn {
  const [mediaInfo, setMediaInfo] = useState<MediaInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMediaInfo = useCallback(async () => {
    if (!filePath) {
      setMediaInfo(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const info = await getMediaInfo(filePath);
      setMediaInfo(info);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get media info');
      setMediaInfo(null);
    } finally {
      setLoading(false);
    }
  }, [filePath]);

  useEffect(() => {
    fetchMediaInfo();
  }, [fetchMediaInfo]);

  return {
    mediaInfo,
    loading,
    error,
    refresh: fetchMediaInfo,
  };
}

/**
 * Hook for getting media info for multiple files
 */
export function useMultipleMediaInfo(
  filePaths: string[]
): Map<string, MediaInfo | null> {
  const [infoMap, setInfoMap] = useState<Map<string, MediaInfo | null>>(new Map());

  useEffect(() => {
    const fetchAll = async () => {
      const newMap = new Map<string, MediaInfo | null>();
      
      await Promise.all(
        filePaths.map(async (path) => {
          try {
            const info = await getMediaInfo(path);
            newMap.set(path, info);
          } catch {
            newMap.set(path, null);
          }
        })
      );

      setInfoMap(newMap);
    };

    if (filePaths.length > 0) {
      fetchAll();
    } else {
      setInfoMap(new Map());
    }
  }, [filePaths.join(',')]);

  return infoMap;
}
