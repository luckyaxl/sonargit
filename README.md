# Sonargit Scraper

![SonarGit Scraper](src/images/banner.png)

Introducing Sonargit, an innovative bot scraper engineered to streamline data extraction from GitHub pull requests and capture dynamic SonarQube screenshots. Built for Catalyst engineers, leveraging cutting-edge scraping technology and system integration. Unleash productivity with a robust system that effortlessly extracts, analyzes, and visualizes key data points, revolutionizing the way Catalyst engineers navigate project metrics. Hack into efficiency with Sonargit 

> "_where data meets precision for unparalleled productivity._"

## Requirements

Node 18.0 and later.

### Installation

```bash
~$: npm install -g sonargit
```

### Example Usage

```bash
~$: sonargit -d 2023-10-10.2023-12-30
```

### Logs

The log file will be generated in the `~/Users/<username>/sonargit` directory

## Function Breakdown

### GitHub API Requests

The code fetches closed pull requests from a GitHub repository within a specified date range and meeting certain criteria (e.g., merged into a specific branch, closed by a specific author).
The GitHub API is utilized to retrieve information about pull requests, including the total count and an array of items.

### Fetching Regular Comments and Extracting SonarQube URL

The `fetchRegularComments` function fetches comments on a GitHub pull request, extracts coverage percentage and SonarQube URL from the latest comment, and returns the result as an object.

The `extractSonarQubeUrl` function uses a regular expression to extract the SonarQube URL from a given text.

### Web Scraping with Puppeteer

Puppeteer is used to launch a headless browser and navigate to a SonarQube login page.
It then logs in with a provided username and password.
After logging in, it iterates through an array of pull requests, extracts information such as coverage percentage and SonarQube URL from GitHub comments, and takes a screenshot of the corresponding SonarQube page.

### Sequential Processing of Pull Requests

The `sequentialProcess` function is designed to meticulously handle an array of pull requests in a sequential manner. It systematically processes each pull request, ensuring that data fetching from GitHub adheres to rate limits. As part of its functionality, the function retrieves comprehensive information for each pull request. If a SonarQube URL is detected, the function initiates a secondary action by capturing a screenshot. Additionally, the sequential execution of SonarQube screenshot capturing is implemented to address concerns related to high memory usage, particularly when leveraging tools like Puppeteer.

### Usage of Moment.js

The `moment` library is used for date and time formatting.

### GitHub API Authorization

The code includes a GitHub personal access token (token) for making authenticated requests to the GitHub API.
