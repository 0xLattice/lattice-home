# lattice-home

The Lattice website — a static website. Text-first, zero-accent, built on the [Lattice design system](https://github.com/adalinxx/lattice-design).

## What it is

A landing page for developers building apps for people and AI agents. It links *out* to `lattice-node/docs` and the repos rather than duplicating them.

- **Hero** — "Ship the app. Skip the backend.", with the client code for a paid write and a line to paste into a coding agent
- **What you stop building** — abuse protection, data, payments and accounts, each with the mechanism behind it
- **How it works** — records, rules and a page replace the backend; why (and when not) to run your own chain; the chain tree
- **Built for agents** — keys without signup, pay per write, verified reads, the lattice-skills plugin
- **Apps** — the open-source testnet apps, each with its chain path and source
- **Command-line setup** — node → rules → chain → mining → page
- **When Lattice is the wrong choice** — latency, no finality, public data, no contracts, pre-1.0
- **Network** — live height and peers from the public read nodes

Claims on the page must hold for the shipped software; state the tradeoff rather than round it up.

## Files

- `apps.json` — the one list of apps on Lattice. `apps/` renders it, with a live status line per app read from the app's chain; the home page features some of them, and `test-site.mjs` checks every entry and that the home page features only listed apps. Third parties list an app by pull request to this file.
- `agents.md` — the guide coding agents are pointed at from the hero: what Lattice is, the skills plugin, setup, and rules for acting on a user's behalf.
- `index.html` — the landing page. Design tokens (zero-accent; source of truth: `lattice-design`) are inlined so it paints in a single request. A small inline script feeds the live Network table from the public seed nodes.
- `download/` — beginner desktop setup and a fail-closed release configuration.
- `explorer/` — the Lattice block explorer, vendored in (client-side, talks to the nodes directly). Served at `/explorer/`.
- `vendor/` — the Lattice SDK bundled for the browser; the explorer and token module find child-chain nodes with it.
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

`download/release.mjs` holds verified public version 0.1.1 packages for Mac,
Linux (.deb and AppImage), and Windows. Version 0.1.0 releases remain available
in each platform repository's release history.
No download URL is emitted unless `published` is true, release metadata is
complete, and all four URL fields pass validation. Missing JavaScript leaves the links hidden with an explanation.

For a new release, download the exact public package, SHA256SUMS,
SHA256SUMS.minisig, and project public key. Verify the package digest and manifest
signature against the trusted key, and confirm the version, source revision,
requirements, and setup instructions before setting `published: true`.
Run `node test-site.mjs` and the token checks above, then test the direct download
in a browser. This change does not create releases or modify release keys.

Published filenames, versions, build-source revisions, sizes, digests and
release URLs are recorded. The `source` field identifies the tested build revision.
All packages include node revision `fd3684842e8091856b372d2fd56806a3551ba6a4`
and wallet revision `d1d6b9531994884a98a1abc0557945009c87915e`.
The existing project public key remains unchanged. All four public packages were
downloaded without authentication and checked against the approved sizes and
SHA256 digests. The three checksum manifests and signatures match the frozen
release files and verify against the trusted project key.

Keep future records unpublished until their exact public assets, metadata,
requirements and signatures are verified. Update platform help alongside each
release. Do not infer support from the browser or reuse the Mac release metadata
for another platform.

`node test-site.mjs` validates real records against their declared publication
state and uses independent published/unpublished fixtures for every supported
format. Invalid metadata must hide and clear both new and previously rendered
links. Mac publication is independent of other platforms.

Release validation: the installed Linux .deb and extracted AppImage UI
were tested; normal AppImage FUSE mounting was not. The Windows shipped executable
passed startup and mining checks on Windows Server 2025; full UI tests used an
instrumented build. Installing WebView2 on a machine missing that runtime was not
tested. The Windows test environment used Ubuntu 24.04 in WSL. The WSL setup minimum is not a desktop Windows app support
matrix. Physical GPU and live-network behavior are not established by these tests.
