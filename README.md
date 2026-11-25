# TRYOUT Sports — Team Name Generator

A static site: a team name generator with a page for every sport, tone and sport category.
No build step and no server. Every file in this folder is served as-is.

- **Pages:** 1798 (hub, 14 sport categories, 198 sports, 8 tones per sport, uniform contact page)
- **Live at:** https://teamname.tryout-sports.com/
- **URLs:** extensionless. The file `motorsports.html` is served at `/motorsports`.
- **Links are relative**, so the site works at a domain root *and* in a GitHub Pages
  project subpath (`user.github.io/repo/`) without changing anything.
- **Words:** 15,831 in the lists, plus a 30,000-name ready-made list.

## Deploy on Cloudflare Pages (easiest — site and AI endpoint on one domain)

1. Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git.
2. Pick this repository. No build command. Build output directory: `/`
3. Custom domains → add `teamname.tryout-sports.com`.
4. Deploy `worker/` as described in `worker/README.md`. It attaches to `/api/names` on the
   same domain, and the Ask AI button appears on its own.

Cloudflare Pages serves `/motorsports` from `motorsports.html` with no configuration.

## Deploy on GitHub Pages

1. Push this folder to a repository.
2. Settings → Pages → Source: *Deploy from a branch*, branch `main`, folder `/ (root)`.
3. The `CNAME` file already sets the custom domain `teamname.tryout-sports.com`.
   At your DNS host add a CNAME record: `teamname` → `YOUR-USERNAME.github.io`.
4. Settings → Pages → tick **Enforce HTTPS** once the certificate is issued.

`.nojekyll` is included so GitHub serves the files without running Jekyll.

GitHub Pages serves `motorsports.html` when the browser asks for `/motorsports`, so the
clean URLs work there too. **If links 404 on GitHub Pages**, the cause is almost always
links that start with `/` while the site sits in a project subpath — `/motorsports` then
means `user.github.io/motorsports`, not `user.github.io/repo/motorsports`. This build uses
relative links to avoid exactly that.

## Deploy on Netlify

1. New site → import this repository (or drag the folder into the deploy page).
2. No build command. Publish directory: `.`
3. Domain settings → add `teamname.tryout-sports.com`, then add the CNAME record Netlify shows.

`netlify.toml` sets cache headers; `_redirects` sends `/motorsports.html` to `/motorsports`
with a 301.

## Ask AI for 30 names

The button stays hidden until a backend answers, because the Anthropic API key cannot live
in the page. `worker/` holds a Cloudflare Worker that does the job: the page sends the form
choices, the Worker writes the prompt and calls the API, and the key stays on Cloudflare.
See `worker/README.md` for the commands that deploy it. Hosting the site anywhere other
than the Worker's own domain means setting `AI_ENDPOINT` in `app.js` to the Worker's URL.

## Files

| File | What it is |
|---|---|
| `*.html` | The 1798 pages |
| `style.css` | All styling |
| `app.js` | The name generator |
| `names.js` | The word library (places, mascots, adjectives, animals, sport words) |
| `namelist.js` | 30,000 ready-made names, loaded only when the Browse button is clicked |
| `menu.js` | Header navigation |
| `uniform.js` | Uniform request form |
| `sitemap.xml`, `robots.txt` | For search engines |
| `worker/` | Cloudflare Worker for the Ask AI button (deployed separately, not served) |

## Changing the domain

Every canonical link, Open Graph URL and sitemap entry is generated from one base URL.
Rebuild with a different one by setting `BASE_URL` before running `build.py`.
