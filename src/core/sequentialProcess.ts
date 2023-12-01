import moment from "moment";
import puppeteer from "puppeteer";
import fs from "fs";
import { fetchRegularComments } from "./regularComments";
import { successColorAnsi } from "../utils";

const env = process.env;

export const sequentialProcess = async (
  items: any[],
  outputDir: string,
  logFilePath: string
) => {
  const browser = await puppeteer.launch({
    headless: "new",
  });
  const page = await browser.newPage();

  await page.setViewport({ width: 1512, height: 850 });

  await page.goto(`${env.SONARQUBE_URL}/sessions/new?return_to=%2F`, {
    waitUntil: "networkidle0",
  });

  await page.type("#login", env.SONAR_LOGIN as string);
  await page.type("#password", env.SONAR_PASSWORD as string);

  await page.keyboard.press("Enter");

  await page.waitForNavigation({
    waitUntil: "networkidle0",
  });

  for (const item of items) {
    try {
      const comments = await fetchRegularComments(item.number);

      const percentage = comments?.percentage;
      const sonarQubeUrl = comments?.sonarQubeUrl;

      if (sonarQubeUrl) {
        await page.goto(sonarQubeUrl, {
          waitUntil: "networkidle0",
        });
        await page.screenshot({
          path: `${outputDir}/screenshot_pr_${item.number}_${env.REPO}.png`,
        });
      }

      const msg = `${moment
        .utc(item.pull_request.merged_at)
        .utcOffset(7)
        .format("DD MMM YYYY")}, ${item.html_url}, ${percentage}`;

      fs.appendFile(logFilePath, `${msg}\n`, (err) => {
        if (err) {
          console.error(
            `Error writing to log file:`,
            err
          );
        }
      });

      console.log(`${successColorAnsi("[+]")} ${msg}`);
    } catch (error) {
      console.error(
        `Error processing pull request:`,
        error
      );
    }
  }

  console.log(
    `\nDone. see results under ${outputDir}`
  );

  await browser.close();
  process.exit(1);
};
