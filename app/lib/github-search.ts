import { GithubUserSearchResult } from "@/app/lib/definitions";

export async function searchGithubUsers(query: string): Promise<GithubUserSearchResult> {
  const response = await fetch(
    `https://api.github.com/search/users?q=${encodeURIComponent(query)}`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`);
  }

  return response.json();
}