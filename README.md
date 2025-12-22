# avtui

A beautiful terminal user interface (TUI) wrapper for FFmpeg media conversion. Convert videos and audio without remembering complex commands.

```
   ▄▀█ █░█ ▀█▀ █░█ █
   █▀█ ▀▄▀ ░█░ █▄█ █
```

<img width="1710" height="1069" alt="Screenshot 2025-12-22 at 5 19 29 PM" src="https://github.com/user-attachments/assets/d1801afc-513a-4c6b-9001-dea26710e01c" />

## Features

- **Easy Conversion**: Convert videos and audio to any format with a simple interface
- **Quality Control**: Adjust quality, resolution, and frame rate with presets
- **Batch Processing**: Convert multiple files at once
- **Audio Extraction**: Extract audio tracks from videos
- **Real-time Progress**: Watch conversion progress with speed, FPS, and ETA
- **Theme Support**: 6 built-in color themes including dark, light, dracula, nord, and more
- **Keyboard-Driven**: Full keyboard navigation for efficient workflow

## Requirements

- **Node.js** 18+ or **Bun** runtime
- **FFmpeg** installed and in PATH

## Installation

### Using npx (recommended)

```bash
npx avtui
```

### Using Bun

```bash
bunx avtui
```

### Install Globally

```bash
npm install -g avtui
avtui
```

### Install FFmpeg

If you don't have FFmpeg installed:

**macOS (Homebrew):**
```bash
brew install ffmpeg
```

**Ubuntu/Debian:**
```bash
sudo apt update && sudo apt install ffmpeg
```

**Fedora:**
```bash
sudo dnf install ffmpeg
```

**Arch Linux:**
```bash
sudo pacman -S ffmpeg
```

**Windows (winget):**
```bash
winget install ffmpeg
```

## Usage

1. **Start avtui**: Run `npx avtui` or `avtui`
2. **Select files**: Navigate to your media files and select them
3. **Configure settings**: Choose output format, quality, resolution, etc.
4. **Start conversion**: Press `S` to begin
5. **View results**: Check the output location when complete

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `↑/↓` or `j/k` | Navigate |
| `Enter` | Select/Open |
| `Space` | Toggle selection (multi-select mode) |
| `Backspace` | Go to parent directory |
| `m` | Toggle multi-select mode |
| `Ctrl+H` | Toggle hidden files |
| `t` | Change theme |
| `s` | Start conversion |
| `Esc` | Go back |
| `q` | Quit |

## Supported Formats

### Video Formats
- MP4, MKV, WebM, AVI, MOV, WMV, FLV
- 3GP, MPEG, OGV, TS

### Audio Formats  
- MP3, AAC, WAV, FLAC, OGG, Opus, M4A

### Quality Presets
- **Low**: Fast conversion, smaller file size
- **Medium**: Balanced quality and size
- **High**: Better quality, larger file size
- **Lossless**: Maximum quality (where supported)

### Resolution Presets
- Original (no change)
- 4K (3840×2160)
- 1080p (1920×1080)
- 720p (1280×720)
- 480p (854×480)
- 360p (640×360)

## Themes

Switch between themes by pressing `t` on the welcome screen:

- **OpenCode** (default dark theme)
- **Light**
- **Dracula**
- **Nord**
- **Monokai**
- **Gruvbox**

## Development

```bash
# Clone the repository
git clone https://github.com/dhiyaancnirmal/avtui.git
cd avtui

# Install dependencies
npm install

# Run in development mode
npm run dev

# Type check
npm run typecheck

# Build
npm run build
```

## Tech Stack

- **[@opentui/react](https://github.com/sst/opentui)** - React renderer for terminal UI
- **React 19** - Component-based UI
- **TypeScript** - Type safety
- **FFmpeg** - Media processing backend
- **execa** - Process management

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see [LICENSE](LICENSE) for details.

## Acknowledgments

- Built with [@opentui/react](https://github.com/sst/opentui) by SST
- Inspired by [tuitube](https://github.com/example/tuitube)
- Powered by [FFmpeg](https://ffmpeg.org/)
