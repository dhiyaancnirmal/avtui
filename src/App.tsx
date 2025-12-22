// Main application component with screen routing and state management

import { useState, useCallback } from 'react';
import { useKeyboard } from '@opentui/react';
import { ThemeProvider } from './hooks/useTheme';
import { useConversion } from './hooks/useConversion';
import { useMediaInfo } from './hooks/useMediaInfo';
import {
  WelcomeScreen,
  FileSelectScreen,
  SettingsScreen,
  ConversionScreen,
  SuccessScreen,
  ErrorScreen,
  type ConversionSettings,
} from './screens';
import { ThemeSelector } from './components/ThemeSelector';
import type { ScreenName } from './types/screens';
import type { FileInfo } from './types/conversion';
import type { ThemeId } from './types/theme';

interface AppProps {
  ffmpegVersion?: string;
  initialTheme?: ThemeId;
}

export function App({ ffmpegVersion, initialTheme = 'opencode' }: AppProps) {
  // Screen navigation state
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('welcome');
  const [screenHistory, setScreenHistory] = useState<ScreenName[]>([]);

  // Application state
  const [selectedFiles, setSelectedFiles] = useState<FileInfo[]>([]);
  const [showThemeSelector, setShowThemeSelector] = useState(false);

  // Conversion hook
  const conversion = useConversion();

  // Get media info for first selected file (for duration)
  const { mediaInfo } = useMediaInfo(
    selectedFiles.length > 0 ? selectedFiles[0].path : null
  );

  // Navigation handlers
  const navigate = useCallback((screen: ScreenName) => {
    setScreenHistory((prev) => [...prev, currentScreen]);
    setCurrentScreen(screen);
  }, [currentScreen]);

  const goBack = useCallback(() => {
    if (screenHistory.length > 0) {
      const previousScreen = screenHistory[screenHistory.length - 1];
      setScreenHistory((prev) => prev.slice(0, -1));
      setCurrentScreen(previousScreen);
    } else {
      setCurrentScreen('welcome');
    }
  }, [screenHistory]);

  const quit = useCallback(() => {
    process.exit(0);
  }, []);

  // File selection handler
  const handleFilesSelected = useCallback((files: FileInfo[]) => {
    setSelectedFiles(files);
  }, []);

  // Start conversion handler
  const handleStartConversion = useCallback(
    (settings: ConversionSettings) => {
      conversion.setFormat(settings.format);
      conversion.setQuality(settings.quality);
      conversion.setResolution(settings.resolution);
      conversion.setFrameRate(settings.frameRate);
      conversion.setRemoveAudio(settings.removeAudio);
      conversion.setRemoveVideo(settings.removeVideo);
      conversion.setOutputDirectory(settings.outputDirectory);

      // Start the conversion
      const filePaths = selectedFiles.map((f) => f.path);
      conversion.startConversion(filePaths);
    },
    [conversion, selectedFiles]
  );

  // Retry handler
  const handleRetry = useCallback(() => {
    conversion.reset();
    const filePaths = selectedFiles.map((f) => f.path);
    conversion.startConversion(filePaths);
  }, [conversion, selectedFiles]);

  // New conversion handler
  const handleNewConversion = useCallback(() => {
    conversion.reset();
    setSelectedFiles([]);
  }, [conversion]);

  // Cancel conversion handler
  const handleCancelConversion = useCallback(() => {
    conversion.cancel();
  }, [conversion]);

  // Global keyboard handler for theme selector
  useKeyboard((key) => {
    if (key.name === 't' && !showThemeSelector && currentScreen === 'welcome') {
      setShowThemeSelector(true);
    } else if (key.name === 'escape' && showThemeSelector) {
      setShowThemeSelector(false);
    }
  });

  // Common screen props
  const screenProps = {
    onNavigate: navigate,
    onBack: goBack,
    onQuit: quit,
  };

  // Render the current screen
  const renderScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return <WelcomeScreen {...screenProps} ffmpegVersion={ffmpegVersion} />;

      case 'file-select':
        return (
          <FileSelectScreen
            {...screenProps}
            onFilesSelected={handleFilesSelected}
          />
        );

      case 'settings':
        return (
          <SettingsScreen
            {...screenProps}
            selectedFiles={selectedFiles}
            onStartConversion={handleStartConversion}
          />
        );

      case 'converting':
        return (
          <ConversionScreen
            {...screenProps}
            files={selectedFiles}
            currentFileIndex={conversion.currentFileIndex}
            status={conversion.status}
            progress={conversion.progress}
            totalDuration={mediaInfo?.duration ?? 0}
            command={conversion.command}
            onCancel={handleCancelConversion}
          />
        );

      case 'success':
        return (
          <SuccessScreen
            {...screenProps}
            results={conversion.results}
            onNewConversion={handleNewConversion}
          />
        );

      case 'error':
        return (
          <ErrorScreen
            {...screenProps}
            error={conversion.error}
            onRetry={handleRetry}
          />
        );

      default:
        return <WelcomeScreen {...screenProps} ffmpegVersion={ffmpegVersion} />;
    }
  };

  return (
    <ThemeProvider initialTheme={initialTheme}>
      <box style={{ width: '100%', height: '100%', position: 'relative' }}>
        {renderScreen()}

        {/* Theme selector overlay */}
        {showThemeSelector && (
          <ThemeSelector onClose={() => setShowThemeSelector(false)} />
        )}
      </box>
    </ThemeProvider>
  );
}
