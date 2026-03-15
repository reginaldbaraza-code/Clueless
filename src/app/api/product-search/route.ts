import { NextRequest, NextResponse } from "next/server";

export interface ProductSearchResult {
  title: string;
  thumbnail: string;
  link: string;
  price?: string;
  source?: string;
}

export async function GET(request: NextRequest) {
  const apiKey = process.env.SERPAPI_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Product search is not configured. Add SERPAPI_KEY to .env.local (get a key at serpapi.com)." },
      { status: 503 }
    );
  }

  const q = request.nextUrl.searchParams.get("q")?.trim();
  if (!q || q.length < 2) {
    return NextResponse.json(
      { error: "Query too short. Use at least 2 characters." },
      { status: 400 }
    );
  }

  try {
    const params = new URLSearchParams({
      engine: "google_shopping",
      q,
      api_key: apiKey,
      gl: "us",
      hl: "en",
    });
    const res = await fetch(`https://serpapi.com/search?${params.toString()}`, {
      next: { revalidate: 0 },
    });
    const data = await res.json().catch(() => ({}));

    if (data.error) {
      return NextResponse.json(
        { error: data.error || "Search failed." },
        { status: 502 }
      );
    }

    const shopping = data.shopping_results ?? [];
    const inline = data.inline_shopping_results ?? [];
    const combined = [...shopping, ...inline];
    const seen = new Set<string>();
    const results: ProductSearchResult[] = [];

    for (const item of combined) {
      const title = item.title?.trim();
      const thumb = item.thumbnail || item.serpapi_thumbnail;
      const link = item.link || item.product_link;
      if (!title || !thumb || seen.has(thumb)) continue;
      seen.add(thumb);
      results.push({
        title,
        thumbnail: thumb,
        link: link || "",
        price: item.price ?? undefined,
        source: item.source ?? undefined,
      });
      if (results.length >= 12) break;
    }

    return NextResponse.json({ results });
  } catch (err) {
    console.error("[product-search]", err);
    return NextResponse.json(
      { error: "Search request failed." },
      { status: 500 }
    );
  }
}
