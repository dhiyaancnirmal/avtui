// Settings screen for conversion options

import { useState } from 'react';
import { useKeyboard } from '@opentui/react';
import { useTheme } from '../hooks/useTheme';
import { useMediaInfo } from '../hooks/useMediaInfo';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { MediaInfoDisplay } from '../components/MediaInfo';
import { FORMATS, VIDEO_QUALITY, AUDIO_QUALITY, RESOLUTIONS, FRAME_RATES } from '../ffmpeg/presets';
import type { ScreenProps } from '../types/screens';
import type { FileInfo, QualityLevel, ResolutionPreset, FrameRatePreset, TrimConfig } from '../types/conversion';
import { getFileNameWithoutExt, shortenPath, dirname } from '../utils/path';
import { basename } from 'node:path';

interface SettingsScreenProps extends ScreenProps {
  selectedFiles: FileInfo[];
  onStartConversion: (config: ConversionSettings) => void;
}

export interface ConversionSettings {
  format: string;
  quality: QualityLevel;
  resolution: ResolutionPreset;
  frameRate: FrameRatePreset;
  trim: TrimConfig;
  removeAudio: boolean;
  removeVideo: boolean;
  outputDirectory: string;
}

type SettingField =
  | 'format'
  | 'quality'
  | 'resolution'
  | 'frameRate'
  | 'removeAudio'
  | 'removeVideo'
  | 'outputDir';

const FIELDS: SettingField[] = [
  'format',
  'quality',
  'resolution',
  'frameRate',
  'removeAudio',
  'removeVideo',
  'outputDir',
];

interface FieldOption {
  name: string;
  description: string;
  value: string;
}

