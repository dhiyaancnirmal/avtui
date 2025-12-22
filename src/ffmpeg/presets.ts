// Complete FFmpeg format and quality presets

import type {
  FormatConfig,
  VideoQualityConfig,
  AudioQualityConfig,
  ResolutionConfig,
  FrameRateConfig,
} from '../types/ffmpeg';

// ==================== OUTPUT FORMATS ====================

export const FORMATS: Record<string, FormatConfig> = {
  // Video Formats
  mp4: {
    ext: '.mp4',
    type: 'video',
    label: 'MP4 (H.264)',
    codec: 'libx264',
    audioCodec: 'aac',
    description: 'Most compatible video format',
  },
  mp4_h265: {
    ext: '.mp4',
    type: 'video',
    label: 'MP4 (H.265/HEVC)',
    codec: 'libx265',
    audioCodec: 'aac',
    description: 'Better compression, less compatible',
  },
  mkv: {
    ext: '.mkv',
    type: 'video',
    label: 'MKV (Matroska)',
    codec: 'libx264',
    audioCodec: 'aac',
    description: 'Flexible container, great for archiving',
  },
  webm: {
    ext: '.webm',
    type: 'video',
    label: 'WebM (VP9)',
    codec: 'libvpx-vp9',
    audioCodec: 'libopus',
    description: 'Open format, good for web',
  },
  webm_av1: {
    ext: '.webm',
    type: 'video',
    label: 'WebM (AV1)',
    codec: 'libaom-av1',
    audioCodec: 'libopus',
    description: 'Best compression, very slow encoding',
  },
  avi: {
    ext: '.avi',
    type: 'video',
    label: 'AVI',
    codec: 'libxvid',
    audioCodec: 'libmp3lame',
    description: 'Legacy format, widely supported',
  },
  mov: {
    ext: '.mov',
    type: 'video',
    label: 'MOV (QuickTime)',
    codec: 'libx264',
    audioCodec: 'aac',
    description: 'Apple QuickTime format',
  },
  wmv: {
    ext: '.wmv',
    type: 'video',
    label: 'WMV (Windows Media)',
    codec: 'wmv2',
    audioCodec: 'wmav2',
    description: 'Windows Media format',
  },
  flv: {
    ext: '.flv',
    type: 'video',
    label: 'FLV (Flash Video)',
    codec: 'flv1',
    audioCodec: 'libmp3lame',
    description: 'Flash video format (legacy)',
  },
  gif: {
    ext: '.gif',
    type: 'video',
    label: 'GIF (Animated)',
    codec: 'gif',
    audioCodec: null,
    description: 'Animated image, no audio',
  },
  ts: {
    ext: '.ts',
    type: 'video',
    label: 'MPEG-TS',
    codec: 'libx264',
    audioCodec: 'aac',
    description: 'Transport stream for broadcasting',
  },

  // Audio Formats
  mp3: {
    ext: '.mp3',
    type: 'audio',
    label: 'MP3',
    codec: 'libmp3lame',
    description: 'Most compatible audio format',
  },
  aac: {
    ext: '.aac',
    type: 'audio',
    label: 'AAC',
    codec: 'aac',
    description: 'Better quality than MP3 at same bitrate',
  },
  m4a: {
    ext: '.m4a',
    type: 'audio',
    label: 'M4A (AAC)',
    codec: 'aac',
    description: 'AAC in MPEG-4 container',
  },
  wav: {
    ext: '.wav',
    type: 'audio',
    label: 'WAV (Lossless)',
    codec: 'pcm_s16le',
    description: 'Uncompressed audio, large files',
  },
  flac: {
    ext: '.flac',
    type: 'audio',
    label: 'FLAC (Lossless)',
    codec: 'flac',
    description: 'Lossless compression',
  },
  ogg: {
    ext: '.ogg',
    type: 'audio',
    label: 'OGG Vorbis',
    codec: 'libvorbis',
    description: 'Open audio format',
  },
  opus: {
    ext: '.opus',
    type: 'audio',
    label: 'Opus',
    codec: 'libopus',
    description: 'Best quality at low bitrates',
  },
  wma: {
    ext: '.wma',
    type: 'audio',
    label: 'WMA',
    codec: 'wmav2',
    description: 'Windows Media Audio',
  },
  aiff: {
    ext: '.aiff',
    type: 'audio',
    label: 'AIFF (Lossless)',
    codec: 'pcm_s16be',
    description: 'Apple uncompressed audio',
  },
  alac: {
    ext: '.m4a',
    type: 'audio',
    label: 'ALAC (Apple Lossless)',
    codec: 'alac',
    description: 'Apple lossless compression',
  },
};

