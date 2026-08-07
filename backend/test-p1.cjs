const puppeteer = require('puppeteer');

(async () => {
  console.log('Starting P1 check...');
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  
  await page.goto('http://localhost:5174/market-research');
  await page.waitForSelector('h1');
  let title = await page.$eval('h1', el => el.textContent);
  console.log('Market Research title:', title);

  await page.goto('http://localhost:5174/fundraising-prep');
  await page.waitForSelector('h1');
  title = await page.$eval('h1', el => el.textContent);
  console.log('Fundraising Prep title:', title);

  await page.goto('http://localhost:5174/competitors');
  await page.waitForSelector('h1');
  title = await page.$eval('h1', el => el.textContent);
  console.log('Competitors title:', title);

  await browser.close();
})();
