// Prevent multiple injections
if (!window.__autopause_injected) {
  window.__autopause_injected = true;

  let video;
  let isEnabled = true;

  function getVideo() {
    video = document.querySelector("video");
    return video;
  }

  function handleVisibilityChange() {
    if (!isEnabled) return;
    const vid = getVideo();
    if (!vid) return;

    if (document.hidden) {
      vid.pause();
    } else {
      vid.play();
    }
  }

  document.addEventListener("visibilitychange", handleVisibilityChange);

  // Observe SPA changes
  const observer = new MutationObserver(() => {
    video = document.querySelector("video");
  });
  observer.observe(document.body, { childList: true, subtree: true });

  // Listen for toggle messages
  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === "TOGGLE_AUTOPAUSE") {
      isEnabled = message.enabled;
      console.log("AutoPause live-updated:", isEnabled);
    }
  });

  // Load initial state
  chrome.storage.sync.get(["autoPauseEnabled"], (result) => {
    isEnabled = result.autoPauseEnabled ?? true;
  });
}
