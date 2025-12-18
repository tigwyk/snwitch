# Installation Guide

## Prerequisites

- A modern web browser (Chrome, Edge, or Firefox)
- Access to Twitch.tv

## Chrome/Edge Installation

### Step 1: Download the Extension

Clone or download this repository to your local machine:

```bash
git clone https://github.com/tigwyk/snwitch.git
```

Or download the ZIP file and extract it.

### Step 2: Open Extension Management

1. Open Chrome or Edge browser
2. Navigate to the extensions page:
   - **Chrome**: `chrome://extensions/`
   - **Edge**: `edge://extensions/`
3. Enable **Developer mode** using the toggle in the top-right corner

### Step 3: Load the Extension

1. Click the **"Load unpacked"** button
2. Navigate to the `snwitch` directory
3. Select the folder containing `manifest.json`
4. Click **"Select Folder"** or **"Open"**

### Step 4: Verify Installation

1. You should see the Snwitch extension card appear in your extensions list
2. The extension icon (🔨) should appear in your browser toolbar
3. If you don't see the icon, click the puzzle piece icon and pin Snwitch

## Firefox Installation

### Step 1: Download the Extension

Clone or download this repository to your local machine (same as Chrome instructions above).

### Step 2: Open Debugging Page

1. Open Firefox browser
2. Navigate to `about:debugging`
3. Click **"This Firefox"** in the left sidebar

### Step 3: Load Temporary Add-on

1. Click the **"Load Temporary Add-on..."** button
2. Navigate to the `snwitch` directory
3. Select the `manifest.json` file
4. Click **"Open"**

**Note**: In Firefox, temporary add-ons are removed when you close the browser. You'll need to reload it each time you restart Firefox.

## First Use

### Step 1: Navigate to Twitch

1. Open a new tab and go to [https://www.twitch.tv](https://www.twitch.tv)
2. Navigate to any channel with an active chat

### Step 2: Verify Extension is Working

1. Look for chat messages with a purple/colored background
2. These are messages from users who mention being moderators in their profile descriptions
3. You should see a hammer emoji (🔨) next to their usernames

### Step 3: Configure Settings (Optional)

1. Click the Snwitch icon in your browser toolbar
2. A popup will appear with configuration options:
   - **Enable highlighting**: Toggle the highlighting feature
   - **Show moderator badge**: Toggle the hammer badge display
   - **Highlight color**: Choose a custom color for highlighting
3. Click **"Save Settings"** to apply changes

## Troubleshooting

### Extension Not Working

1. **Refresh the Twitch page**: After installing, refresh any open Twitch tabs
2. **Check browser console**: Press F12 to open developer tools and look for any error messages
3. **Verify permissions**: Make sure the extension has permission to access Twitch.tv

### No Users Highlighted

This is normal! The extension only highlights users who:
- Mention being moderators in their Twitch profile description
- Use keywords like "moderator for", "mod for", "modding for", etc.

Many moderators don't include this information in their profiles, so you may not see highlights immediately.

### Twitch API Token Issues

The extension uses your logged-in Twitch session to access the API. If you encounter issues:
1. Make sure you're logged into Twitch
2. Try logging out and logging back in
3. Clear your browser cache for Twitch.tv
4. Reload the extension

## Updating the Extension

### Chrome/Edge

1. Make your changes to the code
2. Go to `chrome://extensions/` or `edge://extensions/`
3. Find the Snwitch extension
4. Click the refresh/reload icon

### Firefox

Since Firefox loads temporary add-ons, you'll need to:
1. Make your changes to the code
2. Go to `about:debugging`
3. Click **"Reload"** next to the Snwitch extension

## Uninstalling

### Chrome/Edge

1. Go to `chrome://extensions/` or `edge://extensions/`
2. Find the Snwitch extension
3. Click **"Remove"**
4. Confirm the removal

### Firefox

1. Go to `about:debugging`
2. Find Snwitch in the list of temporary extensions
3. Click **"Remove"**

## Support

If you encounter any issues:

1. Check the [Issues](https://github.com/tigwyk/snwitch/issues) page on GitHub
2. Create a new issue with details about your problem
3. Include your browser version and any error messages from the console
