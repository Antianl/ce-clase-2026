import { buildFormHtml, handleInjectionInit } from '../utils/index'

const scrapeButtonElement = document.getElementById('scrapeButton') as HTMLButtonElement | null
const clearButtonElement = document.getElementById('clearButton') as HTMLButtonElement | null

async function init() {
  // Wire up click handlers
  scrapeButtonElement?.addEventListener('click', () => handleInjectionInit())
  clearButtonElement?.addEventListener('click', () => {
    const resultEl = document.getElementById('result')
    if (resultEl) resultEl.innerHTML = ''
  })
}

init()
