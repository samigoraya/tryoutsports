# Ask AI for 30 names — Cloudflare Worker

The site is static. This Worker is the only server-side piece, and it exists so the
Anthropic API key never reaches the browser.

## What it does

The page POSTs the form choices (sport, tone, word count, city, team type, description)
to `/api/names`. The Worker writes the prompt itself, calls the Anthropic API, and returns
a JSON array of 30 names. It deliberately does **not** accept a prompt from the browser:
if it did, anyone who found the URL could run any prompt they liked on your key.

## Deploy

```bash
npm install -g wrangler
wrangler login
cd worker
wrangler secret put ANTHROPIC_API_KEY     # paste the key from console.anthropic.com
wrangler deploy
```

Optional, for the per-visitor hourly limit:

```bash
wrangler kv namespace create NAMES_RATE
# paste the printed id into wrangler.toml, uncomment the kv_namespaces block
wrangler deploy
```

Without the KV namespace the Worker still runs; it just does not rate limit.

## Pointing the site at it

- **Site on Cloudflare Pages** on `teamname.tryout-sports.com`: nothing to change.
  The route in `wrangler.toml` puts the Worker on `/api/names` on that domain, which is
  what `AI_ENDPOINT` in `app.js` already calls.
- **Site on GitHub Pages or Netlify**: the Worker is on a different origin, so open
  `app.js`, set `AI_ENDPOINT` to the Worker's full URL
  (`https://teamname-ai.<your-subdomain>.workers.dev`), and add your site's origin to
  `ALLOWED_ORIGINS` in `worker.js`, then deploy again.

The button only appears once the Worker answers, so the page looks the same as it does
today until this is live.

## Cost and abuse

Each click is one short request to a small model, so the per-click cost is a fraction of
a cent, but it is your key paying for it. The hourly per-IP limit is the floor, not the
ceiling: if the page gets busy, put Cloudflare Turnstile in front of the endpoint, or cache
answers per set of options in KV.
