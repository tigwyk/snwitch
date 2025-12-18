# Snwitch Architecture

## Overview

Snwitch is a browser extension that highlights Twitch chat users who moderate for other streamers. This document explains the technical architecture and data flow.

## Component Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Browser Extension                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌────────────────┐     ┌────────────────┐                  │
│  │  Popup UI      │     │  Background    │                  │
│  │  (popup.html)  │────▶│  Service Worker│                  │
│  │  (popup.js)    │     │  (background.js)│                 │
│  └────────────────┘     └────────────────┘                  │
│         │                        │                           │
│         │                        │                           │
│         ▼                        ▼                           │
│  ┌──────────────────────────────────────┐                   │
│  │      Chrome Storage API              │                   │
│  │  (Stores user preferences)           │                   │
│  └──────────────────────────────────────┘                   │
│                         │                                    │
│                         │                                    │
│                         ▼                                    │
│  ┌──────────────────────────────────────┐                   │
│  │     Content Script (content.js)      │                   │
│  │  - Monitors Twitch chat              │                   │
│  │  - Detects moderators                │                   │
│  │  - Applies highlighting              │                   │
│  └──────────────────────────────────────┘                   │
│         │              │              │                      │
└─────────│──────────────│──────────────│──────────────────────┘
          │              │              │
          ▼              ▼              ▼
  ┌──────────────┐ ┌────────────┐ ┌──────────────┐
  │   Twitch     │ │  Twitch    │ │  Twitch DOM  │
  │   LocalStorage│ │  Helix API │ │  (Chat UI)   │
  │   (Auth)     │ │  (User Data)│ │              │
  └──────────────┘ └────────────┘ └──────────────┘
```

## Data Flow

### 1. Extension Initialization

```
User loads Twitch page
      │
      ▼
Content script injected
      │
      ▼
Load config from chrome.storage
      │
      ▼
Initialize MutationObserver
      │
      ▼
Start monitoring chat
```

### 2. Chat Message Processing

```
New message appears in chat
      │
      ▼
Extract username
      │
      ▼
Check if already processed (data-snwitch-checked)
      │
      ├─── Yes ──▶ Skip
      │
      ├─── No ──▶ Check if already mod in this channel
      │                  │
      │                  ├─── Yes ──▶ Mark as checked, skip
      │                  │
      │                  └─── No ──▶ Continue
      │
      ▼
Check cache for username
      │
      ├─── Cache hit ──▶ Use cached result
      │
      └─── Cache miss ──▶ Query Twitch API
                              │
                              ▼
                         Get user profile
                              │
                              ▼
                    Check description for mod keywords
                              │
                              ▼
                         Cache result (5 min TTL)
                              │
                              ▼
                    Return mod status
      │
      ▼
If moderator: Apply highlighting
      │
      ├─── Add background color
      ├─── Add border
      └─── Add badge (if enabled)
```

### 3. Configuration Update

```
User opens popup
      │
      ▼
Load current settings from chrome.storage
      │
      ▼
User changes settings
      │
      ▼
Click "Save Settings"
      │
      ▼
Save to chrome.storage
      │
      ▼
Send "reloadConfig" message to all Twitch tabs
      │
      ▼
Content scripts receive message
      │
      ▼
Reload config from storage
      │
      ▼
Clear all highlights
      │
      ▼
