# Quick Start Guide 🚀

Get Snwitch running in 5 minutes!

## TL;DR

```bash
# 1. Get the code
git clone https://github.com/tigwyk/snwitch.git

# 2. Open Chrome/Edge
chrome://extensions/

# 3. Enable Developer mode (top right)

# 4. Click "Load unpacked" → Select snwitch folder

# 5. Visit twitch.tv and enjoy! 🔨
```

## What You'll See

### Before Snwitch
```
Regular chat message from user
Regular chat message from user
Regular chat message from user
```

### After Snwitch
```
Regular chat message from user
🔨 [HIGHLIGHTED] Message from mod (purple background)
Regular chat message from user
🔨 [HIGHLIGHTED] Message from mod (purple background)
```

## Features at a Glance

| Feature | Description | Default |
|---------|-------------|---------|
| **Highlighting** | Colored background for mod messages | Purple (`#9147ff`) |
| **Badge** | Hammer emoji next to usernames | 🔨 (Enabled) |
| **Caching** | Remembers mod status | 5 minutes |
| **Customization** | Change colors and settings | Via popup |

## Quick Configuration

1. Click the Snwitch icon (🔨) in your browser toolbar
2. Adjust settings:
   - ☑️ Enable/disable highlighting
   - ☑️ Show/hide badge
   - 🎨 Pick a custom color
3. Click "Save Settings"
4. Settings apply immediately!

## Who Gets Highlighted?

Users who have these keywords in their Twitch bio:
- "moderator for"
- "mod for"
- "modding for"
- "moderating"
- "mod @"
- "mod at"

**Note**: Only users who mention being mods in their profile will be detected.

## Troubleshooting

### Not seeing any highlights?

✅ **Normal!** Most moderators don't mention it in their bio.

### Extension not loading?

1. Refresh Twitch page (F5)
2. Check you're logged into Twitch
3. Look for errors in browser console (F12)

### Still having issues?

See detailed [INSTALLATION.md](INSTALLATION.md) guide.

## File Structure

```
snwitch/
├── manifest.json     ← Extension config
├── content.js        ← Main logic
├── popup.html        ← Settings UI
└── styles.css        ← Highlight styles
```

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Open dev tools | F12 |
| Refresh page | F5 |
| Open extensions | Ctrl+Shift+E (Chrome) |

## Next Steps

- 📖 Read [README.md](README.md) for full documentation
- 🔧 See [INSTALLATION.md](INSTALLATION.md) for detailed setup
- 👥 Check [CONTRIBUTING.md](CONTRIBUTING.md) to contribute
- 🏗️ Review [ARCHITECTURE.md](ARCHITECTURE.md) for tech details

## Support

- 🐛 [Report bugs](https://github.com/tigwyk/snwitch/issues)
- 💡 [Request features](https://github.com/tigwyk/snwitch/issues)
- ⭐ [Star the repo](https://github.com/tigwyk/snwitch)

## Pro Tips

1. **Test in smaller chats first** - Easier to see highlighting
2. **Check console for logs** - Extension logs with "Snwitch:" prefix
3. **Try different colors** - Find what works best for you
4. **Disable if needed** - Toggle in popup without uninstalling

---

Happy mod hunting! 🔨✨
