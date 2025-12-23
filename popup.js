// Popup script for Snwitch settings

document.addEventListener('DOMContentLoaded', () => {
  const enabledCheckbox = document.getElementById('enabled');
  const showBadgeCheckbox = document.getElementById('showBadge');
  const highlightColorInput = document.getElementById('highlightColor');
  const saveButton = document.getElementById('save');

  // Load current settings
  chrome.storage.sync.get(['enabled', 'highlightColor', 'showBadge'], (items) => {
    if (items.enabled !== undefined) {
      enabledCheckbox.checked = items.enabled;
    }
    if (items.showBadge !== undefined) {
      showBadgeCheckbox.checked = items.showBadge;
    }
    if (items.highlightColor) {
      highlightColorInput.value = items.highlightColor;
    }
  });

  // Save settings
  saveButton.addEventListener('click', () => {
    const config = {
      enabled: enabledCheckbox.checked,
      showBadge: showBadgeCheckbox.checked,
      highlightColor: highlightColorInput.value
    };

    chrome.storage.sync.set(config, () => {
      // Visual feedback
      saveButton.textContent = 'Saved!';
      setTimeout(() => {
        saveButton.textContent = 'Save Settings';
      }, 1500);

      // Notify content scripts to reload configuration
      chrome.tabs.query({ url: 'https://*.twitch.tv/*' }, (tabs) => {
        tabs.forEach((tab) => {
          try {
            chrome.tabs.sendMessage(tab.id, { action: 'reloadConfig' }, () => {
              if (chrome.runtime.lastError) {
                console.warn('Failed to send reloadConfig message to tab', tab.id, chrome.runtime.lastError.message);
              }
            });
          } catch (e) {
            console.warn('Error sending reloadConfig message to tab', tab.id, e);
          }
        });
      });
    });
  });
});
