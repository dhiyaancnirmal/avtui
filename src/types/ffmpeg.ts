// FFmpeg-related type definitions

export interface FFmpegStatus {
  installed: boolean;
  version: string | null;
  ffmpegPath: string | null;
  ffprobePath: string | null;
}

export interface MediaInfo {
  duration: number; // seconds
  width?: number;
  height?: number;
  fps?: number;
  videoCodec?: string;
  audioCodec?: string;
  bitrate?: number;
  size: number; // bytes
  format: string;
  hasVideo: boolean;
  hasAudio: boolean;
}

export interface ProgressInfo {
  time: number; // current position in seconds
  percent: number; // 0-100
  speed?: string; // e.g., "1.5x"
  fps?: number;
  bitrate?: string;
  size?: string;
  frame?: number;
  eta?: number; // estimated seconds remaining
}

export type FormatType = 'video' | 'audio';

export interface FormatConfig {
  ext: string;
  type: FormatType;
  label: string;
  codec: string;
  audioCodec?: string | null;
  description?: string;
}

export interface VideoQualityConfig {
  label: string;
  crf: number;
  preset: string;
  audioBitrate: string;
}

export interface AudioQualityConfig {
  label: string;
  bitrate: string | null;
}

export interface ResolutionConfig {
  label: string;
  scale: string | null;
  width?: number;
  height?: number;
}

export interface FrameRateConfig {
  label: string;
  fps: number | null;
}
