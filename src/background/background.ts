console.log('Extension background service worker running')

// Example: listen to installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed')
})

// Listen for scraped data from content scripts and forward to external API
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type === 'scrapedData') {
    const url = 'http://localhost:6000/data'
    const payload = message.data
    console.log('Background received scraped data from', sender?.tab?.id || 'unknown', 'items:', Array.isArray(payload) ? payload.length : 0)

    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(async (res) => {
        let text = null
        try { text = await res.text() } catch (e) {}
        console.log('Posted scraped data, status=', res.status, 'url=', url)
        console.log('Response body:', text)
        sendResponse({ ok: res.ok, status: res.status, body: text })
      })
      .catch((err) => {
        console.error('Error posting scraped data to', url)
        console.error('Error message:', err.message)
        console.error('Error type:', err.name)
        console.error('Full error:', err)
        sendResponse({ ok: false, error: String(err), message: err.message, type: err.name })
      })

    // Keep the message channel open for async response
    return true
  }
})
