#!/usr/bin/env node

import * as commander from "commander";
import dotenv from "dotenv";
import figlet from "figlet";
import fs from "fs";
import moment from "moment";
import os from "os";
import path from "path";
import { fetchPullRequests } from "./core";
import {
  checkEnvVar,
  errorColorAnsi,
  formatDate,
  formatDateGit,
  isValidDateFormat,
  successColorAnsi,
} from "./utils";

const userHomeDir = os.homedir();
const projectDir = `${userHomeDir}/sonargit`;
const configPath = `${projectDir}/sonargit.config`;

dotenv.config({ path: configPath });

const shell = new commander.Command();

const validateFormat = (value: string) => {
  if (!isValidDateFormat(value)) {
    throw new commander.InvalidArgumentError("\naccepted format: DD/MM/YYYY");
  }

  return value;
};

const getVersion = () => {
  fetch(
    "https://raw.githubusercontent.com/luckyaxl/sonargit/refs/heads/main/package.json"
  )
    .then((response) => response.json())
    .then((data) => {
      return data.version;
    })
    .catch((error) => {
      console.error(error);
    });
};

const banner = `${successColorAnsi(`SonarGit v${getVersion()}`)}
Automated bot scraper to streamline data extraction from GitHub pull requests
and capture dynamic SonarQube screenshots.\n`;

console.log(figlet.textSync("SonarGit", { font: "3D-ASCII" }));
console.log(banner);

shell
  .usage("-s <date>")
  .requiredOption(
    "-s, --start <date> (REQUIRED)",
    "Specify start date in format DD/MM/YYYY",
    validateFormat
  )
  .option(
    "-e, --end <date>",
    "Specify end date in format DD/MM/YYYY",
    validateFormat
  )
  .option("-c, --capture <capture>", "Capture sonarqube screenshot")
  .option("-o, --output <output>", "Specify output file name, ex: output.csv")
  .parse();

const options = shell.opts();
const { start, end, output: outputFile, capture } = options;

let startDate = formatDateGit(start);
let endDate = moment().format("YYYY-MM-DD");

if (start && new Date(formatDateGit(start)) > new Date(formatDateGit(end))) {
  console.error(
    `${errorColorAnsi(
      "[!]"
    )} End date must be equal to or after the start date.\n`
  );
  shell.help();
}

if (end) {
  const isValid = validateFormat(end);
  if (isValid) {
    endDate = formatDateGit(end);
  }
}

const outputDirectory = `${projectDir}/${moment().format(
  "DD MMM YYYY HH.mm.ss"
)}`;

const config = `SONARQUBE_URL=
SONAR_LOGIN=
SONAR_PASSWORD=
GITHUB_TOKEN=

OWNER=
AUTHOR=\n`;

const fileName = outputFile
  ? path.basename(outputFile)
  : `Git ${formatDate(start)} - ${
      formatDate(end) || moment().format("DD MMM YYYY")
    }.csv`;

const logFilePath = path.join(outputDirectory, fileName);

if (!fs.existsSync(projectDir)) {
  fs.mkdirSync(projectDir, { recursive: true });
}

if (!fs.existsSync(configPath)) {
  fs.writeFileSync(configPath, config);
}

const requiredEnvVariables = ["GITHUB_TOKEN", "OWNER", "AUTHOR"];
const sonarQubeEnvVar = ["SONARQUBE_URL", "SONAR_LOGIN", "SONAR_PASSWORD"];

const envVar = capture
  ? [...requiredEnvVariables, ...sonarQubeEnvVar]
  : requiredEnvVariables;

checkEnvVar(envVar);
fetchPullRequests({
  startDate,
  endDate,
  outputDirectory,
  logFilePath,
  capture,
});
