import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get("username");
  const page = request.nextUrl.searchParams.get("page") ?? "1";
  const perPage = request.nextUrl.searchParams.get("per_page") ?? "12";

  if (!username) {
    return NextResponse.json(
      { error: "Missing required query parameter: username" },
      { status: 400 }
    );
  }

  const response = await fetch(
    `https://api.github.com/users/${encodeURIComponent(username)}/repos?page=${page}&per_page=${perPage}`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      },
    }
  );

  if (!response.ok) {
    return NextResponse.json(
      { error: `GitHub API error: ${response.status}` },
      { status: response.status }
    );
  }

  const data = await response.json();
  const linkHeader = response.headers.get("Link");
  const hasNextPage = linkHeader?.includes('rel="next"') ?? false;

  return NextResponse.json({ repos: data, hasNextPage });
}