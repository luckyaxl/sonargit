const fetch = require('node-fetch');
const { extractSonarQubeUrl } = require('../utils');

require('dotenv').config();

const env = process.env;

/**
 * @typedef {Object} RegularCommentsResult
 * @property {string} percentage - The coverage percentage.
 * @property {string | null} sonarQubeUrl - The SonarQube URL.
 */

/**
 * Fetches regular comments for a given pull request.
 *
 * @param {number} pullNumber - The pull request number.
 * @returns {Promise<RegularCommentsResult | undefined>} The result containing percentage and SonarQube URL.
 */

async function fetchRegularComments(pullNumber) {
  try {
    const response = await fetch(`https://api.github.com/repos/${env.OWNER}/${env.REPO}/issues/${pullNumber}/comments`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `Bearer ${env.GITHUB_TOKEN}`
      }
    });

    if (response.ok) {
      const regularComments = await response.json() || [];

      let percentage = 0;
      let sonarQubeUrl;

      const regex = /(\d+\.\d+%)\s*Coverage/;

      const sonarQubeBotComments = regularComments?.filter(item => item.user.login === 'catalyst-sonarqube-app-jt[bot]') || [];

      sonarQubeBotComments.slice(-1).forEach(comment => {
        sonarQubeUrl = extractSonarQubeUrl(comment.body) || sonarQubeUrl;

        const match = comment.body.match(regex);
        if (match) percentage = match[1];
        else console.log('[!] Percentage not found in the text.');
      });

      return {
        percentage,
        sonarQubeUrl
      }
    }
  } catch (error) {
    console.error(`[!] Failed to fetch regular comments. ${error}`);
  }
}

module.exports = { fetchRegularComments }