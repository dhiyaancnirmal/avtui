// Format selector component

import type { SelectOption } from '@opentui/core';
import { useTheme } from '../hooks/useTheme';
import { FORMATS, getVideoFormats, getAudioFormats } from '../ffmpeg/presets';

interface FormatSelectProps {
  value: string;
  onChange: (format: string) => void;
  focused?: boolean;
  type?: 'all' | 'video' | 'audio';
}

export function FormatSelect({
  value,
  onChange,
  focused = false,
  type = 'all',
}: FormatSelectProps) {
  const { theme } = useTheme();

  let formats: [string, (typeof FORMATS)[string]][];
  switch (type) {
    case 'video':
      formats = getVideoFormats();
      break;
    case 'audio':
      formats = getAudioFormats();
      break;
    default:
      formats = Object.entries(FORMATS);
  }

  const options: SelectOption[] = formats.map(([key, config]) => ({
    name: config.label,
    value: key,
    description: config.description || `${config.ext} format`,
  }));

  const selectedIndex = formats.findIndex(([key]) => key === value);

  return (
    <box
      style={{
        width: '100%',
        border: true,
        borderColor: focused ? theme.colors.borderFocus : theme.colors.border,
        height: 10,
      }}
      title="Output Format"
    >
      <select
        options={options}
        focused={focused}
        onChange={(index, option) => {
          if (option?.value) {
            onChange(option.value as string);
          }
        }}
        style={{ height: 8 }}
      />
    </box>
  );
}