export function SettingsScreen({
  onNavigate,
  onBack,
  selectedFiles,
  onStartConversion,
  disabled,
}: SettingsScreenProps) {
  const { theme } = useTheme();

  // Settings state
  const [format, setFormat] = useState('mp4');
  const [quality, setQuality] = useState<QualityLevel>('medium');
  const [resolution, setResolution] = useState<ResolutionPreset>('original');
  const [frameRate, setFrameRate] = useState<FrameRatePreset>('original');
  const [removeAudio, setRemoveAudio] = useState(false);
  const [removeVideo, setRemoveVideo] = useState(false);
  const [outputDirectory, setOutputDirectory] = useState(() => {
    if (selectedFiles.length > 0) {
      return dirname(selectedFiles[0].path);
    }
    return process.cwd();
  });

  // UI state
  const [focusedField, setFocusedField] = useState(0);
  const [expandedField, setExpandedField] = useState<SettingField | null>(null);
  const [optionIndex, setOptionIndex] = useState(0);

  // Get media info for first file
  const { mediaInfo, loading: mediaLoading } = useMediaInfo(
    selectedFiles.length > 0 ? selectedFiles[0].path : null
  );

  // Determine if we're working with video or audio
  const isVideoInput = mediaInfo?.hasVideo ?? true;
  const formatType = FORMATS[format]?.type ?? 'video';

  // Get options for current field
  const getFieldOptions = (field: SettingField): FieldOption[] => {
    switch (field) {
      case 'format':
        return Object.entries(FORMATS).map(([key, config]) => ({
          name: config.label,
          value: key,
          description: config.description || '',
        }));
      case 'quality':
        const qualities = formatType === 'video' ? VIDEO_QUALITY : AUDIO_QUALITY;
        return Object.entries(qualities).map(([key, config]) => ({
          name: config.label,
          value: key,
          description: '',
        }));
      case 'resolution':
        return Object.entries(RESOLUTIONS).map(([key, config]) => ({
          name: config.label,
          value: key,
          description: '',
        }));
      case 'frameRate':
        return Object.entries(FRAME_RATES).map(([key, config]) => ({
          name: config.label,
          value: key,
          description: '',
        }));
      default:
        return [];
    }
  };

  const getCurrentValue = (field: SettingField): string => {
    switch (field) {
      case 'format':
        return FORMATS[format]?.label ?? format;
      case 'quality':
        const qualities = formatType === 'video' ? VIDEO_QUALITY : AUDIO_QUALITY;
        return qualities[quality]?.label ?? quality;
      case 'resolution':
        return RESOLUTIONS[resolution]?.label ?? resolution;
      case 'frameRate':
        return FRAME_RATES[frameRate]?.label ?? frameRate;
      case 'removeAudio':
        return removeAudio ? 'Yes' : 'No';
      case 'removeVideo':
        return removeVideo ? 'Yes (Audio only)' : 'No';
      case 'outputDir':
        return shortenPath(outputDirectory, 40);
      default:
        return '';
    }
  };

  const handleKeyboard = (key: { name: string; shift?: boolean }) => {
    if (disabled) return;

    const currentField = FIELDS[focusedField];

    if (expandedField) {
      // We're in a dropdown
      const options = getFieldOptions(expandedField);

      switch (key.name) {
        case 'up':
        case 'k':
          setOptionIndex((prev) => Math.max(0, prev - 1));
          break;
        case 'down':
        case 'j':
          setOptionIndex((prev) => Math.min(options.length - 1, prev + 1));
          break;
        case 'return':
        case 'space':
          const selected = options[optionIndex];
          if (selected?.value) {
            switch (expandedField) {
              case 'format':
                setFormat(selected.value as string);
                break;
              case 'quality':
                setQuality(selected.value as QualityLevel);
                break;
              case 'resolution':
                setResolution(selected.value as ResolutionPreset);
                break;
              case 'frameRate':
                setFrameRate(selected.value as FrameRatePreset);
                break;
            }
          }
          setExpandedField(null);
          break;
        case 'escape':
          setExpandedField(null);
          break;
      }
      return;
    }

    // Main navigation
    switch (key.name) {
      case 'up':
      case 'k':
        setFocusedField((prev) => Math.max(0, prev - 1));
        break;
      case 'down':
      case 'j':
        setFocusedField((prev) => Math.min(FIELDS.length - 1, prev + 1));
        break;
      case 'tab':
        if (key.shift) {
          setFocusedField((prev) => (prev > 0 ? prev - 1 : FIELDS.length - 1));
        } else {
          setFocusedField((prev) => (prev < FIELDS.length - 1 ? prev + 1 : 0));
        }
        break;
      case 'return':
      case 'space':
        if (currentField === 'removeAudio') {
          setRemoveAudio((prev) => !prev);
        } else if (currentField === 'removeVideo') {
          setRemoveVideo((prev) => !prev);
        } else if (currentField !== 'outputDir') {
          const options = getFieldOptions(currentField);
          const currentValue =
            currentField === 'format'
              ? format
              : currentField === 'quality'
                ? quality
                : currentField === 'resolution'
                  ? resolution
                  : frameRate;
          setOptionIndex(options.findIndex((o) => o.value === currentValue) || 0);
          setExpandedField(currentField);
        }
        break;
      case 'escape':
        onBack();
        break;
      case 's':
        // Start conversion
        onStartConversion({
          format,
          quality,
          resolution,
          frameRate,
          trim: { enabled: false, startTime: null, endTime: null },
          removeAudio,
          removeVideo,
          outputDirectory,
        });
        onNavigate('converting');
        break;
    }
  };

  useKeyboard(handleKeyboard);

  const renderField = (field: SettingField, index: number) => {
    const isFocused = focusedField === index;
    const isExpanded = expandedField === field;
    const value = getCurrentValue(field);

    const labels: Record<SettingField, string> = {
      format: 'Output Format',
      quality: 'Quality',
      resolution: 'Resolution',
      frameRate: 'Frame Rate',
      removeAudio: 'Remove Audio',
      removeVideo: 'Extract Audio Only',
      outputDir: 'Output Directory',
    };

    // Skip resolution and frameRate for audio-only formats
    if ((field === 'resolution' || field === 'frameRate') && formatType === 'audio') {
      return null;
    }

    // Skip removeVideo if input has no video
    if (field === 'removeVideo' && !isVideoInput) {
      return null;
    }

    return (
      <box
        key={field}
        style={{
          width: '100%',
          height: isExpanded ? 8 : 1,
          flexDirection: 'column',
          backgroundColor: isFocused ? theme.colors.highlight : 'transparent',
          paddingLeft: 1,
          paddingRight: 1,
        }}
      >
        <box style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <text fg={isFocused ? theme.colors.primary : theme.colors.text}>
            {isFocused ? '› ' : '  '}
            {labels[field]}
          </text>
          <text fg={isFocused ? theme.colors.accent : theme.colors.textMuted}>
            {value} {field !== 'outputDir' && field !== 'removeAudio' && field !== 'removeVideo' ? '▼' : ''}
          </text>
        </box>

        {isExpanded && (
          <box
            style={{
              marginTop: 1,
              marginLeft: 2,
              border: true,
              borderColor: theme.colors.borderFocus,
              height: 6,
              overflow: 'hidden',
            }}
          >
            {getFieldOptions(field).map((option, i) => (
              <box
                key={option.value}
                style={{
                  backgroundColor: i === optionIndex ? theme.colors.selection : 'transparent',
                  paddingLeft: 1,
                }}
              >
                <text fg={i === optionIndex ? theme.colors.selectionText : theme.colors.text}>
                  {option.name}
                </text>
              </box>
            ))}
          </box>
        )}
      </box>
    );
  };

  return (
    <box
      style={{
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        backgroundColor: theme.colors.background,
      }}
    >
      <Header compact title="Conversion Settings" />

      <box style={{ flexGrow: 1, padding: 1, flexDirection: 'row', gap: 2 }}>
        {/* Left panel: Settings */}
        <box style={{ flexGrow: 1, flexDirection: 'column' }}>
          <box
            style={{
              border: true,
              borderColor: theme.colors.border,
              padding: 1,
              marginBottom: 1,
            }}
            title={`Input (${selectedFiles.length} file${selectedFiles.length > 1 ? 's' : ''})`}
          >
            {selectedFiles.slice(0, 3).map((file, i) => (
              <text key={file.path} fg={theme.colors.textMuted}>
                {i + 1}. {basename(file.path)}
              </text>
            ))}
            {selectedFiles.length > 3 && (
              <text fg={theme.colors.textMuted}>... and {selectedFiles.length - 3} more</text>
            )}
          </box>

          <box
            style={{
              border: true,
              borderColor: expandedField ? theme.colors.border : theme.colors.borderFocus,
              flexGrow: 1,
              flexDirection: 'column',
            }}
            title="Settings"
          >
            {FIELDS.map((field, index) => renderField(field, index))}
          </box>
        </box>

        {/* Right panel: Media info */}
        <box style={{ width: 35, flexDirection: 'column' }}>
          <MediaInfoDisplay mediaInfo={mediaInfo} loading={mediaLoading} />

          <box
            style={{
              marginTop: 1,
              padding: 1,
              border: true,
              borderColor: theme.colors.success,
              alignItems: 'center',
            }}
          >
            <text fg={theme.colors.success}>
              <strong>Press S to start conversion</strong>
            </text>
          </box>
        </box>
      </box>

      <Footer
        bindings={[
          { key: '↑↓', label: 'Navigate' },
          { key: 'Enter', label: 'Select' },
          { key: 's', label: 'Start' },
          { key: 'Esc', label: 'Back' },
          { key: 'q', label: 'Quit' },
        ]}
      />
    </box>
  );
}
