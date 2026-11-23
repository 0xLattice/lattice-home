# lattice-home

The website at [lattice.build](https://lattice.build): the home page, docs,
block explorer, and the pages around them. Almost all of it is static files;
the docs and the token page have a build step.

## What's here

| Path | What it is | Served at |
|---|---|---|
| `index.html` | Home page | `/` |
| `agents.md` | Guide for coding agents | `/agents.md` |
| `install.sh` | Command-line installer | `/install.sh` |
| `apps/`, `apps.json` | Apps directory. List an app by pull request to `apps.json` | `/apps/` |
| `download/` | Lattice Desktop downloads ([publishing a release](download/README.md)) | `/download/` |
| `mine/` | Mining Nexus | `/mine/` |
| `community/` | Where to ask, contribute, and find each repository | `/community/` |
| `explorer/` | Block explorer; runs in the browser and reads nodes directly | `/explorer/` |
| `peer/` | A Lattice peer in a browser tab ([README](peer/README.md)) | `/peer/` |
| `token/` | Cross-chain buy and sell (Vite) | `/token/` |
| `docs/` | Docs site (Starlight), published from each repository's own docs ([README](docs/README.md)) | `/docs/` |
| `vendor/` | The Lattice SDK, bundled for the browser | |
| `lattice-mark.svg` | The mark and favicon | |

## Run it locally

```sh
python3 -m http.server 8000        # then open http://localhost:8000
npm ci --prefix docs && npm run build --prefix docs    # docs into docs/dist
npm ci --prefix token && npm run dev --prefix token     # token page
```

## Checks

CI runs these on every pull request:

```sh
node test-site.mjs                     # pages, links, apps.json, download records
node --test explorer/test-explorer.mjs
npm test --prefix token && npm run build --prefix token
npm test --prefix docs && npm run build --prefix docs && node docs/check-links.mjs
```

## Design

One palette, bismuth, everywhere:

| Role | Light | Dark |
|---|---|---|
| Paper | `#f4f2f7` | `#1a1026` |
| Ink | `#2b1b3d` | `#efeaf5` |
| Nav band | `#2b1b3d` | `#120a1c` |
| Captions | `#685c78` | `#a194b3` |
| Lines | `#ddd7e5` | `#3a2b4f` |
| Code panels | `#1f1330` | `#0d0715` |
| Accent | `#2ec4b6` | `#2ec4b6` |

- The teal accent is a fill only: the mark's center node, primary buttons,
  focus rings, and live status. It is too pale for text on paper.
- Headings and code are monospace, in sentence case. Body text is the system
  sans-serif.
- The palette lives in four places; change them together:
  - `index.html` and the other static pages (inlined, so each page paints in
    one request)
  - `explorer/assets/tokens.css` (explorer and peer)
  - `token/src/style.css`
  - `docs/src/styles/lattice.css`

## Writing

Keep words few and plain. Name things by what they do. Every claim must hold
for the shipped software; state a limitation rather than round it up.

## Deploying

Pushing to `main` publishes to GitHub Pages, and the docs rebuild daily to
follow `lattice-node` main. The build job can only read the repository; the
publish job runs no repository code.
