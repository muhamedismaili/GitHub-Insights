export type GithubUser = {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
};

export type GithubUserSearchResult = {
  total_count: number;
  items: GithubUser[];
};

export type GithubRepo = {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
};