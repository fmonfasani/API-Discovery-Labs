const { chromium } = require('playwright');

async function discoverDynamicEndpoints(targetUrl, filter = '/api/') {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const endpoints = new Set();

  page.on('request', (request) => {
    const url = request.url();
    if (url.includes(filter)) {
      endpoints.add(url);
    }
  });

  console.log(`🌐 Navegando y espiando endpoints dinámicos en: ${targetUrl}`);

  try {
    await page.goto(targetUrl, { waitUntil: 'networkidle' });
    await page.waitForTimeout(5000); // Espera 5s para asegurar carga

    console.log(`✅ Endpoints dinámicos descubiertos:`);
    console.log([...endpoints]);
  } catch (error) {
    console.error(`❌ Error durante el scraping dinámico: ${error.message}`);
  } finally {
    await browser.close();
  }

  return [...endpoints];
}

module.exports = { discoverDynamicEndpoints };

