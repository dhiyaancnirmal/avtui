// Byte/file size formatting utilities

const UNITS = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];

/**
 * Format bytes to human readable size
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (!Number.isFinite(bytes) || bytes < 0) {
    return '0 B';
  }

  if (bytes === 0) {
    return '0 B';
  }

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const value = bytes / Math.pow(k, i);

  return `${value.toFixed(dm)} ${UNITS[i]}`;
}

/**
 * Format bitrate in human readable format
 */
export function formatBitrate(bitsPerSecond: number): string {
  if (!Number.isFinite(bitsPerSecond) || bitsPerSecond < 0) {
    return '0 bps';
  }

  if (bitsPerSecond >= 1_000_000) {
    return `${(bitsPerSecond / 1_000_000).toFixed(1)} Mbps`;
  }

  if (bitsPerSecond >= 1_000) {
    return `${(bitsPerSecond / 1_000).toFixed(0)} Kbps`;
  }

  return `${bitsPerSecond.toFixed(0)} bps`;
}

/**
 * Parse size string like "10MB" to bytes
 */
export function parseBytes(sizeStr: string): number {
  const match = sizeStr.match(/^([\d.]+)\s*(B|KB|MB|GB|TB|PB)?$/i);

  if (!match) {
    return 0;
  }

  const value = parseFloat(match[1]);
  const unit = (match[2] || 'B').toUpperCase();
  const unitIndex = UNITS.indexOf(unit);

  if (unitIndex === -1) {
    return value;
  }

  return value * Math.pow(1024, unitIndex);
}
