// FFmpeg command builder

import type { ConversionConfig } from '../types/conversion';
import { FORMATS, VIDEO_QUALITY, AUDIO_QUALITY, RESOLUTIONS, FRAME_RATES } from './presets';

export interface FFmpegCommand {
  args: string[];
  inputPath: string;
  outputPath: string;
  description: string;
}

/**
 * Build complete FFmpeg command arguments from config
 */
export function buildFFmpegCommand(config: ConversionConfig): FFmpegCommand {
  const args: string[] = [];
  const format = FORMATS[config.format];

  if (!format) {
    throw new Error(`Unknown format: ${config.format}`);
  }

  // Overwrite output without asking
  args.push('-y');

  // Trim: start time (must be before -i for faster seeking)
  if (config.trim.enabled && config.trim.startTime) {
    args.push('-ss', config.trim.startTime);
  }

  // Input file
  args.push('-i', config.inputPath);

  // Trim: end time (after -i)
  if (config.trim.enabled && config.trim.endTime) {
    args.push('-to', config.trim.endTime);
  }

  // Handle different format types
  if (format.type === 'video') {
    buildVideoArgs(args, config, format);
  } else if (format.type === 'audio') {
    buildAudioArgs(args, config, format);
  }

  // Add any custom arguments
  if (config.customArgs && config.customArgs.length > 0) {
    args.push(...config.customArgs);
  }

  // Progress output for parsing
  args.push('-progress', 'pipe:2');
  args.push('-stats_period', '0.5');

  // Output file
  args.push(config.outputPath);

  return {
    args,
    inputPath: config.inputPath,
    outputPath: config.outputPath,
    description: generateDescription(config, format),
  };
}

function buildVideoArgs(
  args: string[],
  config: ConversionConfig,
  format: (typeof FORMATS)[string]
): void {
  const quality = VIDEO_QUALITY[config.quality] || VIDEO_QUALITY.medium;

  // Handle GIF specially
  if (format.codec === 'gif') {
    buildGifArgs(args, config);
    return;
  }

  // Remove video if extracting audio only
  if (config.removeVideo) {
    args.push('-vn');
    // Just copy audio
    if (format.audioCodec) {
      args.push('-c:a', format.audioCodec);
      args.push('-b:a', quality.audioBitrate);
    }
    return;
  }

  // Video codec
  args.push('-c:v', format.codec);

  // Quality settings based on codec
  if (format.codec === 'libx264' || format.codec === 'libx265') {
    args.push('-crf', quality.crf.toString());
    args.push('-preset', quality.preset);

    // Pixel format for compatibility
    args.push('-pix_fmt', 'yuv420p');
  } else if (format.codec === 'libvpx-vp9') {
    // VP9 uses different quality settings
    const cqLevel = Math.floor(quality.crf * 1.5);
    args.push('-crf', cqLevel.toString());
    args.push('-b:v', '0'); // Let CRF control quality
  } else if (format.codec === 'libaom-av1') {
    // AV1 settings
    args.push('-crf', quality.crf.toString());
    args.push('-cpu-used', quality.preset === 'veryslow' ? '2' : quality.preset === 'slow' ? '4' : '6');
  }

  // Build video filter chain
  const filters: string[] = [];

  // Resolution
  const resolution = RESOLUTIONS[config.resolution];
  if (resolution?.scale) {
    filters.push(`scale=${resolution.scale}`);
  }

  // Apply filters if any
  if (filters.length > 0) {
    args.push('-vf', filters.join(','));
  }

  // Frame rate
  const frameRate = FRAME_RATES[config.frameRate];
  if (frameRate?.fps) {
    args.push('-r', frameRate.fps.toString());
  }

  // Audio handling
  if (config.removeAudio) {
    args.push('-an');
  } else if (format.audioCodec) {
    args.push('-c:a', format.audioCodec);
    args.push('-b:a', quality.audioBitrate);
  }

  // Fast start for MP4 (moves metadata to beginning for streaming)
  if (format.ext === '.mp4' || format.ext === '.m4v' || format.ext === '.mov') {
    args.push('-movflags', '+faststart');
  }
}

function buildGifArgs(args: string[], config: ConversionConfig): void {
  const fps = FRAME_RATES[config.frameRate]?.fps || 15;
  const resolution = RESOLUTIONS[config.resolution];
  const scale = resolution?.scale || '480:-2';

  // High-quality GIF filter chain
  args.push(
    '-vf',
    `fps=${fps},scale=${scale}:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=256:stats_mode=diff[p];[s1][p]paletteuse=dither=bayer:bayer_scale=5:diff_mode=rectangle`
  );

  // Loop infinitely
  args.push('-loop', '0');
}

function buildAudioArgs(
  args: string[],
  config: ConversionConfig,
  format: (typeof FORMATS)[string]
): void {
  const quality = AUDIO_QUALITY[config.quality] || AUDIO_QUALITY.medium;

  // No video for audio-only output
  args.push('-vn');

  // Audio codec
  args.push('-c:a', format.codec);

  // Bitrate (if not lossless)
  if (quality.bitrate) {
    args.push('-b:a', quality.bitrate);
  }

  // Sample rate for certain formats
  if (format.codec === 'libopus') {
    args.push('-ar', '48000'); // Opus works best at 48kHz
  }
}

function generateDescription(
  config: ConversionConfig,
  format: (typeof FORMATS)[string]
): string {
  const parts: string[] = [];

  parts.push(`Convert to ${format.label}`);

  if (config.quality !== 'medium') {
    parts.push(`(${config.quality} quality)`);
  }

  if (config.resolution !== 'original') {
    parts.push(`at ${RESOLUTIONS[config.resolution]?.label || config.resolution}`);
  }

  if (config.frameRate !== 'original') {
    parts.push(`${FRAME_RATES[config.frameRate]?.fps || config.frameRate} FPS`);
  }

  if (config.trim.enabled) {
    parts.push('(trimmed)');
  }

  if (config.removeAudio) {
    parts.push('(no audio)');
  }

  if (config.removeVideo) {
    parts.push('(audio only)');
  }

  return parts.join(' ');
}

/**
 * Get the FFmpeg command as a string (for display/debugging)
 */
export function commandToString(cmd: FFmpegCommand): string {
  return `ffmpeg ${cmd.args.map((a) => (a.includes(' ') ? `"${a}"` : a)).join(' ')}`;
}
