/**
 * Extracts SonarQube URL from the given text.
 *
 * @param {string} text - The input text.
 * @returns {Promise<string | null>} The SonarQube URL.
 */

function extractSonarQubeUrl(text) {
  const regex = /\[View in SonarQube\]\(([^)]+)\)/;
  const match = text.match(regex);

  if (match && match[1]) {
    return match[1];
  } else {
    console.error('[!] SonarQube URL not found in the text.');
    return null;
  }
}

/**
 * Validate date format YYYY-MM-DD.
 *
 * @param {string} dateString - The input text.
 * @returns {boolean}
 */

function isValidDateFormat(dateString) {
  const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;
  return dateFormatRegex.test(dateString);
}

module.exports = { extractSonarQubeUrl, isValidDateFormat }