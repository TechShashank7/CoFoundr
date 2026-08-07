const puppeteer = require('puppeteer');

(async () => {
  console.log('Starting puppeteer test...');
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  
  await page.goto('http://localhost:5174');
  
  // Wait for onboarding or dashboard
  try {
    await page.waitForSelector('input[name="name"]', { timeout: 3000 });
    console.log('Onboarding form found, filling it...');
    await page.type('input[name="name"]', 'Puppeteer Startup');
    await page.type('input[name="oneLiner"]', 'Testing tasks');
    await page.type('input[name="industry"]', 'Testing');
    await page.type('input[name="targetMarket"]', 'Testers');
    await page.click('button[type="submit"]');
    await page.waitForSelector('.mono'); // wait for dashboard
  } catch (err) {
    console.log('Already onboarded or error:', err.message);
  }

  console.log('Navigating to Tasks...');
  await page.goto('http://localhost:5174/tasks');
  
  await page.waitForSelector('input[placeholder="New task title..."]');
  console.log('Typing task title...');
  await page.type('input[placeholder="New task title..."]', 'Puppeteer Test Task');
  
  console.log('Clicking ADD TASK...');
  await Promise.all([
    page.click('button[type="submit"]'),
    new Promise(r => setTimeout(r, 2000))
  ]);
  
  console.log('Done waiting. Checking if task appeared...');
  const tasks = await page.$$eval('.card strong', els => els.map(e => e.textContent));
  console.log('Found tasks:', tasks);
  
  await browser.close();
})();
