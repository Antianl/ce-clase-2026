// Content script for MercadoLibre: scrape product items and respond to messages from the extension

console.log('MercadoLibre content script injected')

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Verificamos si el mensaje es de tipo 'scrape'
  if (message?.type === 'scrape') {
    try {
      console.log('Iniciando scraping en Mercado Libre...')

      // 1. Seleccionamos todos los contenedores de productos
      // Usamos el selector del contenedor principal de cada item
      const nodeList = document.querySelectorAll('.ui-search-layout__item')
      
      const datos = Array.from(nodeList)

      // 2. Mapeamos cada nodo a un objeto con la estructura que tu popup espera
      const productos = datos.map((producto: Element) => {
        // Helpers para extraer texto de forma segura
        const getTitle = (selector: string) => 
          (producto.querySelector(selector) as HTMLElement)?.innerText?.trim() || ''
        
        // Extracción de campos específicos usando la estructura "poly"
        const nombreArticulo = getTitle('.poly-component__title')
        
        // La marca suele venir en el "seller" o en el título, a veces ML no la muestra explícita
        const marca = getTitle('.poly-component__seller')
        
        // "Quien comercializa" suele ser la tienda oficial (highlight) o el vendedor
        const quienComercializa = getTitle('.poly-component__highlight') || 'Vendedor estándar'
        
        // Lógica de precio: ML muestra precio anterior y actual. 
        // Buscamos todos los precios fraccionados.
        const precios = producto.querySelectorAll('.andes-money-amount__fraction')
        
        // Si hay 2 precios, el segundo suele ser el actual (el primero es el tachado).
        // Si hay 1, es el actual.
        let precioArticulo = ''
        if (precios.length > 1) {
            precioArticulo = (precios[1] as HTMLElement).innerText
        } else if (precios.length === 1) {
            precioArticulo = (precios[0] as HTMLElement).innerText
        }

        const descuento = getTitle('.poly-price__disc_label')

        return { 
          marca, 
          nombreArticulo, 
          quienComercializa, 
          precioArticulo, 
          descuento 
        }
      })

      // Filtramos productos vacíos si por alguna razón el selector falló en alguno
      const productosValidos = productos.filter(p => p.nombreArticulo !== '')

      console.log(`Scraping finalizado. ${productosValidos.length} productos encontrados.`)

      // 3. Responder al Popup (respuesta síncrona/directa)
      sendResponse({ result: productosValidos })

      // 4. Enviar copia al Background (igual que en tu archivo de Falabella)
      try {
        chrome.runtime.sendMessage({ type: 'scrapedData', data: productosValidos }, (resp) => {
           // Callback opcional del background
        })
      } catch (err) {
        console.warn('Could not send scraped data to background', err)
      }

    } catch (err) {
      console.error('MercadoLibre scrape error', err)
      sendResponse({ error: String(err) })
    }
    
    // Importante: devolver true para indicar que la respuesta podría ser asíncrona (buena práctica en Chrome Ext)
    return true
  }
})