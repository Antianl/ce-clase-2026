import { showResults } from '../utils/index'

const scrapeButtonElement = document.getElementById('scrapeButton') as HTMLButtonElement | null
const clearButtonElement = document.getElementById('clearButton') as HTMLButtonElement | null
let port: chrome.runtime.Port | null = null;

async function init() {
  // Wire up click handlers
  scrapeButtonElement?.addEventListener('click', async () =>  {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab?.id) {
        console.error('No active tab id');
        return;
    }
    const port = chrome.tabs.connect(tab.id, { name: 'scrape' });

    port.onMessage.addListener((msg) => {
        if (msg.type === 'progress') console.log('Progreso:', msg.data);
        if (msg.type === 'result') {
            const products = msg.data || []
            const resultEl = document.getElementById('result')

            showResults(resultEl, products)
        };
        if (msg.type === 'error') console.error('Error:', msg.error);
    });

    port.onDisconnect.addListener(() => {
        const err = chrome.runtime.lastError;
        if (err) console.warn('Port disconnected:', err.message);
    });


    port.postMessage({ type: 'scrape' });
  })

  clearButtonElement?.addEventListener('click', () => {
    const resultEl = document.getElementById('result')
    if (resultEl) resultEl.innerHTML = ''
  })
}



init()
