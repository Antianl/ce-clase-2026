console.log('Extension background service worker running')

// Example: listen to installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed')
})
