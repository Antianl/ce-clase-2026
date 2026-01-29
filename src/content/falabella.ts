// Content script for Falabella: scrape product items and respond to messages from the extension

console.log('Falabella content script injected')

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type === 'scrape') {
    try {
      const nodeList = document.querySelectorAll('[data-testid=ssr-pod]')
      const datos = Array.from(nodeList)
      const productos = datos.map((producto: Element) => {
        const text = (producto as HTMLElement).innerText || ''
        const [marca, nombreArticulo, quienComercializa, precioArticulo, descuento] = text.split('\n')
        return { marca, nombreArticulo, quienComercializa, precioArticulo, descuento }
      })
      sendResponse({ result: productos })
    } catch (err) {
      console.error('Falabella scrape error', err)
      sendResponse({ error: String(err) })
    }
    return true
  }
})
