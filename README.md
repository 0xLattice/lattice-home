# lattice-home

The Lattice website — a static website. Text-first, zero-accent, built on the [Lattice design system](https://github.com/adalinxx/lattice-design).

## What it is

A fast, honest front door that routes five audiences into the real substance (docs, spec, code) — it links *out* to `lattice-node/docs` and the repos rather than duplicating them.

- **Evaluator** — hero + three claims (one proof of work · opt-in subscription · no finality)
- **Operator** — Run a node
- **Miner** — Mine (external `lattice-miner`, bundled with lattice-node)
- **Developer** — Build a chain (deploy + policy model)
- **Skeptic** — Spec & security

House line: **One proof. Every chain.**

## Files

- `index.html` — the landing page. Design tokens (zero-accent; source of truth: `lattice-design`) are inlined so it paints in a single request. A small inline script feeds the live Network table from the public seed nodes.
- `download/` — beginner desktop setup and a fail-closed release configuration.
- `explorer/` — the Lattice block explorer, vendored in (client-side, talks to the nodes directly). Served at `/explorer/`.
- `token/` — the cross-chain Buy/Sell module. It stages wallet requests and is built to `/token/` during deployment.
- `lattice-mark.svg` — the mark (favicon).
- `.nojekyll` — so GitHub Pages serves the explorer assets raw.

The home page and explorer remain plain static files. The token module uses Vite and is the only build step:

```sh
npm ci --prefix token
npm test --prefix token
npm run build --prefix token
```

Pull requests run the same test and build. The Pages workflow builds in a job that can only read the repository, then publishes the static root and explorer alongside `token/dist` at `/token/` from a separate job that runs no repository code. Everything remains client-side with no website signing bridge or backend.

## Deliberately omitted

No token/price/roadmap-hype, team grid, partner logos, illustrations, or animation — each fights the design system.

## Desktop download publication

`download/release.mjs` holds the verified public Mac version 0.1.0 release URLs
and independent unpublished Linux and Windows records.
No download URL is emitted unless `published` is true, release metadata is
complete, and all four URL fields pass validation. Missing JavaScript leaves the links hidden with an explanation.

For a new release, download the exact public ZIP, SHA256SUMS,
SHA256SUMS.minisig, and project public key. Verify the ZIP digest and manifest
signature against the trusted key, and confirm the version, source revision,
requirements, and setup instructions before setting `published: true`.
Run `node test-site.mjs` and the token checks above, then test the direct download
in a browser. This change does not create releases or modify release keys.

Linux and Windows remain unavailable until their exact version, source revision,
architecture, supported OS versions, package format, digest, checksum manifest,
project signature and trusted public-key URL are verified. The current schema
supports a primary Linux .deb or AppImage and a Windows .exe installer. Verify
installation steps and signing behavior on each target OS before enabling its
record; update the platform help at the same time. Do not infer support from the
browser or reuse the Mac release metadata for another platform.

`node test-site.mjs` validates real records against their declared publication
state and uses independent published/unpublished fixtures for every supported
format. Invalid metadata must hide and clear both new and previously rendered
links. Mac publication is independent of other platforms.
