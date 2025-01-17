// content.js
function getVideoDuration() {
    const video = document.querySelector('video');
    return video ? video.duration : 0;
  }
  
  chrome.runtime.sendMessage({
    type: "VIDEO_DURATION",
    duration: getVideoDuration()
  });
  