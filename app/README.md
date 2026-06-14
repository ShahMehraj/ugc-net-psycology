# UGC NET Psychology — PYQ Practice & Mock Test

A static React app to attempt UGC NET Psychology previous-year papers in the official NTA style.

- **Practice Mode** — reveals the correct answer + a detailed explanation as soon as you submit each question.
- **CBT Test Mode** — full timed mock test with an NTA-style question palette (answered / not-answered / marked-for-review), auto-submit on timeout, and a detailed scorecard with per-question solutions.
- **Home page** — pick year → shift/cycle → mode.

## Currently available

| Paper | Section | Status |
|---|---|---|
| **June 2023** | **Full paper — Part-1 General Aptitude (50) + Psychology (100) = 150 Qs** | ✅ Ready with explanations |
| March 2023 | Paper II | ⏳ Planned (Psychology source exists; no Part-1 source) |
| December 2023 | Paper II + Part 1 | ⏳ Planned |

### June 2023 answer provenance

- **Psychology (Q51–150):** from the Otta book; answers diffed against the printed key (98/100 verbatim, 2 verified overrides — see below).
- **Part-1 General Aptitude (Q1–50):** visually transcribed (English) from the NTA paper `2023-s1-p1.pdf`, which has **no embedded answer key**. Computable items (data-interpretation, number series, coding, syllogisms, number-system conversions) are **derived with shown working**; factual/teaching-aptitude/current-affairs items are answered to best judgement and **flagged in-app as "not confirmed against an official key."**

## Run locally

```bash
cd app
npm install
npm run dev        # http://localhost:5173
```

## Build

```bash
npm run build      # outputs to app/dist
npm run preview    # preview the production build
```

The app uses `HashRouter`, so it works on any static host (including GitHub Pages
project sites) without server-side routing config.

## Deploy to GitHub Pages

1. Push this repo to GitHub. The included workflow (`.github/workflows/deploy.yml`)
   builds from the `app/` folder and deploys on every push to `main`.
2. In the repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. The build sets Vite's `base` to `/<repo-name>/` automatically from the repo name.

To build for a custom base path manually:

```bash
VITE_BASE=/my-repo/ npm run build
```

## Data & accuracy

- **Questions (Psychology):** transcribed from *UGC NET JRF Psychology — Previous
  Years Questions Papers*, Arvind Otta (Utsaah/UPS Education), 4th ed. 2023.
- **Answer keys:** taken from the same book's key section. Every encoded answer was
  diffed programmatically against the printed key (98/100 match the book verbatim).
- **Verified overrides (2):** where the published key was demonstrably wrong, the
  answer was corrected and documented in the explanation:
  - **Q12** → *Spearman–Brown* prophecy formula (not KR-20) for required test length (web-verified).
  - **Q73** → Piaget stage-matching (canonical mapping).
- **Excluded items (2):** Q31 (no published key, `*`) and Q63 (dropped by NTA) are
  flagged and excluded from scoring.

> ⚠️ These are third-party compiled papers for educational practice. Always verify
> against the official UGC/NTA answer keys.

## Adding more papers

1. Create `src/data/papers/<id>.js` exporting a paper object (see `2023-june.js`).
2. Register it in `src/data/manifest.js` with `status: 'available'` and a `load` import.
