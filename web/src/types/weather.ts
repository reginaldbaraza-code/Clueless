/** Weather context for outfit recommendations */
export interface WeatherConditions {
  tempC: number;
  feelsLikeC: number;
  description: string;
  icon: string;
  rainProbabilityPercent: number;
  windSpeedMps: number;
  humidityPercent: number;
  locationName?: string;
  updatedAt: string;
}
