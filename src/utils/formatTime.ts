// Time formatting utilities

/**
 * Convert seconds to HH:MM:SS format
 */
export function formatDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return '00:00:00';
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  return [hours, minutes, secs].map((n) => n.toString().padStart(2, '0')).join(':');
}

/**
 * Convert seconds to short format (MM:SS or HH:MM:SS if needed)
 */
export function formatDurationShort(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return '0:00';
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Parse HH:MM:SS or MM:SS format to seconds
 */
export function parseDuration(timeStr: string): number {
  const parts = timeStr.split(':').map(Number);

  if (parts.some((p) => Number.isNaN(p))) {
    return 0;
  }

  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }
  if (parts.length === 1) {
    return parts[0];
  }

  return 0;
}

/**
 * Format ETA in human readable format
 */
export function formatETA(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return 'calculating...';
  }

  if (seconds < 60) {
    return `${Math.ceil(seconds)}s`;
  }

  if (seconds < 3600) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.ceil(seconds % 60);
    return `${mins}m ${secs}s`;
  }

  const hours = Math.floor(seconds / 3600);
  const mins = Math.ceil((seconds % 3600) / 60);
  return `${hours}h ${mins}m`;
}

/**
 * Validate time string format (HH:MM:SS.ms or HH:MM:SS)
 */
export function isValidTimeFormat(timeStr: string): boolean {
  // Match HH:MM:SS or HH:MM:SS.ms
  const pattern = /^(\d{1,2}):([0-5]\d):([0-5]\d)(\.\d{1,3})?$/;
  return pattern.test(timeStr);
}
