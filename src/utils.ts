import moment from "moment";
import os from "os";

interface SonarQubeExtractor {
  (text: string): string | null;
}

interface DateFormatter {
  (dateString: string): boolean;
}

interface CheckEnvVar {
  (envVariables: string[]): void;
}

export const extractSonarQubeUrl: SonarQubeExtractor = (text: string) => {
  const regex = /\[View in SonarQube\]\(([^)]+)\)/;
  const match = text.match(regex);

  if (match && match[1]) {
    return match[1];
  } else {
    console.error("SonarQube URL not found in the text.");
    return null;
  }
};

export const isValidDateFormat: DateFormatter = (dateString: string) => {
  const dateFormatRegex = /^\d{2}\/\d{2}\/\d{4}$/;
  return dateFormatRegex.test(dateString);
};

export const checkEnvVar: CheckEnvVar = (envVariables: string[]) => {
  const missingVariables: string[] = [];

  envVariables.forEach((variable) => {
    if (!process.env[variable]) {
      missingVariables.push(variable);
    }
  });

  if (missingVariables.length > 0) {
    console.error(
      `Error: The following config var are required but not set: \n${missingVariables.join(
        ", "
      )} \n\nsee ${os.homedir()}/sonargit/sonargit.config`
    );
    process.exit(1);
  }

  return;
};

export const formatDate = (str: string) => {
  if (!str) {
    return null;
  }

  return moment(str, "DD/MM/YYYY").format("DD MMM YYYY");
};

export const formatDateGit = (str: string) => {
  return moment(str, "DD/MM/YYYY").format("YYYY-MM-DD");
};

export const successColorAnsi = (str: string) => {
  return `\x1b[1;32m${str}\x1b[0;0m`;
};

export const errorColorAnsi = (str: string) => {
  return `\x1b[1;31m${str}\x1b[0m`;
};

export const warningColorAnsi = (str: string) => {
  return `\x1b[0;33m${str}\x1b[0;0m`;
};
