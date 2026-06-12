export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string[] }> },
) {
  const { slug } = await params;
  const endpoint = slug.join("/");

  // Forward query string parameters from the incoming request
  const { searchParams } = new URL(request.url);
  if (endpoint.includes("search/") || endpoint.includes("discover/")) {
    if (!searchParams.has("include_adult")) {
      searchParams.set("include_adult", "false");
    }
  }
  const queryString = searchParams.toString();
  const fullEndpoint = queryString ? `${endpoint}?${queryString}` : endpoint;

  try {
    const token =
      process.env.TMDB_AUTH_TOKEN || process.env.NEXT_PUBLIC_TMDB_AUTH_TOKEN;

    if (!token) {
      return Response.json(
        { error: "TMDB token not configured" },
        { status: 500 },
      );
    }

    const response = await fetch(
      `https://api.themoviedb.org/3/${fullEndpoint}`,
      {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        next: { revalidate: 3600 },
      },
    );

    if (!response.ok) {
      return Response.json(
        { error: `TMDB API error: ${response.status}` },
        { status: response.status },
      );
    }

    const data = await response.json();
    return Response.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("TMDB proxy error:", error);
    return Response.json(
      { error: "Failed to fetch from TMDB" },
      { status: 500 },
    );
  }
}
