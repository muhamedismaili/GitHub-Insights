import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get("username");

  if (!username) {
    return NextResponse.json(
      { error: "Missing required query parameter: username" },
      { status: 400 },
    );
  }

  const response = await fetch(
    `https://api.github.com/users/${encodeURIComponent(username)}/repos`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      },
    },
  );

  if (!response.ok) {
    return NextResponse.json(
      { error: `GitHub API error: ${response.status}` },
      { status: response.status },
    );
  }

  const data = await response.json();
  return NextResponse.json(data);
}
