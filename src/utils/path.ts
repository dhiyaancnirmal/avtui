// Path manipulation utilities

import { basename, dirname as nodeDirname, extname, join, resolve, sep } from 'node:path';
import { homedir } from 'node:os';

// Re-export dirname for convenience
export const dirname = nodeDirname;

/**
 * Get the home directory path
 */
export function getHomeDir(): string {
  return homedir();
}

/**
 * Expand ~ to home directory
 */
export function expandPath(path: string): string {
  if (path.startsWith('~')) {
    return join(homedir(), path.slice(1));
  }
  return resolve(path);
}

/**
 * Shorten path for display (replace home with ~)
 */
export function shortenPath(path: string, maxLength = 50): string {
  let shortened = path;

  // Replace home directory with ~
  const home = homedir();
  if (shortened.startsWith(home)) {
    shortened = '~' + shortened.slice(home.length);
  }

  // If still too long, truncate from the middle
  if (shortened.length > maxLength) {
    const half = Math.floor((maxLength - 3) / 2);
    shortened = shortened.slice(0, half) + '...' + shortened.slice(-half);
  }

  return shortened;
}

/**
 * Get file name without extension
 */
export function getFileNameWithoutExt(path: string): string {
  const name = basename(path);
  const ext = extname(name);
  return name.slice(0, name.length - ext.length);
}

/**
 * Get file extension (lowercase, with dot)
 */
export function getExtension(path: string): string {
  return extname(path).toLowerCase();
}

/**
 * Get parent directory
 */
export function getParentDir(path: string): string {
  return dirname(path);
}

/**
 * Join paths safely
 */
export function joinPath(...paths: string[]): string {
  return join(...paths);
}

/**
 * Get the path separator for current OS
 */
export function getPathSeparator(): string {
  return sep;
}

/**
 * Generate output filename based on input and format
 */
export function generateOutputPath(
  inputPath: string,
  outputDir: string,
  newExtension: string,
  suffix = '_converted'
): string {
  const baseName = getFileNameWithoutExt(inputPath);
  const ext = newExtension.startsWith('.') ? newExtension : `.${newExtension}`;
  return join(outputDir, `${baseName}${suffix}${ext}`);
}

/**
 * Check if path is absolute
 */
export function isAbsolutePath(path: string): boolean {
  if (path.startsWith('/')) return true;
  if (path.startsWith('~')) return true;
  // Windows absolute paths
  if (/^[A-Za-z]:/.test(path)) return true;
  return false;
}
