// Content script for Falabella: scrape product items and respond to messages from the extension

console.log('Falabella content script injected')

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type === 'scrape') {
    try {
      const nodeList = document.querySelectorAll('[data-testid=ssr-pod]')
      const datos = Array.from(nodeList)
      const productos = datos.map((producto: Element) => {
        // Usamos querySelector dentro de cada 'producto' para buscar clases específicas
        const marca = producto.querySelector('.pod-title')?.textContent?.trim() || '';
        const nombreArticulo = producto.querySelector('.pod-subTitle')?.textContent?.trim() || '';
        const quienComercializa = producto.querySelector('.pod-sellerText')?.textContent?.trim() || '';

        // El precio suele estar en la primera posición de la lista de precios
        const precioArticulo = producto.querySelector('.prices-0 span')?.textContent?.trim() || '';

        // El descuento tiene su propia clase de badge
        const descuento = producto.querySelector('.discount-badge-item')?.textContent?.trim() || '';

        return { marca, nombreArticulo, quienComercializa, precioArticulo, descuento };
      });

      // Reply to the popup (synchronous response)
      sendResponse({ result: productos })

      // Also forward the scraped data to the background service worker for forwarding to external API
      try {
        chrome.runtime.sendMessage({ type: 'scrapedData', data: productos }, (resp) => {
          // optional ack handling
          // console.log('Background ack:', resp)
        })
      } catch (err) {
        console.warn('Could not send scraped data to background', err)
      }
    } catch (err) {
      console.error('Falabella scrape error', err)
      sendResponse({ error: String(err) })
    }
    return true
  }
})
