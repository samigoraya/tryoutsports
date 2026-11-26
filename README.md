# TRYOUT Sports — Team Name Generator

A static site: a team name generator with a page for every sport, tone and sport category.
No build step and no server. Every file in this folder is served as-is.

- **Pages:** 1798 (hub, 14 sport categories, 198 sports, 8 tones per sport, uniform contact page)
- **Live at:** https://teamname.tryout-sports.com/ ,  our main webite → at:** https://tryout-sports.com/ 
- **URLs:** extensionless. The file `motorsports.html` is served at `/motorsports`.
- **Links are relative**, so the site works at a domain root *and* in a GitHub Pages
  project subpath (`user.github.io/repo/`) without changing anything.
- **Words:** 15,831 in the word lists behind the generator.

## Deploy on Cloudflare Pages (easiest — site and AI endpoint on one domain)

1. Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git.
2. Pick this repository. No build command. Build output directory: `/`
3. Custom domains → add `teamname.tryout-sports.com`. 

4. Deploy `worker/` as described in `worker/README.md`. It attaches to `/api/names` on the
   same domain, and the Ask AI button appears on its own.

Cloudflare Pages serves `/motorsports` from `motorsports.html` with no configuration.

## Deploy on GitHub Pages with the subdomain

1. Push this folder to a repository (public, or private on a paid plan).
2. **Settings → Pages → Source:** *Deploy from a branch*, branch `main`, folder `/ (root)`.
3. **Settings → Pages → Custom domain:** enter `teamname.tryout-sports.com` and Save.
   Do this *before* the DNS record, so nobody else can claim the subdomain in the gap.
4. **At the DNS host for tryout-sports.com**, add one record:

   | Type | Name | Value | TTL |
   |---|---|---|---|
   | CNAME | `teamname` | `YOUR-USERNAME.github.io` | Auto |

   The value is the account, **not** the repository, and **not** the `*.pages.github.io`
   address shown in Pages settings. No A records: those are only for an apex domain.
   On Cloudflare DNS, set the record to **DNS only** (grey cloud) until the certificate is
   issued, or GitHub cannot validate the domain.
5. Check it with `dig teamname.tryout-sports.com +nostats +nocomments +nocmd`. The answer
   should be a CNAME to `YOUR-USERNAME.github.io`. DNS can take up to 24 hours.
6. **Settings → Pages → Enforce HTTPS** once the tick box becomes available.

Saving the custom domain makes GitHub commit a `CNAME` file to the branch. This repo already
contains one with the right value, and `build.py` rewrites it on every build, so a later push
will not wipe it. Keep it: deleting that file unsets the custom domain.

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
| `menu.js` | Header navigation |
| `uniform.js` | Uniform request form |
| `sitemap.xml`, `robots.txt` | For search engines |
| `llms.txt` | A plain-text map of the site for AI answer engines |
| `404.html` | Served for unknown URLs on all three hosts |
| `favicon.*`, `icon-*.png`, `apple-touch-icon.png`, `og.png` | Icons and the social sharing image |
| `site.webmanifest` | Icons and theme colour for installed/home-screen use |
| `_headers`, `_redirects`, `netlify.toml` | Caching, security headers and the .html redirect |
| `worker/` | Cloudflare Worker for the Ask AI button (deployed separately, not served) |

## Changing the domain

Every canonical link, Open Graph URL and sitemap entry is generated from one base URL.
Rebuild with a different one by setting `BASE_URL` before running `build.py`.

## SEO notes

Everything below is already in the build:

- One unique `<title>` (max 60 chars) and `<meta name="description">` (120-160 chars) per page.
  Checked at build time; the build fails if any page is outside those limits.
- Self-referencing canonical on all 1798 pages, all present in `sitemap.xml`, `lastmod` set at build.
- JSON-LD on every page: `WebApplication` (or `ContactPage`), `BreadcrumbList`, and an `ItemList`
  of the names the page actually shows. The hub adds `Organization` and `WebSite`.
- Open Graph and Twitter cards with a 1200x630 image (`og.png`).
- `robots.txt` names the AI crawlers (GPTBot, OAI-SearchBot, PerplexityBot, ClaudeBot,
  Google-Extended and others) and allows them explicitly, and points at the sitemap.
- `llms.txt` gives answer engines a short, factual description of what the tool does and
  the pages worth citing.
- Scripts are deferred; CSS, JS and images get a one-year cache header, HTML revalidates.
- Relative internal links, so no 404s whichever host or subpath the site sits on.

Worth doing later, outside this build:

- Submit `sitemap.xml` in Google Search Console and Bing Webmaster Tools.
- Add a short FAQ section to the sport pages and mark it up with `FAQPage`. Schema without
  matching visible text breaks Google's rules, so the text has to come first.
- The sport blurbs and team lists came from general knowledge. Skim them before launch;
  AI answer engines repeat what they find, so a wrong fact travels.
