// Content script for Falabella: scrape product items and respond to messages from the extension

import { scrollToBottom, waitSeconds } from '../utils/index'

console.log('Falabella content script injected')


chrome.runtime.onConnect.addListener((port) => {
  if (port.name !== 'scrape') return;

  port.onMessage.addListener(async (message) => {
    if (message?.type !== 'scrape') return;

    try {
      port.postMessage({ type: 'progress', value: 'scrolling' });

      

      const allProductsPage = [];

      let nextButton = document.getElementById('testId-pagination-bottom-arrow-right') as HTMLButtonElement | null;
      
      let page = 1
      do{
        await scrollToBottom(document);
        const nodeList = document.querySelectorAll('[data-testid=ssr-pod],[data-testid=csr-pod]');
        const productos = Array.from(nodeList).map((producto) => {
          const text = (producto as HTMLElement).innerText || '';
          const [marca, nombreArticulo, quienComercializa, precioArticulo, descuento] = text.split('\n');
          return { marca, nombreArticulo, quienComercializa, precioArticulo, descuento, pagina: page };
        });

        allProductsPage.push(...productos);
        nextButton?.click()
        await waitSeconds(10);
        page += 1;
        nextButton = document.getElementById('testId-pagination-bottom-arrow-right') as HTMLButtonElement | null;
      }
      while(!nextButton || !nextButton?.disabled)
      


      port.postMessage({ type: 'result', data: allProductsPage });

    } catch (err) {
      port.postMessage({ type: 'error', error: String(err) });
    }
  });
});