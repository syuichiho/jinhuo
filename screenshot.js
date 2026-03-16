const puppeteer = require('puppeteer');
const fs = require('fs');

async function screenshot() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  // 截取首页
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0', timeout: 30000 });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'screenshots/homepage.png', fullPage: true });
  console.log('✅ homepage.png');
  
  // 截取作品页
  await page.goto('http://localhost:5173/works', { waitUntil: 'networkidle0', timeout: 30000 });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'screenshots/works.png', fullPage: true });
  console.log('✅ works.png');
  
  // 截取关于页
  await page.goto('http://localhost:5173/about', { waitUntil: 'networkidle0', timeout: 30000 });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'screenshots/about.png', fullPage: true });
  console.log('✅ about.png');
  
  await browser.close();
  console.log('Done!');
}
screenshot().catch(console.error);
