# Tiny Creations — website

Static one-page site for tinycreations.studio. No build step, no dependencies.

## Run it locally

Open `index.html` in a browser. That's it.

For a proper local server (needed if you add anything that fetches files):

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploy

Pick one. All are free for a site this size.

### Cloudflare Pages (recommended — free, fast, easy custom domain)
1. Push this folder to a GitHub repo.
2. Cloudflare dashboard → Workers & Pages → Create → Pages → connect the repo.
3. Build command: *leave empty*. Output directory: `/`.
4. Custom domains → add `tinycreations.studio` and `www.tinycreations.studio`.

### Netlify
- Fastest path: drag this folder onto https://app.netlify.com/drop — live in
  about ten seconds, no account needed to preview.
- For the real domain: create a site from Git, then Domain settings → add
  `tinycreations.studio` and follow the DNS instructions.
- `netlify.toml` in this repo already sets the headers and the 404 page.

### GitHub Pages
Push to a repo, Settings → Pages → deploy from `main` / root. Add the custom
domain there; a `CNAME` file gets created for you.

## DNS (domain already registered)

At your registrar, point the domain at the host:

| Host            | Type  | Value                        |
|-----------------|-------|------------------------------|
| `@`             | A/ALIAS | whatever the host gives you |
| `www`           | CNAME | your-site.pages.dev (or .netlify.app) |

HTTPS is automatic on all three hosts. Allow up to an hour for DNS to settle.

## Changing prices or copy

`data/site-config.js` holds the product list, prices, colour themes and the
coming-soon items. Edit, save, refresh. If you change a price there, change the
matching line in the "Order now" cards in `index.html` too.

## Adding the real photos

See `IMAGE-MANIFEST.md`. Drop files into `assets/img/` with the exact filenames
listed and nothing else needs editing.

## How orders arrive

There is no server. The three buttons — order, party quote, keep me posted —
open the visitor's email client with a pre-filled message to
`support@tinycreations.studio`. Simple, free, and nothing to maintain.

If you later want a real form (works without an email client, catches phone
users better), the drop-in options are Formspree, Netlify Forms or Basin. That's
a small change to the three handler functions in `assets/js/app.js`.

## Structure

```
index.html              the page
assets/css/styles.css   styles (CSS variables at :root, dark mode included)
assets/js/app.js        behaviour
data/site-config.js     prices and product data — edit this one
assets/img/             images
netlify.toml            headers + redirects if hosting on Netlify
robots.txt, sitemap.xml SEO basics
404.html                not-found page
```
