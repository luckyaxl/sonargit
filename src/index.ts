#!/usr/bin/env node

import * as commander from "commander";
import dotenv from "dotenv";
import figlet from "figlet";
import fs from "fs";
import moment from "moment";
import os from "os";
import path from "path";
import { fetchPullRequests } from "./core";
import { checkEnvVar, isValidDateFormat, successColorAnsi } from "./utils";

const userHomeDir = os.homedir();
const projectDir = `${userHomeDir}/sonargit`;

dotenv.config({ path: `${userHomeDir}/sonargit/sonargit.config` });

const validateFormat = (value: string) => {
  const date = String(value).split("/");
  const startDate = date[0];

  if (!isValidDateFormat(startDate)) {
    throw new commander.InvalidArgumentError("YYYY-MM-DD");
  }

  return value;
};

const banner = `${successColorAnsi("SonarGit v0.0.1")}
Automated bot scraper to streamline data extraction from GitHub pull requests
and capture dynamic SonarQube screenshots.\n`;

console.log(
  figlet.textSync("SonarGit", {
    font: "3D-ASCII",
  })
);
console.log(banner);

const shell = new commander.Command();

shell
  .usage("-d <date>")
  .requiredOption(
    "-d, --date <date>",
    "Specify date range in format YYYY-MM-DD/YYYY-MM-DD",
    validateFormat
  )
  .option("-o, --output <output>", "Specify output file name, ex: output.csv");

shell.parse();

const options = shell.opts();
const date = String(options.date).trim().split("/");
const startDate = date[0];
const endDate = date[1];
const outputFile = options.output;

const outputDirectory = `${projectDir}/${moment(new Date()).format(
  "YYYY-MM-DD_hh.mm.ss"
)}`;

const config = `SONARQUBE_URL=
SONAR_LOGIN=
SONAR_PASSWORD=
GITHUB_TOKEN=

OWNER=
REPO=
AUTHOR=
BASE_BRANCH=main\n`;

const fileName = outputFile
  ? path.basename(outputFile)
  : `${startDate}..${endDate}.csv`;

const configPath = `${userHomeDir}/sonargit/sonargit.config`;
const logFilePath = path.join(outputDirectory, fileName);

if (!fs.existsSync(projectDir)) {
  fs.mkdirSync(projectDir, { recursive: true });
}

if (!fs.existsSync(configPath)) {
  fs.writeFileSync(configPath, config);
}

const requiredEnvVariables = [
  "SONARQUBE_URL",
  "SONAR_LOGIN",
  "SONAR_PASSWORD",
  "GITHUB_TOKEN",
  "OWNER",
  "REPO",
  "AUTHOR",
  "BASE_BRANCH",
];

checkEnvVar(requiredEnvVariables);
fetchPullRequests({ startDate, endDate, outputDirectory, logFilePath });
