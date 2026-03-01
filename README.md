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

## Deploy on Vercel (fix 404)

The app lives in the **`web/`** subdirectory. If you get 404 after deploying:

### 1. Set Root Directory to `web`

1. [Vercel Dashboard](https://vercel.com/dashboard) → your project → **Settings** → **General**.
2. **Root Directory** → **Edit** → enter **`web`** (no leading `./` or trailing `/`).
3. Leave **Include source files outside of the Root Directory in the Build Step** unchecked.
4. **Save**.

### 2. Make sure build settings are correct

In the same **General** (or **Build & Development Settings**) section:

- **Framework Preset**: should be **Next.js** (if it’s “Other”, change it to Next.js).
- **Build Command**: leave empty so Vercel uses `npm run build` from `web/`.
- **Output Directory**: leave empty (Vercel uses `.next` for Next.js).
- **Install Command**: leave empty so Vercel uses `npm install` from `web/`.

Save again if you changed anything.

### 3. Redeploy and check logs

1. Go to **Deployments**.
2. Open the **⋮** on the latest deployment → **Redeploy** (or push a new commit).
3. After the deploy finishes, open the deployment → **Building** / **Logs** and confirm:
   - The build runs from the `web` directory (you should see `Installing dependencies...` and `Running "npm run build"`).
   - The build completes without errors.

If the build fails, fix the errors shown in the log. If the build succeeds but you still get 404, try opening a direct route (e.g. `https://your-domain.vercel.app/closet`). If `/closet` works but `/` doesn’t, tell me and we can add a redirect. If both 404, the deployment may not be using `web` as root—double-check Root Directory and that the deployment you’re opening is the one that just finished.

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
