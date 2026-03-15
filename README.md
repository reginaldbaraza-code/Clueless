# 👗 Clueless – Outfit Selector

*As if!* A smart, scalable outfit recommendation platform inspired by the iconic digital closet from *Clueless*.

## What it does

- **Digital closet** – Upload items, auto-tag with AI, build outfits with drag-and-drop
- **Smart recommendations** – Weather-aware, event-based, and calendar-linked suggestions
- **Style engine** – Onboarding quiz, preference learning, style evolution over time
- **Engagement** – Daily “Clueless Pick”, outfit ratings, shareable look cards, **AI stylist chatbot**, gamification

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy on Vercel

The app lives at the **repo root**. Connect the repo in Vercel with default settings (Framework: Next.js); no root directory override needed.

## Repo structure

- **`src/`** – Next.js app (React, Tailwind, Framer Motion, Supabase auth)
- **`docs/ROADMAP.md`** – Product blueprint

## Environment

Create `.env.local` in the repo root and add (optional for MVP):

- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` – [Supabase](https://supabase.com/dashboard/project/_/settings/api) for login/signup
- `GEMINI_API_KEY` – [Google AI Studio](https://aistudio.google.com/apikey) for the AI stylist chat
- `REPLICATE_API_TOKEN` – [Replicate](https://replicate.com/account/api-tokens) for virtual try-on
- `NEXT_PUBLIC_OPENWEATHER_API_KEY` – [OpenWeather](https://openweathermap.org/api) for weather-based suggestions
- `GOOGLE_CALENDAR_CLIENT_ID` – For calendar-based outfit suggestions (Phase 1+)

## Roadmap

| Phase | Focus |
|-------|--------|
| **1 – MVP** | Digital closet, rule-based suggestions, weather, basic calendar |
| **2 – Intelligence** | ML ranking, behavioral learning, style evolution |
| **3 – Premium** | AR try-on, retail, AI stylist chatbot ✓ (in-app) |

See **`docs/ROADMAP.md`** for the full development blueprint.
