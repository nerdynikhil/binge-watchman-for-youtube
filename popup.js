// popup.js
document.addEventListener('DOMContentLoaded', () => {
  chrome.runtime.getBackgroundPage((background) => {
    const totalDuration = background.totalDuration || 0;
    document.getElementById('totalTime').textContent = formatTime(totalDuration);
  });

  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === "UPDATE_TOTAL_DURATION") {
      document.getElementById('totalTime').textContent = formatTime(message.totalDuration);
    }
  });

  document.getElementById('resetButton').addEventListener('click', () => {
    chrome.runtime.sendMessage({ type: "RESET_DURATION" });
  });
});

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}