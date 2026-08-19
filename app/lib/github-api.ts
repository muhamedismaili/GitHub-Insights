import { GithubRepo } from "@/app/lib/definitions";

const GITHUB_HEADERS = {
  Accept: "application/vnd.github+json",
  Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
};

export async function getUserRepos(
  username: string,
  page: number
): Promise<{ repos: GithubRepo[]; hasNextPage: boolean }> {
  const response = await fetch(
    `https://api.github.com/users/${encodeURIComponent(username)}/repos?page=${page}&per_page=12`,
    { headers: GITHUB_HEADERS }
  );

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`);
  }

  const repos: GithubRepo[] = await response.json();
  const linkHeader = response.headers.get("Link");
  const hasNextPage = linkHeader?.includes('rel="next"') ?? false;

  return { repos, hasNextPage };
}

export async function getRepo(owner: string, repo: string): Promise<GithubRepo> {
  const response = await fetch(
    `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`,
    { headers: GITHUB_HEADERS }
  );

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`);
  }

  return response.json();
}