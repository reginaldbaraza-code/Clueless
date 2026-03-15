# Media & asset structure

- **`/images`** – Static images (e.g. placeholders, illustrations). Product/closet images are loaded from external URLs (Unsplash) or user input.
- **`/icons`** – Custom SVG or icon assets. The app uses **Lucide React** for UI icons; use this folder only for custom or branded icons.
- **Favicon** – Served from `src/app/favicon.ico` (Next.js App Router). Referenced in layout metadata as `/favicon.ico`.

## External image sources

- **Unsplash** (`images.unsplash.com`) – Seed wardrobe images and category fallbacks. Allowed in `next.config.ts` for `next/image` if needed.
- **Replicate** (`replicate.delivery`) – Virtual try-on result images. Allowed in `next.config.ts`.

## References

- Wardrobe item images: `ItemImage` component + `getItemImageUrl()` in `src/lib/item-image.ts`.
- Try-on: user upload (data URL) and API result URL in `src/app/try-on/page.tsx`.
