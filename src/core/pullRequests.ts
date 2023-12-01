import fs from "fs";
import fetch from "node-fetch";
import { sequentialProcess } from "../core";
import { errorColorAnsi, successColorAnsi } from "../utils";

const env = process.env;

interface FetchPullRequests {
  startDate: string;
  endDate: string;
  outputDirectory: string;
  logFilePath: string;
}

export const fetchPullRequests = async ({
  startDate,
  endDate,
  outputDirectory,
  logFilePath,
}: FetchPullRequests) => {
  const queryString: string = `is:pr is:closed merged:${startDate}..${endDate} base:${env.BASE_BRANCH} sort:updated-asc author:${env.AUTHOR} repo:${env.REPO} user:${env.OWNER}`;

  const apiUrl: string = `https://api.github.com/search/issues?q=${encodeURIComponent(
    queryString
  )}&page=${env.PAGE}&per_page=${env.PER_PAGE}`;

  try {
    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();

    if (data) {
      console.log(
        `${successColorAnsi("[+]")} Total Pull Request: ${data.total_count}`
      );

      if (!fs.existsSync(outputDirectory)) {
        fs.mkdirSync(outputDirectory, { recursive: true });
      }

      sequentialProcess(data.items, outputDirectory, logFilePath);
    }
  } catch (error: any) {
    console.error(
      `${errorColorAnsi("[!]")} Error fetching data from GitHub API:`,
      error.message
    );
  }
};
