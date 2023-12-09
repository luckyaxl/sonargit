# Sonargit Scraper

![SonarGit Scraper](https://lh3.googleusercontent.com/pw/ADCreHcj2NjQi15XV0sRSI-WbbEQ9oVZKXEfoW-ciCPsLKTCXDsHW6AbkyJf9uAni2HxUaOf86-d6SlGzzNNPAWBeJhKyPLww4uS4cQB05XSaCVB1tzMrBSYsRLUwsYKLCss_kQdJNHUqAy6N9c443tO69JUTvvSPvBCku8_KA1bTSEzQKtrHk1e27c-LS4EeK6xy5sU9x1D-WGT4fJh9a0P5DrwNvnU-dn8R5j7IVpf8BuxA9YEu0_TRghYDFyEsyT80qciUGjzHvMUVaxYDR-tHJhoFiULq5tXDg2WvBwXOlxTG91un-FMjb8yZZxgY3zdFHA6lDglZa8OeqYdT9luhiYQzOiv9hwi9W1RketVaHlCVC_A82uHQ_mAoRI4nunakm0l3Txex5lzNNP1oSSdG3r39UCkkVM2COT9ctN5j3LU4eGD3MdG8v1k71XFvYMyUna0qhuChlx-HEqUQ1IXa4zrZs_AJ5i6ONAxvUBeFcVM9wnSJSpJ8FENQLXRbynji42129bEThiMb_qd9XFaHes0vjYnTgbrYwo_sQm8tUwcrK9y-e4J6pZG-S8AY3eR5PFjoydlw3xj03FXVuDk3kPeaqUecKbLaHfjeHwRmql0Q8Odu-dE1QRFQ6oRZ_7f3AALQem5rjixskKz9Nf14jHX2lIZj4JzzXbVf7B39SgOns36PV8Ka-sf_mwxI12Gcl-PF2vD43hONeT0bwhH-F5KyC6nyYNZ2N6yUH-vBdnL0NtrIxZkS9Hhj-Uizj3euOUcUTsS9-HH8u19X_531vYAIUaYa4cpniuwMNzBFPjR9J5LlJQtievkktUaVzHGyhr87tjHtF3vjy-8-3pfHNEWmPSJ524QEl4bEKy9Ozl3tt9_nSum5VbnponnHvIK5_pjqIJDWA4vWfryurKbWyJ-qt6IkwtAOrMRu9ibUiXL=w1364-h990-s-no-gm?authuser=0)

Introducing Sonargit, an automated bot scraper engineered to streamline data extraction from GitHub pull requests and capture dynamic SonarQube screenshots. Tailored specifically for Catalyst engineers. Unleash productivity with a bot that effortlessly extracts, analyzes, and visualizes KPI data.

## Requirements

Node 18.0 and later.

### Installation

```bash
npm install -g sonargit
```

### Example Usage

```bash
sonargit -s 10/10/2023
```

### Logs

The log file will be generated in the `~/Users/<username>/sonargit` directory

## Function Breakdown

### GitHub API Requests

The code fetches closed pull requests from a GitHub repository within a specified date range and meeting certain criteria (e.g., merged into a specific branch, closed by a specific author).
The GitHub API is utilized to retrieve information about pull requests, including the total count and an array of items.

### Fetching Issue Comments and Extracting SonarQube URL

The `fetchIssueComments` function fetches comments on a GitHub pull request, extracts coverage percentage and SonarQube URL from the latest comment, and returns the result as an object.

The `extractSonarQubeUrl` function uses a regular expression to extract the SonarQube URL from a given text.

### Web Scraping with Puppeteer

Puppeteer is used to launch a headless browser and navigate to a SonarQube login page.
It then logs in with a provided username and password.
After logging in, it iterates through an array of pull requests and takes a screenshot of the corresponding SonarQube page.

### Sequential Processing of Pull Requests

The `sequentialProcess` function used to handle an array of pull requests in a sequential execution to avoid exceeding GitHub rate limits and prevent high memory usage when using Puppeteer.

### Usage of Moment.js

The `moment` library is used for date and time formatting.

### GitHub API Authorization

The code requires a GitHub personal access token (token) for making authenticated requests to the GitHub API.
