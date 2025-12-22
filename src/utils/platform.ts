// Platform detection utilities

import { platform, arch } from 'node:os';

export type Platform = 'darwin' | 'linux' | 'win32' | 'unknown';
export type Architecture = 'x64' | 'arm64' | 'unknown';

/**
 * Get current platform
 */
export function getPlatform(): Platform {
  const p = platform();
  if (p === 'darwin' || p === 'linux' || p === 'win32') {
    return p;
  }
  return 'unknown';
}

/**
 * Get current architecture
 */
export function getArchitecture(): Architecture {
  const a = arch();
  if (a === 'x64' || a === 'arm64') {
    return a;
  }
  return 'unknown';
}

/**
 * Check if running on macOS
 */
export function isMacOS(): boolean {
  return platform() === 'darwin';
}

/**
 * Check if running on Linux
 */
export function isLinux(): boolean {
  return platform() === 'linux';
}

/**
 * Check if running on Windows
 */
export function isWindows(): boolean {
  return platform() === 'win32';
}

/**
 * Get platform-specific path separator
 */
export function getPathSep(): string {
  return isWindows() ? '\\' : '/';
}

/**
 * Get config directory path
 */
export function getConfigDir(): string {
  const home = process.env.HOME || process.env.USERPROFILE || '';

  if (isMacOS()) {
    return `${home}/.config/avtui`;
  }
  if (isLinux()) {
    return process.env.XDG_CONFIG_HOME
      ? `${process.env.XDG_CONFIG_HOME}/avtui`
      : `${home}/.config/avtui`;
  }
  if (isWindows()) {
    return process.env.APPDATA ? `${process.env.APPDATA}/avtui` : `${home}/AppData/Roaming/avtui`;
  }

  return `${home}/.avtui`;
}

/**
 * Get cache directory path
 */
export function getCacheDir(): string {
  const home = process.env.HOME || process.env.USERPROFILE || '';

  if (isMacOS()) {
    return `${home}/Library/Caches/avtui`;
  }
  if (isLinux()) {
    return process.env.XDG_CACHE_HOME
      ? `${process.env.XDG_CACHE_HOME}/avtui`
      : `${home}/.cache/avtui`;
  }
  if (isWindows()) {
    return process.env.LOCALAPPDATA
      ? `${process.env.LOCALAPPDATA}/avtui/Cache`
      : `${home}/AppData/Local/avtui/Cache`;
  }

  return `${home}/.avtui/cache`;
}
