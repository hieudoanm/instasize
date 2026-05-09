'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.imageUrlToBase64 =
  exports.getImages =
  exports.CHROMIUM_EXECUTABLE_PATH =
    void 0;
const puppeteer_1 = __importDefault(require('puppeteer'));
exports.CHROMIUM_EXECUTABLE_PATH = process.env.CHROMIUM_EXECUTABLE_PATH;
const getImages = async (instagramURL) => {
  console.info('get.images');
  const browser = await puppeteer_1.default.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    browser: !exports.CHROMIUM_EXECUTABLE_PATH ? 'firefox' : undefined,
    executablePath: exports.CHROMIUM_EXECUTABLE_PATH,
    headless: true,
  });
  console.info('puppeteer.launch');
  const page = await browser.newPage();
  console.info('browser.newPage');
  const [url] = instagramURL.split('?');
  const embedURL = url.endsWith('/') ? `${url}embed` : `${url}/embed`;
  console.info(`embedURL=${embedURL}`);
  await page.goto(embedURL, { waitUntil: 'networkidle2', timeout: 60000 });
  console.info('page.goto');
  let buttonExists = (await page.$('button[aria-label="Next"]')) !== null;
  console.info(`Next button exists: ${buttonExists}`);
  while (buttonExists) {
    await page.waitForSelector('[aria-label="Next"]', { visible: true });
    await page.click('[aria-label="Next"]');
    buttonExists = (await page.$('button[aria-label="Next"]')) !== null;
    console.info(`Next button exists: ${buttonExists}`);
  }
  console.info('carousel navigation complete');
  const images = await page.evaluate(() => {
    const imageElements = document.querySelectorAll('.Content.EmbedFrame img');
    return Array.from(imageElements).map((img) => img.src);
  });
  console.info(images);
  await browser.close();
  return { images };
};
exports.getImages = getImages;
const imageUrlToBase64 = async (imageUrl) => {
  try {
    const response = await fetch(imageUrl);
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const buffer = Buffer.from(await response.arrayBuffer());
    return `data:${contentType};base64,${buffer.toString('base64')}`;
  } catch (error) {
    console.error(`Error converting image: ${error}`);
    return null;
  }
};
exports.imageUrlToBase64 = imageUrlToBase64;
