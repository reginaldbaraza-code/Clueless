/** Aesthetic from onboarding quiz */
export type Aesthetic =
  | "minimalist"
  | "streetwear"
  | "romantic"
  | "classic"
  | "bohemian"
  | "edgy"
  | "preppy"
  | "athleisure";

export interface StylePreferences {
  aesthetics: Aesthetic[];
  /** Preferred formality default */
  defaultFormality: "casual" | "smart-casual" | "business" | "formal";
  /** Colors user is comfortable with */
  colorComfort: string[];
  /** Lifestyle for context */
  lifestyle: "corporate" | "student" | "remote" | "creative" | "mixed";
  climateZone?: "cold" | "temperate" | "warm" | "hot";
  completedAt?: string;
}
