// Media file detection utilities

import { getExtension } from './path';

// Video file extensions
export const VIDEO_EXTENSIONS = new Set([
  '.mp4',
  '.mkv',
  '.webm',
  '.avi',
  '.mov',
  '.wmv',
  '.flv',
  '.m4v',
  '.mpg',
  '.mpeg',
  '.3gp',
  '.3g2',
  '.ogv',
  '.ts',
  '.mts',
  '.m2ts',
  '.vob',
  '.divx',
  '.xvid',
  '.rm',
  '.rmvb',
  '.asf',
]);

// Audio file extensions
export const AUDIO_EXTENSIONS = new Set([
  '.mp3',
  '.aac',
  '.wav',
  '.flac',
  '.ogg',
  '.m4a',
  '.wma',
  '.opus',
  '.aiff',
  '.aif',
  '.ape',
  '.alac',
  '.dsd',
  '.dsf',
  '.dff',
  '.mka',
  '.ac3',
  '.dts',
  '.ra',
  '.mid',
  '.midi',
]);

// Image file extensions (for potential thumbnail/gif creation)
export const IMAGE_EXTENSIONS = new Set([
  '.jpg',
  '.jpeg',
  '.png',
  '.gif',
  '.bmp',
  '.webp',
  '.tiff',
  '.tif',
  '.svg',
  '.ico',
]);

/**
 * Check if file is a video file
 */
export function isVideoFile(filePath: string): boolean {
  const ext = getExtension(filePath);
  return VIDEO_EXTENSIONS.has(ext);
}

/**
 * Check if file is an audio file
 */
export function isAudioFile(filePath: string): boolean {
  const ext = getExtension(filePath);
  return AUDIO_EXTENSIONS.has(ext);
}

/**
 * Check if file is a media file (video or audio)
 */
export function isMediaFile(filePath: string): boolean {
  return isVideoFile(filePath) || isAudioFile(filePath);
}

/**
 * Check if file is an image
 */
export function isImageFile(filePath: string): boolean {
  const ext = getExtension(filePath);
  return IMAGE_EXTENSIONS.has(ext);
}

/**
 * Get media type from file path
 */
export function getMediaType(filePath: string): 'video' | 'audio' | 'image' | 'unknown' {
  if (isVideoFile(filePath)) return 'video';
  if (isAudioFile(filePath)) return 'audio';
  if (isImageFile(filePath)) return 'image';
  return 'unknown';
}

/**
 * Get icon for file type
 */
export function getFileIcon(filePath: string, isDirectory: boolean): string {
  if (isDirectory) return '📁';

  const type = getMediaType(filePath);
  switch (type) {
    case 'video':
      return '🎬';
    case 'audio':
      return '🎵';
    case 'image':
      return '🖼️';
    default:
      return '📄';
  }
}
