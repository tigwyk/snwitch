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
        // If parsed is an object, try common fields; otherwise, if it's already a string, return it
        if (parsed && typeof parsed === 'object') {
          if (typeof parsed.token === 'string') return parsed.token;
          if (typeof parsed.access_token === 'string') return parsed.access_token;
          if (typeof parsed.value === 'string') return parsed.value;
          return null;
        }
        return typeof parsed === 'string' ? parsed : null;
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
      // Do not cache negative result on error to allow retry on next message
      return false;
    }
  }

  // Convert hex color to rgba with opacity
  function hexToRgba(hex, opacity) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }

  // Apply highlight to chat message
  function highlightMessage(messageElement, username) {
    if (!config.enabled) return;
    
    if (!messageElement.hasAttribute('data-snwitch-checked')) {
      messageElement.setAttribute('data-snwitch-checked', 'true');
      messageElement.classList.add('snwitch-mod-highlight');
      
      // Apply custom color with consistent opacity
      if (config.highlightColor) {
        const color = config.highlightColor;
        messageElement.style.backgroundColor = hexToRgba(color, 0.15);
        messageElement.style.borderLeftColor = color;
      }
      
      // Add a badge indicator if enabled
      if (config.showBadge) {
        // Prefer stable data attribute selector; fall back to internal class name
        let usernameElement = messageElement.querySelector('[data-a-target="chat-message-username"]');
        if (!usernameElement) {
          usernameElement = messageElement.querySelector('.chat-author__display-name');
        }
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
    
    // Process messages concurrently for better performance
    await Promise.all(
      Array.from(messages).map(async (message) => {
        if (message.hasAttribute('data-snwitch-checked')) {
          return;
        }

        // Get username from the message
        const usernameElement = message.querySelector('[data-a-target="chat-message-username"]');
        if (!usernameElement) {
          return;
        }

        const username = usernameElement.textContent.toLowerCase();
        
        // Don't check if the user is already a mod in this channel
        const modBadge = message.querySelector('[aria-label*="Moderator"]');
        if (modBadge) {
          message.setAttribute('data-snwitch-checked', 'true');
          return;
        }

        // Check if user is a mod elsewhere
        const isMod = await checkIfUserIsMod(username);
        if (isMod) {
          highlightMessage(message, username);
        } else {
          message.setAttribute('data-snwitch-checked', 'true');
        }
      })
    );
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

  // Track initialization state
  let isInitialized = false;
  let messageInterval = null;
  let chatObserver = null;

  // Initialize the extension
  async function init() {
    // Prevent multiple initializations
    if (isInitialized) {
      console.log('Snwitch: Already initialized, skipping');
      return;
    }
    
    console.log('Snwitch: Extension initialized');
    isInitialized = true;
    
    // Load configuration first
    await loadConfig();
    
    // Clear any existing interval before creating a new one
    if (messageInterval) {
      clearInterval(messageInterval);
    }
    
    // Process messages periodically
    messageInterval = setInterval(processChatMessages, config.checkInterval);
    
    // Process messages immediately
    processChatMessages();

    // Watch for new messages using MutationObserver
    // Try multiple selectors for better compatibility
    let chatContainer = document.querySelector('.chat-scrollable-area__message-container');
    if (!chatContainer) {
      chatContainer = document.querySelector('[data-a-target="chat-scroller"]');
    }
    
    if (chatContainer) {
      // Disconnect any existing observer before creating a new one
      if (chatObserver) {
        chatObserver.disconnect();
      }
      
      chatObserver = new MutationObserver(() => {
        processChatMessages();
      });
      
      chatObserver.observe(chatContainer, {
        childList: true,
        subtree: true
      });
    } else {
      console.warn('Snwitch: Chat container not found, falling back to interval-only processing');
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
