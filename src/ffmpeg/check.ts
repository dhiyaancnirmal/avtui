// FFmpeg installation check utilities

import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import type { FFmpegStatus } from '../types/ffmpeg';
import { isMacOS, isLinux, isWindows } from '../utils/platform';

const execAsync = promisify(exec);

/**
 * Check if FFmpeg and FFprobe are installed
 */
export async function checkFFmpegInstallation(): Promise<FFmpegStatus> {
  try {
    // Get FFmpeg path and version
    const ffmpegWhich = await execAsync(isWindows() ? 'where ffmpeg' : 'which ffmpeg');
    const ffmpegPath = ffmpegWhich.stdout.split('\n')[0].trim();

    const ffmpegVersion = await execAsync('ffmpeg -version');
    const versionMatch = ffmpegVersion.stdout.match(/ffmpeg version (\S+)/);
    const version = versionMatch ? versionMatch[1] : 'unknown';

    // Get FFprobe path
    let ffprobePath: string | null = null;
    try {
      const ffprobeWhich = await execAsync(isWindows() ? 'where ffprobe' : 'which ffprobe');
      ffprobePath = ffprobeWhich.stdout.split('\n')[0].trim();
    } catch {
      // FFprobe not found, but FFmpeg might still work
    }

    return {
      installed: true,
      version,
      ffmpegPath,
      ffprobePath,
    };
  } catch {
    return {
      installed: false,
      version: null,
      ffmpegPath: null,
      ffprobePath: null,
    };
  }
}

/**
 * Get installation instructions based on platform
 */
export function getInstallInstructions(): string {
  if (isMacOS()) {
    return `
FFmpeg is not installed on your system.

Install using Homebrew (recommended):
  brew install ffmpeg

Or download from: https://ffmpeg.org/download.html

After installation, restart your terminal and run avtui again.
`.trim();
  }

  if (isLinux()) {
    return `
FFmpeg is not installed on your system.

Install using your package manager:

  Ubuntu/Debian:
    sudo apt update && sudo apt install ffmpeg

  Fedora:
    sudo dnf install ffmpeg

  Arch Linux:
    sudo pacman -S ffmpeg

  CentOS/RHEL:
    sudo yum install epel-release
    sudo yum install ffmpeg

After installation, restart your terminal and run avtui again.
`.trim();
  }

  if (isWindows()) {
    return `
FFmpeg is not installed on your system.

Install using winget (recommended):
  winget install ffmpeg

Or using Chocolatey:
  choco install ffmpeg

Or using Scoop:
  scoop install ffmpeg

Or download from: https://ffmpeg.org/download.html

After installation, restart your terminal and run avtui again.
`.trim();
  }

  return `
FFmpeg is not installed on your system.

Download from: https://ffmpeg.org/download.html

After installation, ensure ffmpeg is in your PATH and run avtui again.
`.trim();
}

/**
 * Check if a specific FFmpeg codec is available
 */
export async function checkCodecAvailable(codec: string): Promise<boolean> {
  try {
    const result = await execAsync(`ffmpeg -codecs 2>/dev/null | grep -w ${codec}`);
    return result.stdout.includes(codec);
  } catch {
    return false;
  }
}

/**
 * Get list of available codecs
 */
export async function getAvailableCodecs(): Promise<string[]> {
  try {
    const result = await execAsync('ffmpeg -codecs 2>/dev/null');
    const lines = result.stdout.split('\n');
    const codecs: string[] = [];

    for (const line of lines) {
      const match = line.match(/^\s*[DEVASIL.]+\s+(\S+)/);
      if (match) {
        codecs.push(match[1]);
      }
    }

    return codecs;
  } catch {
    return [];
  }
}
