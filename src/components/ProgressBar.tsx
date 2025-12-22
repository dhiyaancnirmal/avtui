// Progress bar component

import { useTheme } from '../hooks/useTheme';
import type { ProgressInfo } from '../types/ffmpeg';
import { formatDurationShort, formatETA } from '../utils/formatTime';

interface ProgressBarProps {
  progress: ProgressInfo | null;
  totalDuration: number;
  width?: number;
  showStats?: boolean;
}

export function ProgressBar({
  progress,
  totalDuration,
  width = 50,
  showStats = true,
}: ProgressBarProps) {
  const { theme } = useTheme();

  const percent = progress?.percent ?? 0;
  const filledWidth = Math.floor((percent / 100) * width);
  const emptyWidth = width - filledWidth;

  const filled = '█'.repeat(filledWidth);
  const empty = '░'.repeat(emptyWidth);

  return (
    <box style={{ width: '100%', flexDirection: 'column', gap: 1 }}>
      {/* Progress bar */}
      <box style={{ flexDirection: 'row', alignItems: 'center', gap: 1 }}>
        <text fg={theme.colors.progressBar}>{filled}</text>
        <text fg={theme.colors.progressTrack}>{empty}</text>
        <text fg={theme.colors.text}>
          <strong>{percent.toFixed(1)}%</strong>
        </text>
      </box>

      {/* Stats row */}
      {showStats && progress && (
        <box
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <text fg={theme.colors.textMuted}>
            {formatDurationShort(progress.time)} / {formatDurationShort(totalDuration)}
          </text>

          <box style={{ flexDirection: 'row', gap: 2 }}>
            {progress.speed && (
              <text fg={theme.colors.accent}>
                Speed: <span fg={theme.colors.text}>{progress.speed}</span>
              </text>
            )}
            {progress.fps && progress.fps > 0 && (
              <text fg={theme.colors.accent}>
                FPS: <span fg={theme.colors.text}>{progress.fps.toFixed(0)}</span>
              </text>
            )}
            {progress.eta !== undefined && progress.eta > 0 && (
              <text fg={theme.colors.accent}>
                ETA: <span fg={theme.colors.text}>{formatETA(progress.eta)}</span>
              </text>
            )}
          </box>
        </box>
      )}
    </box>
  );
}
