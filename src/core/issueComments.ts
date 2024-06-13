import fetch from "node-fetch";
import { errorColorAnsi, extractSonarQubeUrl } from "../utils";

const env = process.env;

interface IssueCommentsResult {
  percentage?: string;
  sonarQubeUrl?: string;
}

const botPrefix = "[bot]";

export const fetchIssueComments = async (
  commentUrl: string
): Promise<IssueCommentsResult | undefined> => {
  let percentage: string = "100"; // default value if no percentage is found
  let sonarQubeUrl: string | undefined = undefined;

  try {
    const response = await fetch(commentUrl, {
      headers: {
        Accept: "application/vnd.github.json",
        Authorization: `Bearer ${env.GITHUB_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const regularComments: any[] = await response.json();

    const regex = /(\d+\.\d+%)\s*Coverage/;

    const sonarQubeBotComments =
      regularComments?.filter((item) =>
        String(item.user?.login).includes(botPrefix)
      ) || [];

    sonarQubeBotComments?.slice(-1).forEach((comment) => {
      sonarQubeUrl = extractSonarQubeUrl(comment.body) || sonarQubeUrl;

      const match = comment.body.match(regex);
      if (match) percentage = match[1];
    });
  } catch (error) {
    console.error(
      `${errorColorAnsi("[!]")} Failed to fetch regular comments. ${error}`
    );
    process.exit(1);
  }

  return {
    percentage,
    sonarQubeUrl,
  };
};
