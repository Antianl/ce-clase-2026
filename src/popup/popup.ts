import { showResults } from '../utils/index'

const scrapeButtonElement = document.getElementById('scrapeButton') as HTMLButtonElement | null
const clearButtonElement = document.getElementById('clearButton') as HTMLButtonElement | null

async function init() {
  // Wire up click handlers
  scrapeButtonElement?.addEventListener('click', async () =>  {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true })
    const activeTab = tabs && tabs[0]

    if (!activeTab || typeof activeTab.id !== 'number') {
        console.error('No active tab with numeric id found. Aborting script injection.')
        return
    }

    // Request content script to scrape current page. Content script must listen for {type: 'scrape'}
    const response: any = await new Promise((resolve) => {
        chrome.tabs.sendMessage(activeTab.id, { type: 'scrape' }, (res) => {
        resolve(res)
        })
    })

    if (!response) {
        console.warn('No response from content script on active tab')
        return
    }

    const products = response.result || []
    const resultEl = document.getElementById('result')

    showResults(resultEl, products)
  })
  clearButtonElement?.addEventListener('click', () => {
    const resultEl = document.getElementById('result')
    if (resultEl) resultEl.innerHTML = ''
  })
}



init()
