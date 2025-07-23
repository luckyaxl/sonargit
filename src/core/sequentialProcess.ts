import moment from "moment";
import fs from "fs";
import { fetchIssueComments } from "./issueComments";
import {
  errorColorAnsi,
  extractRepoName,
  successColorAnsi,
  warningColorAnsi,
} from "../utils";

export const sequentialProcess = async (
  items: any[],
  outputDir: string,
  logFilePath: string
) => {
  try {
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    for (const item of items) {
      try {
        const comments = await fetchIssueComments(item.comments_url);

        const percentage = comments?.percentage || '0';

        const mergedAt = moment
          .utc(item.pull_request.merged_at)
          .utcOffset(7)
          .format("DD MMM YYYY");
        const prUrl = item.html_url;

        const msg = `${mergedAt} ${warningColorAnsi(prUrl)} ${percentage}`;

        fs.appendFile(
          logFilePath,
          `${mergedAt},${prUrl},${percentage?.replace("%", "")}\n`,
          (err) => {
            if (err) {
              console.error(
                `${errorColorAnsi("[!]")} Error writing to log file:`,
                err
              );
            }
          }
        );

        console.log(`${successColorAnsi("[+]")} ${msg}`);

        await delay(1000);
      } catch (error) {
        console.log(
          `${errorColorAnsi("[!]")} Error processing pull request:`,
          error
        );
        process.exit();
      }
    }

    console.log(`\nDone. see the results under ${outputDir}`);
  } catch (error) {
    console.log(error);
    process.exit();
  }

  process.exit();
};
