# Sonargit Scraper

![SonarGit Scraper](src/images/banner.png)

Introducing Sonargit, an automated bot scraper engineered to streamline data extraction from GitHub pull requests and capture dynamic SonarQube screenshots. Tailored specifically for Catalyst engineers. Unleash productivity with a bot that effortlessly extracts, analyzes, and visualizes KPI data.

## Requirements

Node 18.0 and later.

### Installation

```bash
npm install -g sonargit
```

### Usage

Execute SonarGit Scraper with the desired start date:

```bash
sonargit -s 10/10/2023
```

### Logs

Log files are generated in the ~/Users/<username>/sonargit directory.

## Features

### GitHub API Integration

SonarGit leverages the GitHub API to fetch closed pull requests from a repository within a specified date range and user-defined criteria. This includes pull requests merged into specific branches or closed by particular authors.

### Extracting SonarQube Data from Comments

The tool fetches comments on GitHub pull requests, extracting coverage percentages and SonarQube URLs from the latest comment. This information is then presented in an organized format.

### Puppeteer Web Scraping

Utilizing Puppeteer, SonarGit launches a headless browser, navigates to a SonarQube login page, and logs in with user-provided credentials. It then iterates through pull requests, capturing screenshots of the corresponding SonarQube pages.

### Sequential Processing

SonarGit employs the `sequentialProcess` function to handle pull requests sequentially, avoiding GitHub rate limits and mitigating high memory usage when using Puppeteer.

### Moment.js Integration

The tool utilizes the Moment.js library for effective date and time formatting, ensuring a consistent and user-friendly experience.

### GitHub API Authorization

SonarGit requires a GitHub personal access token for making authenticated requests to the GitHub API, ensuring secure and authorized data retrieval.

## License

SonarGit Scraper is licensed under the [MIT License](https://github.com/luckyaxl/sonargit/blob/main/LICENSE).

## Contributing

For information on contributing to SonarGit Scraper, please refer to the [Contributing Guidelines](https://github.com/luckyaxl/sonargit/blob/main/CONTRIBUTING.md).

## Support

For support and bug reporting, please open an issue on the [issue tracker](https://github.com/luckyaxl/sonargit/issues).

## Acknowledgments

Special thanks to the contributors who have dedicated their time and effort to improve SonarGit Scraper.
