# Image manifest

Drop real photos into `assets/img/` using **exactly these filenames** and the
site picks them up with no code changes. Placeholders (illustrations) are in
those slots now.

| Filename | What it shows | Size | Notes |
|---|---|---|---|
| `logo.png` | The Tiny Creations lockup | 1100px wide | Already final — don't replace |
| `hero-products.jpg` | Wide banner: cards, bookmarks and bracelets together | 1600×800 | The first thing visitors see |
| `bracelets.png` | A stack of bracelets, close up | 700px wide | Shot on white |
| `bookmarks.png` | Paper, sleeve and acrylic side by side | 700px wide | Showing all three tiers makes the pricing obvious |
| `cards.png` | A card with its envelope | 700px wide | Front design facing camera |
| `og-image.jpg` | Link preview when the site is shared | 1200×630 | Logo on white is fine |
| `favicon.png` | Browser tab icon | 256×256 | |

## Gallery

Anything in `assets/img/gallery/` is optional extra. Suggested shots:

- `gallery-01.jpg` — bracelet stack, angled
- `gallery-02.jpg` — acrylic bookmarks with tassels
- `gallery-03.jpg` — a set of cards fanned
- `gallery-04.jpg` — name beads spelling a word
- `gallery-05.jpg` — an assembled favor pack in its bag with the tag
- `gallery-06.jpg` — charm close-up
- `gallery-07.jpg` — the workbench mid-make
- `gallery-08.jpg` — the market table

The favor-pack shot is the important one — it's the highest-value product and the
hardest to picture without seeing it.

## Shooting notes

Daylight near a window, no flash. Plain background: white posterboard or a sheet.
Straight down for flat things, slight angle for bracelets. Phone camera is fine.

## Processing (Claude Code can do all of this)

- Resize to the widths above; nothing needs to be larger than 1600px
- **Strip EXIF** — phone photos carry GPS coordinates
- Save JPEG at quality 85, or WebP with a JPEG fallback
- Keep each file under ~250 KB
