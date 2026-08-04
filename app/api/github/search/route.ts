import { NextRequest, NextResponse } from "next/server";
import { GithubUserSearchResult } from "@/app/lib/definitions";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q");

  if (!query) {
    return NextResponse.json(
      { error: "Missing required query parameter: q" },
      { status: 400 }
    );
  }

  const response = await fetch(
    `https://api.github.com/search/users?q=${encodeURIComponent(query)}`,
    { headers: { Accept: "application/vnd.github+json" } }
  );

  if (!response.ok) {
    return NextResponse.json(
      { error: `GitHub API error: ${response.status}` },
      { status: response.status }
    );
  }

  const data: GithubUserSearchResult = await response.json();
  return NextResponse.json(data);
}