// ==================== VIDEO QUALITY PRESETS ====================

export const VIDEO_QUALITY: Record<string, VideoQualityConfig> = {
  low: {
    label: 'Low (Fast, Small)',
    crf: 30,
    preset: 'faster',
    audioBitrate: '96k',
  },
  medium: {
    label: 'Medium (Balanced)',
    crf: 23,
    preset: 'medium',
    audioBitrate: '160k',
  },
  high: {
    label: 'High (Better Quality)',
    crf: 18,
    preset: 'slow',
    audioBitrate: '256k',
  },
  lossless: {
    label: 'Lossless (Very Large)',
    crf: 0,
    preset: 'veryslow',
    audioBitrate: '320k',
  },
};

// ==================== AUDIO QUALITY PRESETS ====================

export const AUDIO_QUALITY: Record<string, AudioQualityConfig> = {
  low: { label: 'Low (96 kbps)', bitrate: '96k' },
  medium: { label: 'Medium (192 kbps)', bitrate: '192k' },
  high: { label: 'High (320 kbps)', bitrate: '320k' },
  lossless: { label: 'Lossless', bitrate: null },
};

// ==================== RESOLUTION PRESETS ====================

export const RESOLUTIONS: Record<string, ResolutionConfig> = {
  original: { label: 'Original', scale: null },
  '4k': { label: '4K (2160p)', scale: '3840:-2', width: 3840 },
  '1440p': { label: '1440p (QHD)', scale: '2560:-2', width: 2560 },
  '1080p': { label: '1080p (Full HD)', scale: '1920:-2', width: 1920 },
  '720p': { label: '720p (HD)', scale: '1280:-2', width: 1280 },
  '480p': { label: '480p (SD)', scale: '854:-2', width: 854 },
  '360p': { label: '360p (Mobile)', scale: '640:-2', width: 640 },
  '240p': { label: '240p (Low)', scale: '426:-2', width: 426 },
};

// ==================== FRAME RATE PRESETS ====================

export const FRAME_RATES: Record<string, FrameRateConfig> = {
  original: { label: 'Original', fps: null },
  '60': { label: '60 FPS (Smooth)', fps: 60 },
  '30': { label: '30 FPS (Standard)', fps: 30 },
  '24': { label: '24 FPS (Film)', fps: 24 },
  '15': { label: '15 FPS (GIF)', fps: 15 },
  '10': { label: '10 FPS (Low)', fps: 10 },
};

// ==================== HELPER FUNCTIONS ====================

export function getVideoFormats(): [string, FormatConfig][] {
  return Object.entries(FORMATS).filter(([_, config]) => config.type === 'video');
}

export function getAudioFormats(): [string, FormatConfig][] {
  return Object.entries(FORMATS).filter(([_, config]) => config.type === 'audio');
}

export function getFormatByExt(ext: string): FormatConfig | undefined {
  const normalizedExt = ext.toLowerCase().startsWith('.') ? ext.toLowerCase() : `.${ext.toLowerCase()}`;
  return Object.values(FORMATS).find((f) => f.ext === normalizedExt);
}

export function isVideoFormat(formatKey: string): boolean {
  return FORMATS[formatKey]?.type === 'video';
}

export function isAudioFormat(formatKey: string): boolean {
  return FORMATS[formatKey]?.type === 'audio';
}
