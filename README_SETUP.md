# Local setup for environment variables and Gemini API usage

1) Copy `.env.example` to `.env.local` and fill in real values.

```
cp .env.example .env.local
# then edit .env.local and paste your real keys
```

Required variables:
- `GEMINI_API_URL` — the full URL to your provider's Gemini endpoint.
- `GEMINI_API_KEY` — the secret API key for the Gemini provider.
- `INTERNAL_API_TOKEN` — a random secret used by the frontend to authenticate
  to the server-side proxy (`/api/gemini`). Keep this secret and never commit it.

2) Start the dev server:

```bash
corepack enable && corepack prepare pnpm@latest --activate
pnpm install
pnpm dev
```

3) How to call the server-side proxy from the frontend

Example `fetch` call from client-side code (replace `token` with your
`INTERNAL_API_TOKEN` from `.env.local`):

```js
const res = await fetch('/api/gemini', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_INTERNAL_TOKEN ?? 'your-token-here'}`,
  },
  body: JSON.stringify({ input: 'Hello world' }),
});
const data = await res.json();
```

Note: For client-side calls you must inject the `INTERNAL_API_TOKEN` into
the client code safely (for local testing you may hardcode it, but in
production use an authenticated session — do not expose your Gemini key).

4) Example `curl` call to test the server endpoint:

```bash
curl -X POST http://localhost:3000/api/gemini \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <INTERNAL_API_TOKEN>" \
  -d '{"input":"Hello from curl"}'
```

Security notes:
- Keep `GEMINI_API_KEY` only server-side; never expose it to the browser.
- `INTERNAL_API_TOKEN` protects the server proxy; rotate it if leaked.
- Consider replacing `INTERNAL_API_TOKEN` with your app's real user
  authentication (session/cookie/jwt) for production.
