// Background service worker for Snwitch

// Handle installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('Snwitch: Extension installed');
    
    // Set default configuration
    chrome.storage.sync.set({
      enabled: true,
      highlightColor: '#9147ff',
      showBadge: true
    });
  } else if (details.reason === 'update') {
    console.log('Snwitch: Extension updated');
  }
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getConfig') {
    chrome.storage.sync.get(['enabled', 'highlightColor', 'showBadge'], (items) => {
      sendResponse(items);
    });
    return true; // Keep the message channel open for async response
  }
  
  if (request.action === 'setConfig') {
    chrome.storage.sync.set(request.config, () => {
      sendResponse({ success: true });
    });
    return true;
  }
});
