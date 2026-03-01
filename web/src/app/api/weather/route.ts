import { NextResponse } from "next/server";

const OPENWEATHER_API = "https://api.openweathermap.org/data/2.5/weather";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");
  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

  if (!lat || !lon) {
    return NextResponse.json(
      { error: "Missing lat or lon query parameters" },
      { status: 400 }
    );
  }

  if (!apiKey) {
    // Return mock data when no API key so UI still works
    return NextResponse.json({
      tempC: 18,
      feelsLikeC: 17,
      description: "Clear",
      icon: "01d",
      rainProbabilityPercent: 10,
      windSpeedMps: 3,
      humidityPercent: 55,
      locationName: "Your location",
      updatedAt: new Date().toISOString(),
    });
  }

  try {
    const url = `${OPENWEATHER_API}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    const res = await fetch(url);
    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: "Weather API error", details: text },
        { status: res.status }
      );
    }
    const data = (await res.json()) as {
      main: { temp: number; feels_like: number; humidity: number };
      weather: Array<{ description: string; icon: string }>;
      pop?: number;
      wind?: { speed: number };
      name?: string;
    };

    const rainProbabilityPercent = typeof data.pop === "number" ? data.pop * 100 : 0;

    return NextResponse.json({
      tempC: Math.round(data.main.temp * 10) / 10,
      feelsLikeC: Math.round(data.main.feels_like * 10) / 10,
      description: data.weather[0]?.description ?? "Unknown",
      icon: data.weather[0]?.icon ?? "01d",
      rainProbabilityPercent,
      windSpeedMps: data.wind?.speed ?? 0,
      humidityPercent: data.main.humidity ?? 0,
      locationName: data.name ?? undefined,
      updatedAt: new Date().toISOString(),
    });
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to fetch weather", details: String(e) },
      { status: 500 }
    );
  }
}
