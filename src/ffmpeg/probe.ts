// FFprobe wrapper for getting media information

import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import { stat } from 'node:fs/promises';
import type { MediaInfo } from '../types/ffmpeg';

const execAsync = promisify(exec);

/**
 * Get detailed media information using ffprobe
 */
export async function getMediaInfo(filePath: string): Promise<MediaInfo> {
  // Get file size first
  const fileStats = await stat(filePath);
  const size = fileStats.size;

  try {
    // Run ffprobe with JSON output
    const { stdout } = await execAsync(
      `ffprobe -v quiet -print_format json -show_format -show_streams "${filePath}"`
    );

    const data = JSON.parse(stdout);
    const format = data.format || {};
    const streams = data.streams || [];

    // Find video and audio streams
    const videoStream = streams.find((s: Record<string, unknown>) => s.codec_type === 'video');
    const audioStream = streams.find((s: Record<string, unknown>) => s.codec_type === 'audio');

    // Parse duration (can be in format or stream)
    let duration = 0;
    if (format.duration) {
      duration = parseFloat(format.duration);
    } else if (videoStream?.duration) {
      duration = parseFloat(videoStream.duration);
    } else if (audioStream?.duration) {
      duration = parseFloat(audioStream.duration);
    }

    // Parse frame rate (e.g., "30/1" or "29.97")
    let fps: number | undefined;
    if (videoStream?.r_frame_rate) {
      const [num, den] = videoStream.r_frame_rate.split('/').map(Number);
      fps = den ? num / den : num;
    } else if (videoStream?.avg_frame_rate) {
      const [num, den] = videoStream.avg_frame_rate.split('/').map(Number);
      fps = den && num ? num / den : undefined;
    }

    // Parse bitrate
    let bitrate: number | undefined;
    if (format.bit_rate) {
      bitrate = parseInt(format.bit_rate, 10);
    }

    return {
      duration,
      width: videoStream?.width,
      height: videoStream?.height,
      fps: fps && fps > 0 && fps < 1000 ? fps : undefined,
      videoCodec: videoStream?.codec_name,
      audioCodec: audioStream?.codec_name,
      bitrate,
      size,
      format: format.format_name || 'unknown',
      hasVideo: !!videoStream,
      hasAudio: !!audioStream,
    };
  } catch (error) {
    // Return minimal info if ffprobe fails
    return {
      duration: 0,
      size,
      format: 'unknown',
      hasVideo: false,
      hasAudio: false,
    };
  }
}

/**
 * Get just the duration (faster than full media info)
 */
export async function getMediaDuration(filePath: string): Promise<number> {
  try {
    const { stdout } = await execAsync(
      `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${filePath}"`
    );
    const duration = parseFloat(stdout.trim());
    return Number.isNaN(duration) ? 0 : duration;
  } catch {
    return 0;
  }
}

/**
 * Get video dimensions
 */
export async function getVideoDimensions(
  filePath: string
): Promise<{ width: number; height: number } | null> {
  try {
    const { stdout } = await execAsync(
      `ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 "${filePath}"`
    );
    const [width, height] = stdout.trim().split('x').map(Number);
    if (width && height) {
      return { width, height };
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Check if file has video stream
 */
export async function hasVideoStream(filePath: string): Promise<boolean> {
  try {
    const { stdout } = await execAsync(
      `ffprobe -v error -select_streams v -show_entries stream=codec_type -of csv=p=0 "${filePath}"`
    );
    return stdout.trim().includes('video');
  } catch {
    return false;
  }
}

/**
 * Check if file has audio stream
 */
export async function hasAudioStream(filePath: string): Promise<boolean> {
  try {
    const { stdout } = await execAsync(
      `ffprobe -v error -select_streams a -show_entries stream=codec_type -of csv=p=0 "${filePath}"`
    );
    return stdout.trim().includes('audio');
  } catch {
    return false;
  }
}
