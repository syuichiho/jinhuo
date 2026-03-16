const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const screenshotsDir = '/home/zhou/projects/jinhuo-tech/screenshots';
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

async function takeScreenshots() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // 1. 首页 - 桌面端
  console.log('📸 截取首页（桌面端）...');
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto('http://localhost:5177', { waitUntil: 'networkidle0' });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(screenshotsDir, '01-home-desktop.png'), fullPage: false });

  // 2. 首页 - 手机端
  console.log('📸 截取首页（手机端）...');
  await page.setViewport({ width: 375, height: 812 });
  await page.goto('http://localhost:5177', { waitUntil: 'networkidle0' });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(screenshotsDir, '02-home-mobile.png'), fullPage: true });

  // 3. 作品页
  console.log('📸 截取作品页...');
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto('http://localhost:5177/works', { waitUntil: 'networkidle0' });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(screenshotsDir, '03-works.png'), fullPage: true });

  // 4. 关于页
  console.log('📸 截取关于页...');
  await page.goto('http://localhost:5177/about', { waitUntil: 'networkidle0' });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(screenshotsDir, '04-about.png'), fullPage: true });

  // 5. 联系页
  console.log('📸 截取联系页...');
  await page.goto('http://localhost:5177/contact', { waitUntil: 'networkidle0' });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(screenshotsDir, '05-contact.png'), fullPage: false });

  // 6. 后台登录页
  console.log('📸 截取后台登录页...');
  await page.goto('http://localhost:5177/admin/login', { waitUntil: 'networkidle0' });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(screenshotsDir, '06-admin-login.png'), fullPage: false });

  await browser.close();

  console.log('\n✅ 截图完成！');
  console.log(`📁 保存位置: ${screenshotsDir}`);
}

takeScreenshots().catch(console.error);