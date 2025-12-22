// User config persistence hook

import { useState, useEffect, useCallback } from 'react';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import type { UserConfig } from '../types/conversion';
import type { ThemeId } from '../types/theme';
import { getConfigDir } from '../utils/platform';

const CONFIG_FILE = 'config.json';

const defaultConfig: UserConfig = {
  theme: 'opencode',
  lastDirectory: process.cwd(),
  lastOutputDirectory: '',
  defaultFormat: 'mp4',
  defaultQuality: 'medium',
  defaultResolution: 'original',
  defaultFrameRate: 'original',
  showHiddenFiles: false,
  confirmBeforeConvert: true,
  openOutputOnComplete: false,
};

interface UseConfigReturn {
  config: UserConfig;
  loading: boolean;
  updateConfig: (updates: Partial<UserConfig>) => Promise<void>;
  resetConfig: () => Promise<void>;
}

export function useConfig(): UseConfigReturn {
  const [config, setConfig] = useState<UserConfig>(defaultConfig);
  const [loading, setLoading] = useState(true);

  const configPath = join(getConfigDir(), CONFIG_FILE);

  const loadConfig = useCallback(async () => {
    try {
      const data = await readFile(configPath, 'utf-8');
      const parsed = JSON.parse(data);
      setConfig({ ...defaultConfig, ...parsed });
    } catch {
      // Config doesn't exist yet, use defaults
      setConfig(defaultConfig);
    } finally {
      setLoading(false);
    }
  }, [configPath]);

  const saveConfig = useCallback(
    async (newConfig: UserConfig) => {
      try {
        // Ensure config directory exists
        await mkdir(getConfigDir(), { recursive: true });
        await writeFile(configPath, JSON.stringify(newConfig, null, 2));
      } catch (err) {
        console.error('Failed to save config:', err);
      }
    },
    [configPath]
  );

  const updateConfig = useCallback(
    async (updates: Partial<UserConfig>) => {
      const newConfig = { ...config, ...updates };
      setConfig(newConfig);
      await saveConfig(newConfig);
    },
    [config, saveConfig]
  );

  const resetConfig = useCallback(async () => {
    setConfig(defaultConfig);
    await saveConfig(defaultConfig);
  }, [saveConfig]);

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  return {
    config,
    loading,
    updateConfig,
    resetConfig,
  };
}
