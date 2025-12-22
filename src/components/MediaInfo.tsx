// Media info display component

import { useTheme } from '../hooks/useTheme';
import type { MediaInfo } from '../types/ffmpeg';
import { formatBytes, formatBitrate } from '../utils/formatBytes';
import { formatDurationShort } from '../utils/formatTime';

interface MediaInfoDisplayProps {
  mediaInfo: MediaInfo | null;
  loading?: boolean;
  compact?: boolean;
}

export function MediaInfoDisplay({
  mediaInfo,
  loading = false,
  compact = false,
}: MediaInfoDisplayProps) {
  const { theme } = useTheme();

  if (loading) {
    return (
      <box style={{ padding: 1 }}>
        <text fg={theme.colors.textMuted}>Loading media info...</text>
      </box>
    );
  }

  if (!mediaInfo) {
    return null;
  }

  const InfoItem = ({ label, value }: { label: string; value: string }) => (
    <box style={{ flexDirection: 'row', gap: 1 }}>
      <text fg={theme.colors.textMuted}>{label}:</text>
      <text fg={theme.colors.text}>{value}</text>
    </box>
  );

  if (compact) {
    const parts: string[] = [];
    if (mediaInfo.hasVideo && mediaInfo.width && mediaInfo.height) {
      parts.push(`${mediaInfo.width}x${mediaInfo.height}`);
    }
    if (mediaInfo.duration > 0) {
      parts.push(formatDurationShort(mediaInfo.duration));
    }
    parts.push(formatBytes(mediaInfo.size));

    return (
      <text fg={theme.colors.textMuted}>
        {parts.join(' • ')}
      </text>
    );
  }

  return (
    <box
      style={{
        border: true,
        borderColor: theme.colors.border,
        padding: 1,
        flexDirection: 'column',
        gap: 0,
      }}
      title="Media Info"
    >
      <InfoItem label="Duration" value={formatDurationShort(mediaInfo.duration)} />
      <InfoItem label="Size" value={formatBytes(mediaInfo.size)} />

      {mediaInfo.hasVideo && (
        <>
          {mediaInfo.width && mediaInfo.height && (
            <InfoItem label="Resolution" value={`${mediaInfo.width}x${mediaInfo.height}`} />
          )}
          {mediaInfo.fps && <InfoItem label="Frame Rate" value={`${mediaInfo.fps.toFixed(2)} fps`} />}
          {mediaInfo.videoCodec && <InfoItem label="Video Codec" value={mediaInfo.videoCodec} />}
        </>
      )}

      {mediaInfo.hasAudio && mediaInfo.audioCodec && (
        <InfoItem label="Audio Codec" value={mediaInfo.audioCodec} />
      )}

      {mediaInfo.bitrate && (
        <InfoItem label="Bitrate" value={formatBitrate(mediaInfo.bitrate)} />
      )}

      <InfoItem label="Format" value={mediaInfo.format} />
    </box>
  );
}
