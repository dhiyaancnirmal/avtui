// Conversion configuration types

import type { FormatType } from './ffmpeg';

export type QualityLevel = 'low' | 'medium' | 'high' | 'lossless';
export type ResolutionPreset = 'original' | '4k' | '1080p' | '720p' | '480p' | '360p';
export type FrameRatePreset = 'original' | '60' | '30' | '24' | '15';

export interface TrimConfig {
  enabled: boolean;
  startTime: string | null; // HH:MM:SS.ms format
  endTime: string | null;
}

export interface ConversionConfig {
  inputPath: string;
  outputPath: string;
  format: string;
  quality: QualityLevel;
  resolution: ResolutionPreset;
  frameRate: FrameRatePreset;
  trim: TrimConfig;
  removeAudio: boolean;
  removeVideo: boolean; // Extract audio only
  customArgs: string[]; // Additional ffmpeg arguments
}

export interface BatchConversionConfig {
  files: ConversionConfig[];
  outputDirectory: string;
  preserveStructure: boolean;
}

export type ConversionStatus = 
  | 'idle'
  | 'preparing'
  | 'converting'
  | 'paused'
  | 'completed'
  | 'failed'
  | 'cancelled';

export interface ConversionResult {
  inputPath: string;
  outputPath: string;
  status: ConversionStatus;
  duration: number; // conversion time in ms
  outputSize: number; // bytes
  error?: string;
}

export interface FileInfo {
  name: string;
  path: string;
  size: number;
  isDirectory: boolean;
  isHidden: boolean;
  extension: string;
  isMediaFile: boolean;
  mediaType?: FormatType;
  modifiedAt: Date;
}

export interface UserConfig {
  theme: string;
  lastDirectory: string;
  lastOutputDirectory: string;
  defaultFormat: string;
  defaultQuality: QualityLevel;
  defaultResolution: ResolutionPreset;
  defaultFrameRate: FrameRatePreset;
  showHiddenFiles: boolean;
  confirmBeforeConvert: boolean;
  openOutputOnComplete: boolean;
}
