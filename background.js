// background.js
let totalDuration = 0;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "VIDEO_DURATION") {
    totalDuration += message.duration;
    chrome.action.setBadgeText({ text: formatTime(totalDuration) });
    chrome.runtime.sendMessage({ type: "UPDATE_TOTAL_DURATION", totalDuration });
  }
});

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

chrome.tabs.onActivated.addListener(() => {
  totalDuration = 0;
  chrome.tabs.query({ url: "*://www.youtube.com/watch*" }, (tabs) => {
    tabs.forEach(tab => {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js']
      });
    });
  });
});
