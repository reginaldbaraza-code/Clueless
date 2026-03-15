import { NextResponse } from "next/server";

/** Map app categories to idm-vton categories */
const VTON_CATEGORY: Record<string, "upper_body" | "lower_body" | "dresses"> = {
  top: "upper_body",
  outerwear: "upper_body",
  bottom: "lower_body",
  dress: "dresses",
  "one-piece": "dresses",
};

const MODEL_VERSION =
  "906425dbca90663ff5427624839572cc56ea7d380343d13e2a4c4b09d3f0c30f";

export async function POST(request: Request) {
  const apiKey = process.env.REPLICATE_API_TOKEN;
  if (!apiKey) {
    return NextResponse.json(
      {
        error: "no_api_key",
        message:
          "Add REPLICATE_API_TOKEN to .env.local to enable virtual try-on. Get a token at replicate.com/account.",
      },
      { status: 503 }
    );
  }

  let body: {
    personImage: string; // data URL or public image URL
    garmentImageUrl: string;
    category: string;
    garmentDescription?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { personImage, garmentImageUrl, category, garmentDescription } = body;
  if (!personImage || !garmentImageUrl || !category) {
    return NextResponse.json(
      { error: "personImage, garmentImageUrl, and category are required" },
      { status: 400 }
    );
  }

  const vtonCategory = VTON_CATEGORY[category] ?? "upper_body";
  const description =
    garmentDescription?.trim() || (category === "upper_body" ? "Top" : category === "lower_body" ? "Pants" : "Dress");

  try {
    const createRes = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: MODEL_VERSION,
        input: {
          human_img: personImage,
          garm_img: garmentImageUrl,
          garment_des: description,
          category: vtonCategory,
          crop: true,
        },
      }),
    });

    if (!createRes.ok) {
      const errText = await createRes.text();
      return NextResponse.json(
        {
          error: "replicate_create_failed",
          message: errText || createRes.statusText,
        },
        { status: 502 }
      );
    }

    const pred = (await createRes.json()) as {
      id: string;
      status: string;
      urls?: { get: string };
      output?: string | string[] | null;
    };

    const getUrl = pred.urls?.get;
    if (!getUrl) {
      return NextResponse.json(
        { error: "replicate_no_poll_url" },
        { status: 502 }
      );
    }

    let status = pred.status;
    let output = pred.output;
    const maxAttempts = 60;
    const pollMs = 2000;

    for (let i = 0; i < maxAttempts && status !== "succeeded" && status !== "failed" && status !== "canceled"; i++) {
      await new Promise((r) => setTimeout(r, pollMs));
      const getRes = await fetch(getUrl, {
        headers: { Authorization: `Bearer ${apiKey}` },
      });
      if (!getRes.ok) break;
      const next = (await getRes.json()) as { status: string; output?: string | string[] | null };
      status = next.status;
      output = next.output;
    }

    if (status !== "succeeded") {
      return NextResponse.json(
        {
          error: "replicate_not_ready",
          message: status === "failed" ? "Try-on failed. Try another photo or garment." : "Try-on timed out.",
        },
        { status: 502 }
      );
    }

    const imageUrl = Array.isArray(output) ? output[0] : output;
    if (!imageUrl || typeof imageUrl !== "string") {
      return NextResponse.json(
        { error: "replicate_no_output" },
        { status: 502 }
      );
    }

    return NextResponse.json({ imageUrl });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: "tryon_error", message },
      { status: 500 }
    );
  }
}
