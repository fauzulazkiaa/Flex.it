# Styling Guidelines & Behavioral Constraints

## 1. Tailwind CSS Class Validation
- **NEVER use invalid or non-existent Tailwind CSS color scales** (e.g., `text-zinc-350`, `bg-blue-250`, `text-slate-150`).
- Using invalid classes causes the browser to drop the CSS rule entirely and fallback to default styles (which often results in bright white text on dark backgrounds), ruining the UI.
- **ALWAYS use official Tailwind color scales**: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950.

## 2. Dark Mode Typography & Eye Comfort
- **AVOID using pure white** (`text-white`, `#FFFFFF`) for body text, badges, statuses, or general typography in Dark Mode. Pure white on a dark background causes intense eye strain and ruins the "premium" aesthetic.
- **INSTEAD, use softer muted tones**: `text-zinc-200`, `text-zinc-300`, `text-slate-300`, `text-gray-300` for primary text.
- For subtle text, use `text-zinc-400` or `text-zinc-500`.

## 3. Strict Compliance for Status Labels & Badges
- When generating status labels or badges (like "Belum Daftar", "Lolos", etc.), ensure the text color strictly adheres to Rule #2 and is visible but gentle on the eyes. Never let it fallback to pure white.
