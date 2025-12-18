# Snwitch 🔨

A browser extension that integrates with Twitch Chat to highlight users who moderate for other streamers, making them stand out in chat.

## Features

- **Automatic Detection**: Detects users in Twitch chat who moderate for other streamers
- **Visual Highlighting**: Highlights messages from moderators with a distinct colored background
- **Moderator Badge**: Adds a hammer emoji (🔨) badge next to usernames of moderators
- **Customizable**: Configure highlight colors and toggle features through the popup interface
- **Lightweight**: Minimal performance impact with intelligent caching

## Installation

### Chrome/Edge (Developer Mode)

1. Clone or download this repository
2. Open Chrome/Edge and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top-right corner
4. Click "Load unpacked"
5. Select the `snwitch` directory
6. Navigate to any Twitch channel and the extension will automatically start working

### Firefox

1. Clone or download this repository
2. Open Firefox and navigate to `about:debugging`
3. Click "This Firefox"
4. Click "Load Temporary Add-on"
5. Select the `manifest.json` file from the `snwitch` directory

## How It Works

Snwitch monitors Twitch chat messages in real-time and:

1. Identifies usernames in chat messages
2. Queries the Twitch API to check if the user moderates any channels
3. Highlights their messages with a colored background (default: Twitch purple)
4. Adds a moderator badge (🔨) next to their username
5. Caches results to minimize API calls and improve performance

## Configuration

Click the Snwitch extension icon in your browser toolbar to access settings:

- **Enable highlighting**: Toggle the highlighting feature on/off
- **Show moderator badge**: Toggle the hammer badge display
- **Highlight color**: Customize the background color used for highlighting

## Privacy & Permissions

Snwitch requires the following permissions:

- `storage`: To save your configuration preferences
- `https://api.twitch.tv/*`: To query the Twitch API for moderator information
- `https://*.twitch.tv/*`: To inject the content script into Twitch pages

The extension only accesses public Twitch API data and does not collect or transmit any personal information.

## Technical Details

- **Manifest Version**: 3 (compatible with modern browsers)
- **API**: Uses Twitch Helix API for moderator detection
- **Caching**: Results are cached for 5 minutes to reduce API calls
- **Performance**: Uses MutationObserver for efficient DOM monitoring

## Development

The extension consists of:

- `manifest.json`: Extension configuration
- `content.js`: Main logic for detecting and highlighting moderators
- `background.js`: Service worker for handling extension lifecycle
- `popup.html/js`: Settings interface
- `styles.css`: Styling for chat message highlights

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## License

This project is open source and available under the MIT License.
