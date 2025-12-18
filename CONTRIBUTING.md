# Contributing to Snwitch

Thank you for your interest in contributing to Snwitch! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

Please be respectful and constructive in all interactions. We aim to maintain a welcoming and inclusive environment for all contributors.

## How to Contribute

### Reporting Bugs

If you find a bug, please create an issue on GitHub with:

1. A clear, descriptive title
2. Steps to reproduce the issue
3. Expected behavior vs. actual behavior
4. Browser version and operating system
5. Console errors (if any)
6. Screenshots or screen recordings (if applicable)

### Suggesting Enhancements

We welcome feature suggestions! When proposing an enhancement:

1. Check if the feature has already been suggested
2. Clearly describe the feature and its benefits
3. Provide examples of how it would work
4. Consider potential drawbacks or challenges

### Pull Requests

1. **Fork the repository** and create a new branch for your feature or fix
2. **Make your changes** following the code style guidelines below
3. **Test your changes** thoroughly in multiple browsers
4. **Update documentation** if you're adding new features
5. **Submit a pull request** with a clear description of your changes

## Development Setup

### Prerequisites

- Git
- A modern web browser (Chrome, Edge, or Firefox)
- A text editor or IDE
- Basic knowledge of JavaScript, HTML, and CSS

### Setting Up Your Development Environment

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/snwitch.git
   cd snwitch
   ```

3. Load the extension in your browser (see INSTALLATION.md)

### Making Changes

1. Create a new branch for your work:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes to the code

3. Test your changes by reloading the extension in your browser

4. Commit your changes with clear, descriptive messages:
   ```bash
   git commit -m "Add feature: description of what you added"
   ```

5. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

6. Create a pull request on GitHub

## Code Style Guidelines

### JavaScript

- Use modern ES6+ syntax
- Use `const` and `let` instead of `var`
- Use arrow functions for callbacks
- Add comments for complex logic
- Use meaningful variable and function names
- Keep functions small and focused
- Handle errors gracefully with try/catch blocks

### Example:

```javascript
// Good
async function loadUserData(username) {
  try {
    const response = await fetch(`/api/users/${username}`);
    if (!response.ok) {
      throw new Error('Failed to load user data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error loading user data:', error);
    return null;
  }
}

// Avoid
function loadUserData(username, callback) {
  fetch('/api/users/' + username).then(function(response) {
    callback(response);
  });
}
```

### HTML/CSS

- Use semantic HTML elements
- Keep CSS selectors specific but not overly complex
- Use consistent indentation (2 spaces)
- Group related styles together
- Add comments for non-obvious styling decisions

### Commit Messages

Write clear, concise commit messages:

- Use present tense ("Add feature" not "Added feature")
- Start with a capital letter
- Keep the first line under 72 characters
- Add more details in the body if needed

Examples:
- ✅ "Fix highlighting bug in dark mode"
- ✅ "Add option to customize badge icon"
- ✅ "Improve performance of message processing"
- ❌ "fixed stuff"
- ❌ "updates"

## Project Structure

```
snwitch/
├── manifest.json       # Extension configuration
├── content.js          # Main content script
├── background.js       # Background service worker
├── popup.html          # Settings popup UI
├── popup.js            # Settings popup logic
├── styles.css          # Chat highlight styling
├── icons/              # Extension icons
├── README.md           # Main documentation
├── INSTALLATION.md     # Installation guide
├── CONTRIBUTING.md     # This file
└── LICENSE             # MIT License
```

## Testing Your Changes

### Manual Testing Checklist

Before submitting a pull request, test the following:

1. **Installation**: The extension loads without errors
2. **Basic functionality**: Messages are highlighted correctly
3. **Configuration**: Settings can be changed and are applied
4. **Performance**: The extension doesn't slow down Twitch
5. **Browser compatibility**: Test in Chrome/Edge and Firefox if possible
6. **Error handling**: No console errors under normal use
7. **Edge cases**: Test with empty chat, fast-moving chat, etc.

### Testing in Different Scenarios

- Test with active and inactive chats
- Test with different Twitch themes (light/dark)
- Test with the extension enabled and disabled
- Test changing settings while on a Twitch page
- Test with browser developer tools open to check for console errors

## API and Limitations

### Twitch API

The extension uses the Twitch Helix API with the following limitations:

- Requires user to be logged into Twitch
- Rate limited by Twitch (be mindful of API calls)
- Cannot directly query moderator status for other channels
- Uses heuristic approach based on user profile descriptions

### Browser API

- Uses Manifest V3 (latest standard)
- Requires `storage` and host permissions
- Content script runs on all Twitch pages

## Improving Moderator Detection

The current implementation uses a heuristic approach (checking profile descriptions). If you have ideas for more accurate detection methods that don't require special API permissions, we'd love to hear them!

Some areas for improvement:

1. Better pattern matching in user descriptions
2. Alternative data sources for moderator status
3. Machine learning approaches to identify likely moderators
4. Community-maintained lists of known moderators

## Questions or Need Help?

- Open an issue on GitHub with the "question" label
- Check existing issues and pull requests for similar discussions
- Review the code and documentation thoroughly first

## License

By contributing to Snwitch, you agree that your contributions will be licensed under the MIT License.

Thank you for contributing to Snwitch! 🔨
