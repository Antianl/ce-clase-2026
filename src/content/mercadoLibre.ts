// Content script for MercadoLibre: placeholder scraper and message handler

console.log('MercadoLibre content script injected')

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type === 'scrape') {
    try {
      // Placeholder: MercadoLibre layout differs; adapt selectors as needed.
      const nodeList = document.querySelectorAll('.ui-search-result')
      const datos = Array.from(nodeList)
      const productos = datos.map((producto: Element) => {
        const text = (producto as HTMLElement).innerText || ''
        const parts = text.split('\n')
        return { raw: parts }
      })
      sendResponse({ result: productos })
    } catch (err) {
      console.error('MercadoLibre scrape error', err)
      sendResponse({ error: String(err) })
    }
    return true
  }
})
