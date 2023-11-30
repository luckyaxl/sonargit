const moment = require('moment');
const puppeteer = require('puppeteer');
const fs = require('fs');

require('dotenv').config();

const { fetchRegularComments } = require('./regularComments');

const env = process.env;

/**
 * Processes pull requests sequentially.
 *
 * @param {any[]} items - The array of pull requests.
 * @param {string} outputDir - The output directory.
 * @param {string} logFilePath - The output file.
 * @returns {Promise<void>} A promise that resolves when processing is complete.
 */

async function processPullRequestsSequentially(items, outputDir, logFilePath) {
  const browser = await puppeteer.launch({
    headless: 'new'
  });
  const page = await browser.newPage();

  await page.setViewport({ width: 1512, height: 850 });

  await page.goto(`${env.SONARQUBE}/sessions/new?return_to=%2F`, {
    waitUntil: 'networkidle0',
  });

  await page.type('#login', env.SONAR_LOGIN);
  await page.type('#password', env.SONAR_PASSWORD);

  await page.keyboard.press('Enter');

  await page.waitForNavigation({
    waitUntil: 'networkidle0',
  });

  for (const item of items) {
    try {
      const { percentage, sonarQubeUrl } = await fetchRegularComments(item.number);

      if (sonarQubeUrl) {
        await page.goto(sonarQubeUrl, {
          waitUntil: 'networkidle0',
        });
        await page.screenshot({ path: `${outputDir}/screenshot_pr_${item.number}_${env.REPO}.png` });
      }

      const msg = `${moment.utc(item.pull_request.merged_at).utcOffset(7).format('DD MMM YYYY')}, ${item.html_url}, ${percentage}`

      fs.appendFile(logFilePath, `${msg}\n`, (err) => {
        if (err) {
          console.error('[!] Error writing to log file:', err);
        }
      });

      console.log(msg);
    } catch (error) {
      console.error('[!] Error processing pull request:', error);
    }
  }

  await browser.close();
}

module.exports = { processPullRequestsSequentially }