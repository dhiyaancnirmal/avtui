// FFmpeg progress parser

import type { ProgressInfo } from '../types/ffmpeg';

/**
 * Parse FFmpeg stderr output to extract progress information
 */
export function parseProgressLine(line: string, totalDuration: number): ProgressInfo | null {
  // FFmpeg outputs progress like:
  // frame=  150 fps=30 q=28.0 size=    1024kB time=00:00:05.00 bitrate=1677.7kbits/s speed=1.00x

  // Also handles progress pipe output:
  // out_time_us=5000000
  // out_time=00:00:05.000000
  // progress=continue

  let time: number | null = null;
  let fps: number | undefined;
  let speed: string | undefined;
  let bitrate: string | undefined;
  let size: string | undefined;
  let frame: number | undefined;

  // Try to parse time from various formats
  const timeMatch = line.match(/time[=:](\d{2}):(\d{2}):(\d{2})\.(\d+)/i);
  if (timeMatch) {
    const [, hours, minutes, seconds, fraction] = timeMatch;
    time =
      parseInt(hours, 10) * 3600 +
      parseInt(minutes, 10) * 60 +
      parseInt(seconds, 10) +
      parseFloat(`0.${fraction}`);
  }

  // Try out_time_us (microseconds)
  if (time === null) {
    const usMatch = line.match(/out_time_us[=:](\d+)/);
    if (usMatch) {
      time = parseInt(usMatch[1], 10) / 1_000_000;
    }
  }

  if (time === null) {
    return null;
  }

  // Parse other fields
  const fpsMatch = line.match(/fps[=:]?\s*([\d.]+)/i);
  if (fpsMatch) {
    fps = parseFloat(fpsMatch[1]);
  }

  const speedMatch = line.match(/speed[=:]?\s*([\d.]+)x/i);
  if (speedMatch) {
    speed = `${speedMatch[1]}x`;
  }

  const bitrateMatch = line.match(/bitrate[=:]?\s*([\d.]+\s*\w+)/i);
  if (bitrateMatch) {
    bitrate = bitrateMatch[1];
  }

  const sizeMatch = line.match(/size[=:]?\s*(\d+\s*\w+)/i);
  if (sizeMatch) {
    size = sizeMatch[1];
  }

  const frameMatch = line.match(/frame[=:]?\s*(\d+)/i);
  if (frameMatch) {
    frame = parseInt(frameMatch[1], 10);
  }

  // Calculate percentage
  const percent = totalDuration > 0 ? Math.min(100, (time / totalDuration) * 100) : 0;

  // Calculate ETA
  let eta: number | undefined;
  if (speed && totalDuration > 0) {
    const speedNum = parseFloat(speed);
    if (speedNum > 0) {
      const remaining = totalDuration - time;
      eta = remaining / speedNum;
    }
  }

  return {
    time,
    percent,
    speed,
    fps,
    bitrate,
    size,
    frame,
    eta,
  };
}

/**
 * Parse FFmpeg error output
 */
export function parseErrorOutput(stderr: string): string {
  const lines = stderr.split('\n');
  const errors: string[] = [];

  for (const line of lines) {
    // Look for error lines
    if (
      line.includes('Error') ||
      line.includes('error') ||
      line.includes('Invalid') ||
      line.includes('No such file') ||
      line.includes('Permission denied') ||
      line.includes('Unknown encoder') ||
      line.includes('Unrecognized option') ||
      line.includes('does not contain')
    ) {
      errors.push(line.trim());
    }
  }

  if (errors.length > 0) {
    return errors.join('\n');
  }

  // If no specific error found, return last few lines
  const lastLines = lines.filter((l) => l.trim()).slice(-5);
  return lastLines.join('\n');
}

/**
 * Check if output indicates completion
 */
export function isProgressComplete(line: string): boolean {
  return line.includes('progress=end') || line.includes('muxing overhead');
}

/**
 * Check if output indicates an error
 */
export function hasError(stderr: string): boolean {
  return (
    stderr.includes('Error') ||
    stderr.includes('Invalid') ||
    stderr.includes('No such file') ||
    stderr.includes('Permission denied') ||
    stderr.includes('Unknown encoder') ||
    stderr.includes('Conversion failed')
  );
}