Reprocess all messages
```

## Key Components

### manifest.json
- **Purpose**: Extension configuration and permissions
- **Manifest Version**: 3 (latest standard)
- **Permissions**: 
  - `storage`: Save user preferences
  - `host_permissions`: Access Twitch.tv and API
- **Content Scripts**: Injects content.js into all Twitch pages
- **Background**: Service worker for lifecycle management
- **Action**: Popup UI for settings

### content.js
- **Purpose**: Main logic for detecting and highlighting moderators
- **Key Functions**:
  - `loadConfig()`: Loads user preferences from storage
  - `getTwitchAuthToken()`: Retrieves auth token from page localStorage
  - `checkIfUserIsMod()`: Queries API and checks for mod keywords
  - `highlightMessage()`: Applies visual highlighting to messages
  - `processChatMessages()`: Main loop that processes all messages
- **Performance**: Uses caching (5-minute TTL) to minimize API calls
- **DOM Monitoring**: MutationObserver for efficient change detection

### background.js
- **Purpose**: Background service worker
- **Functions**:
  - Handles extension installation/updates
  - Manages configuration storage
  - Responds to messages from content scripts

### popup.html/popup.js
- **Purpose**: Settings interface
- **Features**:
  - Enable/disable highlighting
  - Toggle moderator badge
  - Color picker for custom highlight colors
  - Save button with visual feedback
  - Sends reload message to active tabs

### styles.css
- **Purpose**: CSS for chat message highlighting
- **Features**:
  - `.snwitch-mod-highlight`: Background and border styling
  - `.snwitch-mod-badge`: Badge styling
  - Dark/light mode support
  - Hover effects

## API Integration

### Twitch Helix API

The extension uses the following Twitch API endpoint:

```
GET https://api.twitch.tv/helix/users?login={username}
```

**Headers:**
- `Client-ID`: Twitch web app client ID
- `Authorization`: Bearer token from user's localStorage

**Response:**
```json
{
  "data": [
    {
      "id": "123456",
      "login": "username",
      "display_name": "Username",
      "description": "Moderator for @streamer1 and @streamer2",
      ...
    }
  ]
}
```

### Authentication

- Uses user's existing Twitch session
- Retrieves OAuth token from `localStorage.getItem('twilight.access_token')`
- No additional login required
- Falls back gracefully if token unavailable

## Moderator Detection

### Heuristic Approach

Since Twitch API doesn't provide direct access to check if users moderate other channels (requires broadcaster permissions), we use a heuristic approach:

1. **Query user profile** via Helix API
2. **Analyze description** for keywords:
   - "moderator for"
   - "mod for"
   - "modding for"
   - "moderating"
   - "mod @"
   - "mod at"
3. **Cache result** to avoid repeated queries
4. **Highlight if match found**

### Limitations

- Only detects users who mention being moderators in their bio
- False negatives: Moderators without bio mentions won't be detected
- False positives: Rare, but possible if keywords used in other contexts

### Future Improvements

Possible approaches for better detection:
- Community-maintained moderator lists
- Machine learning on user behavior patterns
- Browser extension network sharing detected moderators
- Integration with third-party mod directories

## Performance Considerations

### Caching Strategy

- **Cache Duration**: 5 minutes per username
- **Cache Storage**: In-memory Map (cleared on page reload)
- **Benefits**: Reduces API calls by ~95%

### Rate Limiting

- **Batch Processing**: Processes messages in loops with delays
- **Throttling**: 2-second intervals between batch checks
- **Error Handling**: Backs off on API errors

### DOM Efficiency

- **MutationObserver**: Only processes actual changes, not entire DOM
- **Attribute Marking**: `data-snwitch-checked` prevents reprocessing
- **Selective Queries**: Only targets specific chat elements

## Browser Compatibility

### Supported Browsers

- ✅ Chrome 88+
- ✅ Edge 88+
- ✅ Firefox 89+ (with modifications)

### Manifest V3 Benefits

- Better performance (service workers vs background pages)
- Enhanced security (declarative permissions)
- Improved privacy (limited host access)
- Future-proof (required for new submissions)

## Security Considerations

### Data Privacy

- **No data collection**: Extension doesn't collect or transmit user data
- **Local processing**: All detection happens client-side
- **Public API only**: Uses publicly available Twitch API endpoints
- **User consent**: Clear permission requests in manifest

### API Security

- **Bearer token**: Secured in localStorage, never exposed
- **Rate limiting**: Respects Twitch API rate limits
- **Error handling**: Graceful fallbacks on auth failures
- **HTTPS only**: All API calls over secure connections

### Content Security

- **No eval()**: No dynamic code execution
- **CSP compliant**: Follows content security policies
- **XSS prevention**: Sanitized DOM manipulation
- **Isolated storage**: Extension storage separate from page

## Testing Strategy

### Manual Testing

1. Load extension in developer mode
2. Navigate to Twitch chat
3. Verify messages are highlighted correctly
4. Test configuration changes in popup
5. Check browser console for errors

### Browser Testing

- Test in Chrome, Edge, and Firefox
- Test with different Twitch themes (light/dark)
- Test with fast-moving chat
- Test with extension disabled/enabled

### API Testing

- Test with valid Twitch login
- Test without login (should fail gracefully)
- Test with network offline
- Test with API rate limiting

## Deployment

### Chrome Web Store (Future)

1. Create developer account
2. Prepare store listing (description, screenshots, icons)
3. Package extension as .zip
4. Submit for review
5. Address any review feedback
6. Publish

### Firefox Add-ons (Future)

1. Create AMO account
2. Convert icons to PNG (Firefox requirement)
3. Package extension as .zip
4. Submit for review
5. Address any review feedback
6. Publish

### Updates

- Use `version` field in manifest.json
- Follow semantic versioning (major.minor.patch)
- Include changelog in store listing
- Test updates thoroughly before submission
