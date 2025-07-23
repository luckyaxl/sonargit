import fs from "fs";
import moment from "moment";
import fetch from "node-fetch";
import { sequentialProcess } from "../core";
import { errorColorAnsi, successColorAnsi, warningColorAnsi } from "../utils";

const env = process.env;

interface FetchPullRequests {
  startDate: string;
  endDate: string;
  outputDirectory: string;
  logFilePath: string;
}

interface GitHubApiResponse {
  total_count: number;
  items: any[];
}

export const fetchPullRequests = async ({
  startDate,
  endDate,
  outputDirectory,
  logFilePath,
}: FetchPullRequests) => {
  console.log(
    `${successColorAnsi("[*]")} Fetching data from author: ${warningColorAnsi(
      env.AUTHOR as string
    )}`
  );

  let page = 1;
  let hasNext = true;
  let totalData = 0;
  let data: GitHubApiResponse["items"] = [];

  while (hasNext) {
    const queryString: string = `is:pr is:closed merged:${startDate}..${endDate} sort:updated-asc author:${env.AUTHOR} user:${env.OWNER}`;

    const apiUrl: string = `https://api.github.com/search/issues?q=${encodeURIComponent(
      queryString
    )}&page=${page}&per_page=100`;

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

      const responseData: GitHubApiResponse = await response.json();

      data = [...data, ...responseData.items];
      totalData = responseData.total_count;

      page += 1;

      hasNext = data.length < responseData.total_count;
    } catch (error: any) {
      console.error(
        `${errorColorAnsi("[!]")} Error fetching data from GitHub API:`,
        error.message
      );
      process.exit(1);
    }
  }

  console.log(
    `${successColorAnsi(
      "[*]"
    )} Found ${totalData} pull request between ${successColorAnsi(
      moment(startDate).format("DD MMM YYYY")
    )} - ${successColorAnsi(moment(endDate).format("DD MMM YYYY"))}`
  );
  console.log(`${successColorAnsi("[*]")} Start scraping...\n`);

  if (!fs.existsSync(outputDirectory)) {
    fs.mkdirSync(outputDirectory, { recursive: true });
  }

  sequentialProcess(data, outputDirectory, logFilePath);
};
