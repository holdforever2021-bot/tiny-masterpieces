# CLAUDE.md — Tiny Creations website

Context and house rules for Claude Code working in this repo.

## What this is

A one-page static marketing and ordering site for **Tiny Creations**, a handmade
crafts business (beaded bracelets, bookmarks, greeting cards) run by a young maker
in Woodbridge, CT. Domain: **tinycreations.studio**.

There is no backend, no database, no build step. It is plain HTML, CSS and
vanilla JS served as static files. Keep it that way unless explicitly asked —
the owner is not a developer and must be able to edit prices without a toolchain.

## File map

```
index.html              the entire page (one file, semantic sections)
assets/css/styles.css   all styling, CSS custom properties at :root
assets/js/app.js        behaviour only — builder, basket, mailto handlers
data/site-config.js     ← PRICES AND COPY LIVE HERE. Edit this, not app.js.
assets/img/             logo, product placeholders, og-image, favicon
assets/img/gallery/     empty — real photos land here (see IMAGE-MANIFEST.md)
```

`data/site-config.js` defines four globals used by `app.js`:
`MAIL`, `ITEMS`, `COLOURS`, `SOON`. It loads first. Never move product data
or prices into `app.js`.

## Non-negotiables

- **No frameworks, no bundler, no npm.** If a task seems to need React, it doesn't.
- **No tracking, no analytics, no third-party scripts.** A minor is the face of
  this business. The only external request is Google Fonts.
- **No payment processing on the site.** Orders go out by `mailto:`. Payment
  happens in person or via Venmo/Zelle after a human confirms. Do not add Stripe
  or a checkout flow without an explicit instruction.
- **No personal data collection beyond the mailto body.** `localStorage` holds the
  basket and the interest list on the visitor's own device only.
- **Prices stay in one place.** Anything with a dollar sign belongs in
  `data/site-config.js` or as literal copy in `index.html` — never hardcoded twice.
- **Accessibility matters.** Keep the semantic headings, `aria-pressed` on the
  option chips, real `<label>`s, and visible focus. Colour is never the only signal.
- **Dark mode works** via `prefers-color-scheme` on the `:root` custom properties.
  Any new colour must be a variable, defined in both themes.

## Two kinds of product

The page deliberately splits into:

1. **Order now** — bracelets, bookmarks, cards, extras. Prices are set and real.
2. **Coming soon** — party packs, name bracelets, kits, classroom sets, seasonal
   drops, wedding favors. **These must not show prices.** They carry a status
   badge and a "Keep me posted" toggle that builds an interest list. This is
   deliberate: pricing hasn't been decided and the interest list is the research.

Do not invent prices for anything in the `SOON` list or the party packs. If asked
to add a price, confirm the number with the owner first.

## Voice

Plain, warm, short sentences. British-ish spelling is already in place in a few
places ("colour") — keep it consistent within a file. Never use exclamation marks
in body copy. Never describe the maker by name or age on the public site.

## Tasks you'll likely get

- **Swap in real photos** → see `IMAGE-MANIFEST.md`. Resize, strip EXIF, keep
  filenames exactly as listed so no markup changes.
- **Change a price** → `data/site-config.js` plus the matching `<li>` in the
  Order now cards in `index.html`. Both, or they disagree.
- **Promote something from Coming soon to Order now** → move it out of `SOON`,
  add a card in the `#shop` grid, add it to `ITEMS` with its variants.
- **Deploy** → see README. Any static host; no server runtime needed.

## Before you finish

- Open `index.html` in a browser and click through: builder maths, basket add and
  remove, the three mailto buttons, the interest toggles.
- Check it at 375px wide.
- `node --check assets/js/app.js && node --check data/site-config.js`
