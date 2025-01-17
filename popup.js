// popup.js
document.addEventListener('DOMContentLoaded', () => {
    chrome.runtime.getBackgroundPage((background) => {
      const totalDuration = background.totalDuration || 0;
      document.getElementById('totalTime').textContent = formatTime(totalDuration);
    });
  });
  
  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
  