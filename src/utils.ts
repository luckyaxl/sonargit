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

/**
 * Extracts SonarQube URL from the given text.
 *
 * @param text - The input text.
 * @returns The SonarQube URL or null if not found.
 */
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

/**
 * Validate date format YYYY-MM-DD.
 *
 * @param dateString - The input text.
 * @returns A boolean indicating whether the date format is valid.
 */
export const isValidDateFormat: DateFormatter = (dateString: string) => {
  const dateFormatRegex = /^\d{4}-\d{2}-\d{1,2}$/;
  return dateFormatRegex.test(dateString);
};

/**
 * Check required env var.
 *
 * @param envVariables - The input env variables.
 * @returns void.
 */
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
    process.exit(1); // Exit the process with an error code
  }

  return;
};

export const successColorAnsi = (str: string) => {
  return `\x1b[32m${str}\x1b[37m`;
};

export const errorColorAnsi = (str: string) => {
  return `\x1b[31m${str}\x1b[37m`;
};
