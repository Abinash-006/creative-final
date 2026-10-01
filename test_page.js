const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
  page.on('requestfailed', request => console.log('REQ FAILED:', request.url(), request.failure().errorText));
  
  await page.goto('http://localhost:3000/index.html', { waitUntil: 'networkidle' });
  
  const text = await page.evaluate(() => {
    const grid = document.getElementById('dynamicWorkGrid');
    return grid ? grid.innerText : 'NO GRID';
  });
  console.log('GRID CONTENT:', text);
  
  await browser.close();
})();
