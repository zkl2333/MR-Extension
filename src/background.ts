chrome.runtime.onInstalled.addListener(() => {
  if (import.meta.env.MODE === "development") {
    chrome.action.setBadgeText({ text: "DEV" });
  }
});
