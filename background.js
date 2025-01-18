// background.js
let totalDuration = 0;
const tabDurations = new Map(); // Track duration for each tab

// Set initial badge color
chrome.action.setBadgeBackgroundColor({ color: "#666666" });

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "VIDEO_DURATION" && sender.tab) {
    const tabId = sender.tab.id;
    const duration = message.duration;
    
    // Store duration for this tab
    tabDurations.set(tabId, duration);
    
    // Recalculate total duration
    totalDuration = Array.from(tabDurations.values()).reduce((sum, dur) => sum + dur, 0);
    
    // Update badge and popup
    chrome.action.setBadgeText({ text: formatTime(totalDuration) });
  } else if (message.type === "RESET_DURATION") {
    // Reset all counters
    totalDuration = 0;
    tabDurations.clear();
    
    // Reset badge to "0:00" instead of empty
    chrome.action.setBadgeText({ text: "0:00" });
  }
});

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Handle tab activation
chrome.tabs.onActivated.addListener(() => {
  chrome.tabs.query({ url: "*://www.youtube.com/watch*" }, (tabs) => {
    tabs.forEach(tab => {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js']
      });
    });
  });
});

// Handle tab removal
chrome.tabs.onRemoved.addListener((tabId) => {
  if (tabDurations.has(tabId)) {
    totalDuration -= tabDurations.get(tabId);
    tabDurations.delete(tabId);
    
    // Update badge and popup
    chrome.action.setBadgeText({ text: formatTime(totalDuration) });
    chrome.runtime.sendMessage({ type: "UPDATE_TOTAL_DURATION", totalDuration });
  }
});
