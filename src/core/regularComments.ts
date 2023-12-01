import fetch from "node-fetch";
import { errorColorAnsi, extractSonarQubeUrl } from "../utils";

const env = process.env;

interface RegularCommentsResult {
  percentage?: string;
  sonarQubeUrl?: string;
}

export const fetchRegularComments = async (
  pullNumber: string
): Promise<RegularCommentsResult | undefined> => {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${env.OWNER}/${env.REPO}/issues/${pullNumber}/comments`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          Authorization: `Bearer ${env.GITHUB_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const regularComments: any[] = await response.json();

    let percentage: string = "0";
    let sonarQubeUrl: string | undefined = undefined;

    const regex = /(\d+\.\d+%)\s*Coverage/;

    const sonarQubeBotComments =
      regularComments?.filter(
        (item) => item.user.login === "catalyst-sonarqube-app-jt[bot]"
      ) || [];

    sonarQubeBotComments?.slice(-1).forEach((comment) => {
      sonarQubeUrl = extractSonarQubeUrl(comment.body) || sonarQubeUrl;

      const match = comment.body.match(regex);
      if (match) percentage = match[1];
      else
        console.log(
          `${errorColorAnsi("[!]")} Percentage not found in the text.`
        );
    });

    return {
      percentage,
      sonarQubeUrl,
    };
  } catch (error) {
    console.error(
      `${errorColorAnsi("[!]")} Failed to fetch regular comments. ${error}`
    );
  }

  return undefined;
};
