# 👗 Clueless – Outfit Selector

*As if!* A smart, scalable outfit recommendation platform inspired by the iconic digital closet from *Clueless*.

## What it does

- **Digital closet** – Upload items, auto-tag with AI, build outfits with drag-and-drop
- **Smart recommendations** – Weather-aware, event-based, and calendar-linked suggestions
- **Style engine** – Onboarding quiz, preference learning, style evolution over time
- **Engagement** – Daily “Clueless Pick”, outfit ratings, shareable look cards, **AI stylist chatbot**, gamification

## Quick start

```bash
cd web
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Repo structure

- **`web/`** – Next.js app (React, Tailwind CSS, Framer Motion)
- **`docs/ROADMAP.md`** – Full product blueprint, phases, and tech stack

## Environment

Create `web/.env.local` and add (optional for MVP):

- `NEXT_PUBLIC_OPENWEATHER_API_KEY` – [OpenWeather](https://openweathermap.org/api) for weather-based suggestions
- `OPENAI_API_KEY` – [OpenAI](https://platform.openai.com/api-keys) for the floating AI stylist chat
- `GOOGLE_CALENDAR_CLIENT_ID` – For calendar-based outfit suggestions (Phase 1+)

## Roadmap

| Phase | Focus |
|-------|--------|
| **1 – MVP** | Digital closet, rule-based suggestions, weather, basic calendar |
| **2 – Intelligence** | ML ranking, behavioral learning, style evolution |
| **3 – Premium** | AR try-on, retail, AI stylist chatbot ✓ (in-app) |

See **`docs/ROADMAP.md`** for the full development blueprint.
