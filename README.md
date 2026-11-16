# SecondLook

SecondLook helps an investor compare 2-3 off-plan property offers in Dubai on the same basis, see where every number comes from, and end with a short decision note.

It never decides for you. It gives no ranking and no verdict. "None of these" is a valid outcome.

> **All figures are illustrative mock data, not real market figures. SecondLook is not investment advice.**

## The three screens

1. **Offers** - six offers; tick 2 or 3.
2. **Compare** - six numbers per offer, side by side. Every number carries a source tag ("Agent figure", "Area figure (mock)" or "Calculated"); select a tag to see the source or the formula with that offer's values. Flags from four fixed rules are listed under each offer.
3. **Decide** - choose "My pick" for one offer, or "None of these", and read the decision note: what stands out, watch-outs, questions for the agent, and what this tool has not checked.

## Languages

The interface is available in English and Arabic. The button in the header switches between them at any time and keeps your place, your selection and your choice. Arabic is laid out right to left. Offer names stay as the agent lists them.

## Run

Requires Node.js 20 or later.

```
npm install && npm run dev
```

Then open the address Vite prints (by default http://localhost:5173).

## Test

```
npm test
```

This runs the calculation tests, the flag tests, the screen tests and the wording test (a scan of all three screens for words SecondLook never uses).

## Build and publish

```
npm run build
```

This type-checks the code and writes static files to `dist/`. There is no backend: upload the contents of `dist/` to any static host (for example Netlify, Vercel, GitHub Pages, Cloudflare Pages or an S3 bucket) and share the link. Asset paths are relative, so the files work from a domain root or a sub-folder.

To check the built files locally first:

```
npm run preview
```

## Where things live

| File | What it holds |
|---|---|
| `src/data/offers.json` | The six offers. All names and figures are invented. |
| `src/lib/calc.ts` | Every calculation and all display rounding. No other file computes a number. |
| `src/lib/flags.ts` | The four flag rules, their thresholds, texts and questions. The thresholds are SecondLook settings, not market rules. |
| `src/lib/labels.ts` | The interface wording, in English and Arabic. |
| `src/lib/markers.ts` | The neutral "Highest" / "Lowest" / "Earliest" / "Latest" markers. |
| `src/lib/compare.ts` | The six numbers for one offer, each with its source. |
| `src/lib/note.ts` | The decision note. |
| `src/components/` | The three screens, the source tag and its panel. |

## Limits

A single-page app: no backend, no login, no saving, no external API, no tracking. Designed for a laptop screen and usable on a phone. Every control works by keyboard; source tag panels open on click, Enter and Space, and close with Escape.
