/**
 * untung pake bot
 */
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const moment = require('moment');
const readline = require('readline');

require('dotenv').config();

const { isValidDateFormat } = require('./utils');
const { processPullRequestsSequentially } = require('./core/sequentialProcess');

const env = process.env;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('\x1b[33m[+]\x1b[37m SonarGit Scraper')

// Prompt start date
rl.question('\x1b[33m[+]\x1b[37m Enter start date (YYYY-MM-DD): ', (startDate) => {
  if (!startDate) {
    console.error('\x1b[91m[!] Start date is required. Exiting...\x1b[37m');
    rl.close();
    return;
  }

  if (!isValidDateFormat(startDate)) {
    console.error('[!] Invalid start date format. Exiting...');
    rl.close();
    return;
  }

  // Prompt end date
  rl.question('\x1b[33m[+]\x1b[37m Enter end date (YYYY-MM-DD): ', (endDate) => {
    if (!endDate) {
      console.error('\x1b[91m[!] End date is required. Exiting...\x1b[37m');
      rl.close();
      return;
    }

    if (!isValidDateFormat(endDate)) {
      console.error('[!] Invalid end date format. Exiting...');
      rl.close();
      return;
    }

    // Prompt custom file output
    rl.question('\x1b[33m[+]\x1b[37m Enter the custom output (ex: file.csv) [enter to skip]: ', (customPath) => {
      rl.close();

      const outputDirectory = `logs/${moment(new Date()).format('YYYY-MM-DD hh:mm:ss')}`
      const fileName = customPath ? path.basename(customPath) : `${startDate}..${endDate}.csv`;

      // Create the output directory if it doesn't exist
      if (!fs.existsSync(outputDirectory)) {
        fs.mkdirSync(outputDirectory, { recursive: true });
      }

      const logFilePath = path.join(outputDirectory, fileName);

      const queryString = `is:pr is:closed merged:${startDate}..${endDate} base:${env.BASE_BRANCH} sort:updated-asc author:${env.AUTHOR} repo:${env.REPO} user:${env.OWNER}`;
      const apiUrl = `https://api.github.com/search/issues?q=${encodeURIComponent(queryString)}&page=${env.PAGE}&per_page=${env.PER_PAGE}`;

      try {
        fetch(apiUrl, {
          headers: {
            Authorization: `Bearer ${env.GITHUB_TOKEN}`,
            Accept: 'application/vnd.github+json',
          },
        })
          .then(response => response.json())
          .then(async (data) => {
            if (data) {
              console.log(`\n[+] Total Data: ${data.total_count}`);
              await processPullRequestsSequentially(data.items, outputDirectory, logFilePath);
            }
          })
          .catch(error => {
            console.error('[!] Error fetching data from GitHub API:', error);
          });
      } catch (error) {
        console.error('[!] Unexpected error:', error);
      }
    });
  });
});
