// FFmpeg process runner with progress tracking

import { execa, type ResultPromise } from 'execa';
import type { ConversionConfig, ConversionResult, ConversionStatus } from '../types/conversion';
import type { ProgressInfo } from '../types/ffmpeg';
import { buildFFmpegCommand, commandToString } from './buildCommand';
import { parseProgressLine, parseErrorOutput, isProgressComplete, hasError } from './progressParser';
import { getMediaDuration } from './probe';
import { stat } from 'node:fs/promises';

export interface ConversionCallbacks {
  onProgress?: (progress: ProgressInfo) => void;
  onStart?: (command: string) => void;
  onComplete?: (result: ConversionResult) => void;
  onError?: (error: string) => void;
  onCancel?: () => void;
}

interface ActiveConversion {
  process: ResultPromise;
  config: ConversionConfig;
  startTime: number;
  aborted: boolean;
}

let activeConversion: ActiveConversion | null = null;

/**
 * Run an FFmpeg conversion with progress tracking
 */
export async function runConversion(
  config: ConversionConfig,
  callbacks: ConversionCallbacks = {}
): Promise<ConversionResult> {
  const startTime = Date.now();

  // Build the FFmpeg command
  const command = buildFFmpegCommand(config);

  // Get input duration for progress calculation
  const duration = await getMediaDuration(config.inputPath);

  // Notify start
  callbacks.onStart?.(commandToString(command));

  // Spawn FFmpeg process
  const ffmpegProcess = execa('ffmpeg', command.args, {
    reject: false,
    buffer: false,
    stdin: 'ignore',
    stdout: 'pipe',
    stderr: 'pipe',
  });

  activeConversion = {
    process: ffmpegProcess,
    config,
    startTime,
    aborted: false,
  };

  let stderrBuffer = '';
  let lastProgress: ProgressInfo | null = null;

  // Parse stderr for progress
  if (ffmpegProcess.stderr) {
    ffmpegProcess.stderr.on('data', (chunk: Buffer) => {
      const text = chunk.toString();
      stderrBuffer += text;

      // Parse each line for progress info
      const lines = text.split(/[\r\n]+/);
      for (const line of lines) {
        if (!line.trim()) continue;

        const progress = parseProgressLine(line, duration);
        if (progress && progress.time > (lastProgress?.time || 0)) {
          lastProgress = progress;
          callbacks.onProgress?.(progress);
        }

        if (isProgressComplete(line)) {
          callbacks.onProgress?.({
            time: duration,
            percent: 100,
            speed: lastProgress?.speed,
            fps: lastProgress?.fps,
          });
        }
      }
    });
  }

  try {
    // Wait for process to complete
    const result = await ffmpegProcess;

    // Check if cancelled
    if (activeConversion?.aborted) {
      callbacks.onCancel?.();
      return {
        inputPath: config.inputPath,
        outputPath: config.outputPath,
        status: 'cancelled',
        duration: Date.now() - startTime,
        outputSize: 0,
      };
    }

    // Check for errors
    if (result.exitCode !== 0 || hasError(stderrBuffer)) {
      const errorMessage = parseErrorOutput(stderrBuffer);
      callbacks.onError?.(errorMessage);

      return {
        inputPath: config.inputPath,
        outputPath: config.outputPath,
        status: 'failed',
        duration: Date.now() - startTime,
        outputSize: 0,
        error: errorMessage,
      };
    }

    // Get output file size
    let outputSize = 0;
    try {
      const stats = await stat(config.outputPath);
      outputSize = stats.size;
    } catch {
      // File might not exist if conversion failed
    }

    const conversionResult: ConversionResult = {
      inputPath: config.inputPath,
      outputPath: config.outputPath,
      status: 'completed',
      duration: Date.now() - startTime,
      outputSize,
    };

    callbacks.onComplete?.(conversionResult);
    return conversionResult;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    callbacks.onError?.(errorMessage);

    return {
      inputPath: config.inputPath,
      outputPath: config.outputPath,
      status: 'failed',
      duration: Date.now() - startTime,
      outputSize: 0,
      error: errorMessage,
    };
  } finally {
    activeConversion = null;
  }
}

/**
 * Cancel the current conversion
 */
export function cancelConversion(): boolean {
  if (activeConversion && !activeConversion.aborted) {
    activeConversion.aborted = true;
    activeConversion.process.kill('SIGTERM');

    // Force kill after 2 seconds if still running
    setTimeout(() => {
      if (activeConversion?.process) {
        activeConversion.process.kill('SIGKILL');
      }
    }, 2000);

    return true;
  }
  return false;
}

/**
 * Check if a conversion is currently running
 */
export function isConversionRunning(): boolean {
  return activeConversion !== null && !activeConversion.aborted;
}

/**
 * Get current conversion status
 */
export function getConversionStatus(): ConversionStatus {
  if (!activeConversion) return 'idle';
  if (activeConversion.aborted) return 'cancelled';
  return 'converting';
}
