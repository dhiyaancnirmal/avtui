// Quality selector component

import type { SelectOption } from '@opentui/core';
import type { QualityLevel } from '../types/conversion';
import { VIDEO_QUALITY, AUDIO_QUALITY } from '../ffmpeg/presets';
import { useTheme } from '../hooks/useTheme';

interface QualitySelectProps {
  value: QualityLevel;
  onChange: (quality: QualityLevel) => void;
  focused?: boolean;
  type?: 'video' | 'audio';
}

export function QualitySelect({
  value,
  onChange,
  type = 'video',
}: QualitySelectProps) {
  const { theme } = useTheme();

  const qualities = type === 'video' ? VIDEO_QUALITY : AUDIO_QUALITY;

  const options: SelectOption[] = Object.entries(qualities).map(([key, config]) => ({
    name: config.label,
    description: '',
    value: key,
  }));

  return (
    <box
      style={{
        width: '100%',
        border: true,
        borderColor: focused ? theme.colors.borderFocus : theme.colors.border,
        height: 7,
      }}
      title="Quality"
    >
      <select
        options={options}
        focused={focused}
        onChange={(_index, option) => {
          if (option?.value) {
            onChange(option.value as QualityLevel);
          }
        }}
        style={{ height: 5 }}
      />
    </box>
  );
}
