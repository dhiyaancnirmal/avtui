#!/usr/bin/env node
// avtui - A beautiful TUI wrapper for FFmpeg media conversion
// Entry point

import { createCliRenderer } from '@opentui/core';
import { createRoot } from '@opentui/react';
import { App } from './App';
import { checkFFmpegInstallation, getInstallInstructions } from './ffmpeg/check';

async function main() {
  // Check for FFmpeg installation
  console.log('Checking for FFmpeg...');
  const ffmpegStatus = await checkFFmpegInstallation();

  if (!ffmpegStatus.installed) {
    console.error('\n❌ FFmpeg Not Found\n');
    console.error(getInstallInstructions());
    process.exit(1);
  }

  console.log(`✓ Found FFmpeg ${ffmpegStatus.version}`);
  console.log('Starting avtui...\n');

  // Small delay to show the message before clearing for TUI
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Create the CLI renderer and render the app
  const renderer = await createCliRenderer({
    exitOnCtrlC: true,
  });
  
  createRoot(renderer).render(<App ffmpegVersion={ffmpegStatus.version ?? undefined} />);
}

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error.message);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
  process.exit(1);
});

// Run
main().catch((error) => {
  console.error('Fatal error:', error.message);
  process.exit(1);
});
