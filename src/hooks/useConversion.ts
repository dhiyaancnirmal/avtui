// Conversion state management hook

import { useState, useCallback, useRef } from 'react';
import type {
  ConversionConfig,
  ConversionResult,
  ConversionStatus,
  QualityLevel,
  ResolutionPreset,
  FrameRatePreset,
  TrimConfig,
} from '../types/conversion';
import type { ProgressInfo } from '../types/ffmpeg';
import { runConversion, cancelConversion } from '../ffmpeg/runner';
import { generateOutputPath } from '../utils/path';
import { FORMATS } from '../ffmpeg/presets';

interface UseConversionOptions {
  onProgress?: (progress: ProgressInfo, fileIndex: number) => void;
  onFileComplete?: (result: ConversionResult, fileIndex: number) => void;
  onAllComplete?: (results: ConversionResult[]) => void;
  onError?: (error: string, fileIndex: number) => void;
}

interface UseConversionReturn {
  // State
  status: ConversionStatus;
  progress: ProgressInfo | null;
  currentFileIndex: number;
  totalFiles: number;
  results: ConversionResult[];
  error: string | null;
  command: string | null;

  // Config
  format: string;
  quality: QualityLevel;
  resolution: ResolutionPreset;
  frameRate: FrameRatePreset;
  trim: TrimConfig;
  removeAudio: boolean;
  removeVideo: boolean;
  outputDirectory: string;

  // Actions
  setFormat: (format: string) => void;
  setQuality: (quality: QualityLevel) => void;
  setResolution: (resolution: ResolutionPreset) => void;
  setFrameRate: (frameRate: FrameRatePreset) => void;
  setTrim: (trim: TrimConfig) => void;
  setRemoveAudio: (remove: boolean) => void;
  setRemoveVideo: (remove: boolean) => void;
  setOutputDirectory: (dir: string) => void;

  // Conversion
  startConversion: (inputFiles: string[]) => Promise<ConversionResult[]>;
  cancel: () => void;
  reset: () => void;
}

export function useConversion(options: UseConversionOptions = {}): UseConversionReturn {
  // Conversion state
  const [status, setStatus] = useState<ConversionStatus>('idle');
  const [progress, setProgress] = useState<ProgressInfo | null>(null);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [totalFiles, setTotalFiles] = useState(0);
  const [results, setResults] = useState<ConversionResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [command, setCommand] = useState<string | null>(null);

  // Config state
  const [format, setFormat] = useState('mp4');
  const [quality, setQuality] = useState<QualityLevel>('medium');
  const [resolution, setResolution] = useState<ResolutionPreset>('original');
  const [frameRate, setFrameRate] = useState<FrameRatePreset>('original');
  const [trim, setTrim] = useState<TrimConfig>({
    enabled: false,
    startTime: null,
    endTime: null,
  });
  const [removeAudio, setRemoveAudio] = useState(false);
  const [removeVideo, setRemoveVideo] = useState(false);
  const [outputDirectory, setOutputDirectory] = useState('');

  const cancelledRef = useRef(false);

  const startConversion = useCallback(
    async (inputFiles: string[]): Promise<ConversionResult[]> => {
      if (inputFiles.length === 0) {
        return [];
      }

      cancelledRef.current = false;
      setStatus('preparing');
      setProgress(null);
      setResults([]);
      setError(null);
      setTotalFiles(inputFiles.length);
      setCurrentFileIndex(0);

      const formatConfig = FORMATS[format];
      const conversionResults: ConversionResult[] = [];

      for (let i = 0; i < inputFiles.length; i++) {
        if (cancelledRef.current) break;

        setCurrentFileIndex(i);
        setStatus('converting');
        setProgress(null);

        const inputPath = inputFiles[i];
        const outputDir = outputDirectory || require('node:path').dirname(inputPath);
        const outputPath = generateOutputPath(inputPath, outputDir, formatConfig.ext, '');

        const config: ConversionConfig = {
          inputPath,
          outputPath,
          format,
          quality,
          resolution,
          frameRate,
          trim,
          removeAudio,
          removeVideo,
          customArgs: [],
        };

        try {
          const result = await runConversion(config, {
            onStart: (cmd) => setCommand(cmd),
            onProgress: (prog) => {
              setProgress(prog);
              options.onProgress?.(prog, i);
            },
            onComplete: (res) => {
              options.onFileComplete?.(res, i);
            },
            onError: (err) => {
              setError(err);
              options.onError?.(err, i);
            },
          });

          conversionResults.push(result);
          setResults((prev) => [...prev, result]);
        } catch (err) {
          const errorResult: ConversionResult = {
            inputPath,
            outputPath,
            status: 'failed',
            duration: 0,
            outputSize: 0,
            error: err instanceof Error ? err.message : 'Unknown error',
          };
          conversionResults.push(errorResult);
          setResults((prev) => [...prev, errorResult]);
        }
      }

      // Determine final status
      const allSucceeded = conversionResults.every((r) => r.status === 'completed');
      const allFailed = conversionResults.every((r) => r.status === 'failed');

      if (cancelledRef.current) {
        setStatus('cancelled');
      } else if (allSucceeded) {
        setStatus('completed');
      } else if (allFailed) {
        setStatus('failed');
      } else {
        setStatus('completed'); // Some succeeded, some failed
      }

      options.onAllComplete?.(conversionResults);
      return conversionResults;
    },
    [format, quality, resolution, frameRate, trim, removeAudio, removeVideo, outputDirectory, options]
  );

  const cancel = useCallback(() => {
    cancelledRef.current = true;
    cancelConversion();
    setStatus('cancelled');
  }, []);

  const reset = useCallback(() => {
    setStatus('idle');
    setProgress(null);
    setCurrentFileIndex(0);
    setTotalFiles(0);
    setResults([]);
    setError(null);
    setCommand(null);
  }, []);

  return {
    // State
    status,
    progress,
    currentFileIndex,
    totalFiles,
    results,
    error,
    command,

    // Config
    format,
    quality,
    resolution,
    frameRate,
    trim,
    removeAudio,
    removeVideo,
    outputDirectory,

    // Config setters
    setFormat,
    setQuality,
    setResolution,
    setFrameRate,
    setTrim,
    setRemoveAudio,
    setRemoveVideo,
    setOutputDirectory,

    // Actions
    startConversion,
    cancel,
    reset,
  };
}
