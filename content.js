// Content script for Snwitch - Highlights moderators in Twitch chat

(function() {
  'use strict';

  // Cache for users who are moderators of other channels
  const modCache = new Map();
  
  // Configuration - will be loaded from storage
  let config = {
    enabled: true,
    highlightColor: '#9147ff', // Twitch purple
    showBadge: true,
    checkInterval: 2000, // Check for new chat messages every 2 seconds
    cacheExpiry: 300000 // Cache moderator status for 5 minutes
  };

  // Load configuration from storage
  async function loadConfig() {
    try {
      const items = await chrome.storage.sync.get(['enabled', 'highlightColor', 'showBadge']);
      if (items.enabled !== undefined) config.enabled = items.enabled;
      if (items.highlightColor) config.highlightColor = items.highlightColor;
      if (items.showBadge !== undefined) config.showBadge = items.showBadge;
    } catch (e) {
      console.warn('Snwitch: Could not load config', e);
    }
  }

  // Get Twitch OAuth token from the page
  function getTwitchAuthToken() {
    try {
      // Try to get the token from localStorage
      const authToken = localStorage.getItem('twilight.access_token');
      if (authToken) {
        // The token is stored as a JSON string, parse it to get the actual token value
        const parsed = JSON.parse(authToken);
        return parsed;
      }
    } catch (e) {
      console.warn('Snwitch: Could not retrieve Twitch auth token', e);
    }
    return null;
  }

  // Get Client ID from Twitch page
  function getTwitchClientId() {
    // Twitch's client ID for web app
    return 'kimne78kx3ncx6brgo4mv6wki5h1ko';
  }

  // Check if a user is a moderator using heuristic approach
  async function checkIfUserIsMod(username) {
    // Check cache first
    const cached = modCache.get(username);
    if (cached && Date.now() - cached.timestamp < config.cacheExpiry) {
      return cached.isMod;
    }

    try {
      const token = getTwitchAuthToken();
      const clientId = getTwitchClientId();
      
      if (!token) {
        console.warn('Snwitch: No auth token available');
        return false;
      }

      // Get user information
      const userResponse = await fetch(`https://api.twitch.tv/helix/users?login=${username}`, {
        headers: {
          'Client-ID': clientId,
          'Authorization': `Bearer ${token}`
        }
      });

      if (!userResponse.ok) {
        return false;
      }

      const userData = await userResponse.json();
      if (!userData.data || userData.data.length === 0) {
        return false;
      }

      const userInfo = userData.data[0];
      
      // Heuristic approach: Check user's description for moderator-related keywords
      // This is a simple method since we can't directly query mod status for other channels
      const description = (userInfo.description || '').toLowerCase();
      const modKeywords = ['moderator for', 'mod for', 'modding for', 'moderating', 'mod @', 'mod at'];
      const isMod = modKeywords.some(keyword => description.includes(keyword));

      // Cache the result
      modCache.set(username, {
        isMod: isMod,
        timestamp: Date.now()
      });

      return isMod;
    } catch (error) {
      console.error('Snwitch: Error checking mod status', error);
      // Cache negative result to avoid repeated failures
      modCache.set(username, {
        isMod: false,
        timestamp: Date.now()
      });
      return false;
    }
  }

  // Apply highlight to chat message
  function highlightMessage(messageElement, username) {
    if (!config.enabled) return;
    
    if (!messageElement.hasAttribute('data-snwitch-checked')) {
      messageElement.setAttribute('data-snwitch-checked', 'true');
      messageElement.classList.add('snwitch-mod-highlight');
      
      // Apply custom color
      if (config.highlightColor) {
        const color = config.highlightColor;
        messageElement.style.backgroundColor = `${color}26`; // 15% opacity
        messageElement.style.borderLeftColor = color;
      }
      
      // Add a badge indicator if enabled
      if (config.showBadge) {
        const usernameElement = messageElement.querySelector('.chat-author__display-name');
        if (usernameElement && !usernameElement.querySelector('.snwitch-mod-badge')) {
          const badge = document.createElement('span');
          badge.className = 'snwitch-mod-badge';
          badge.title = 'Moderates other channels';
          badge.textContent = '🔨';
          usernameElement.appendChild(badge);
        }
      }
    }
  }

  // Process chat messages
  async function processChatMessages() {
    // Find all chat messages
    const messages = document.querySelectorAll('[data-a-target="chat-line-message"]');
    
    for (const message of messages) {
      if (message.hasAttribute('data-snwitch-checked')) {
        continue;
      }

      // Get username from the message
      const usernameElement = message.querySelector('[data-a-target="chat-message-username"]');
      if (!usernameElement) {
        continue;
      }

      const username = usernameElement.textContent.toLowerCase();
      
      // Don't check if the user is already a mod in this channel
      const modBadge = message.querySelector('[aria-label*="Moderator"]');
      if (modBadge) {
        message.setAttribute('data-snwitch-checked', 'true');
        continue;
      }

      // Check if user is a mod elsewhere
      const isMod = await checkIfUserIsMod(username);
      if (isMod) {
        highlightMessage(message, username);
      } else {
        message.setAttribute('data-snwitch-checked', 'true');
      }
    }
  }

  // Listen for configuration updates
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'reloadConfig') {
      loadConfig().then(() => {
        console.log('Snwitch: Configuration reloaded');
        // Clear all existing highlights and reprocess
        document.querySelectorAll('[data-snwitch-checked]').forEach(el => {
          el.removeAttribute('data-snwitch-checked');
          el.classList.remove('snwitch-mod-highlight');
          el.style.backgroundColor = '';
          el.style.borderLeftColor = '';
          const badge = el.querySelector('.snwitch-mod-badge');
          if (badge) badge.remove();
        });
        processChatMessages();
        sendResponse({ success: true });
      });
      return true; // Keep message channel open for async response
    }
  });

  // Initialize the extension
  async function init() {
    console.log('Snwitch: Extension initialized');
    
    // Load configuration first
    await loadConfig();
    
    // Process messages periodically
    setInterval(processChatMessages, config.checkInterval);
    
    // Process messages immediately
    processChatMessages();

    // Watch for new messages using MutationObserver
    const chatContainer = document.querySelector('.chat-scrollable-area__message-container');
    if (chatContainer) {
      const observer = new MutationObserver(() => {
        processChatMessages();
      });
      
      observer.observe(chatContainer, {
        childList: true,
        subtree: true
      });
    }
  }

  // Wait for the page to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // Start after a short delay to ensure Twitch has loaded
    setTimeout(init, 2000);
  }
})();
