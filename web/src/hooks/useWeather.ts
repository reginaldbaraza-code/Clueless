"use client";

import { useState, useEffect, useCallback } from "react";
import type { WeatherConditions } from "@/types/weather";

interface UseWeatherOptions {
  /** If true, request geolocation and fetch weather on mount */
  autoFetch?: boolean;
}

export function useWeather(options: UseWeatherOptions = {}) {
  const { autoFetch = false } = options;
  const [weather, setWeather] = useState<WeatherConditions | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = useCallback(async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? `HTTP ${res.status}`);
      }
      const data = (await res.json()) as WeatherConditions;
      setWeather(data);
      return data;
    } catch (e) {
      const message = e instanceof Error ? e.message : "Failed to load weather";
      setError(message);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchByGeolocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }
    setLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        void fetchWeather(pos.coords.latitude, pos.coords.longitude);
      },
      () => {
        setError("Location permission denied");
        setLoading(false);
      }
    );
  }, [fetchWeather]);

  useEffect(() => {
    if (autoFetch) fetchByGeolocation();
  }, [autoFetch, fetchByGeolocation]);

  return { weather, loading, error, fetchWeather, fetchByGeolocation };
}
