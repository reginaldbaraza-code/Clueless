# Clueless — Product Review

## Phase 1 — Product Understanding

### What the application does
**Clueless** is a personal outfit and closet manager. Users log in, build a digital closet (items with category, image, formality, season), get a **daily pick** (weather-aware), browse **recommendations**, build and save **outfits**, and use extras: **virtual try-on**, **packing**, **plan week**, **style quiz**, **analytics**.

### Core user flows
1. **Sign up / Log in** → Auth gate → Log in modal (Supabase).
2. **First use** → Empty closet → Add items (manual or product search) → Get daily pick once enough items.
3. **Daily** → Home → See today’s pick → “I’m wearing this” / Download / Swap.
4. **Closet** → Filter by category → Add / remove items → Product search (SerpApi) for name + image.
5. **Outfits** → View saved outfits → Rate / remove / download card.
6. **Recommendations** → Set weather (location) + formality → See suggested combinations.
7. **Outfit builder** → Pick top, bottom, shoes, etc. → Save outfit.
8. **More** → Try-on, Analytics, Packing, Plan week, Style quiz.

### Key features and pages
| Page | Purpose |
|------|---------|
| `/` | Home — hero, daily pick, CTAs to closet/recommendations |
| `/closet` | Closet — grid by category, add item (form + product search) |
| `/outfits` | Saved outfits — list, rate, share, remove |
| `/recommendations` | Weather + formality → outfit suggestions |
| `/outfit-builder` | Slot-based builder (top, bottom, shoes, etc.) |
| `/try-on` | Virtual try-on (Replicate) — upload photo + garment |
| `/more` | Links to Analytics, Packing, Plan week, Style quiz |
| `/analytics`, `/packing`, `/plan-week`, `/style-quiz` | Secondary tools |

### Target users and use cases
- **Primary:** People who want a simple “what to wear today” and a single place for their wardrobe.
- **Use cases:** Daily pick, trip packing, outfit planning, style preferences, try-on.

### Weak points (pre-improvement)
- **Empty closet:** Home doesn’t show a clear “add your first items” state.
- **Auth loading:** Plain “Loading…” text.
- **More page:** Text-only list; no icons or hierarchy.
- **First-time clarity:** No explicit onboarding; empty state could be more welcoming.

### Tech stack
- **Frontend:** Next.js (App Router), React, Tailwind, Framer Motion, Lucide.
- **Auth:** Supabase (email OAuth).
- **Data:** localStorage per user (wardrobe, outfits, style).
- **APIs:** Weather (OpenWeather), Chat (Gemini), Product search (SerpApi), Try-on (Replicate).

---

## Phase 2 — Role-Based Review (Summary)

### Product Owner
- **Add:** Clear first-time/onboarding path (empty state on Home).
- **Keep:** Simple nav (Home, Closet, Outfits + More); product search; daily pick.
- **Simplify:** Avoid extra steps; one primary CTA per empty state.

### UX/UI Designer
- **Improve:** Empty states (Home, Closet, Outfits), loading (AuthGate), More page hierarchy and icons.
- **Consistency:** Same card/button patterns; clear primary vs secondary actions.

### Frontend Engineer
- **Reuse:** EmptyState component everywhere it fits; consistent buttons/inputs (globals).
- **State:** CluelessContext + AuthContext; no unnecessary duplication.

### Backend Engineer
- **APIs:** Product-search and try-on return clear errors; validation on API side.
- **Storage:** localStorage is appropriate for MVP; document limits.

### QA / End User
- **Flows:** Add item → appears in closet; filter Shoes works (category normalized).
- **Edge cases:** Empty closet, no weather, API key missing — show messages, not crashes.

---

## Phase 3–5 — Implemented Improvements

### Shipped
- **Home empty state** — When closet is empty (hydrated, no items): dedicated block with icon, “Your closet is empty”, short copy, single CTA “Add your first item” → Closet. Hero section only shows when user has items.
- **AuthGate** — Loading: spinner + “Loading your closet…”. Logged-out: “Welcome to Clueless” heading, short value prop, one “Log in” CTA.
- **More page** — Icons per link (Recommendations, Outfit builder, Try on, Analytics, Packing, Plan week, Style quiz), ChevronRight, nav semantics, “Tools and settings for your wardrobe” copy.
- **Closet category empty** — When a category has no items (e.g. Shoes) but closet has items: inline message “No items in this category yet” + “View all” / “Add item”. Grid only renders when there are items to show; empty closet still uses full EmptyState.
- **Focus styles** — `.btn-primary` and `.btn-secondary` use `:focus-visible` outline for keyboard users.
- **Consistency** — Category normalization (shoes, etc.) already in place; empty states use EmptyState or consistent card styling.
