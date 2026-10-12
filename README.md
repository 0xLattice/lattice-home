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

`download/release.mjs` stages unpublished version 0.1.1 candidates for Mac,
Linux (.deb and AppImage), and Windows. This draft must not be merged or deployed
until release publication is verified and deployment is approved. The live site
continues to serve version 0.1.0.
No download URL is emitted unless `published` is true, release metadata is
complete, and all four URL fields pass validation. Missing JavaScript leaves the links hidden with an explanation.

For a new release, download the exact public package, SHA256SUMS,
SHA256SUMS.minisig, and project public key. Verify the package digest and manifest
signature against the trusted key, and confirm the version, source revision,
requirements, and setup instructions before setting `published: true`.
Run `node test-site.mjs` and the token checks above, then test the direct download
in a browser. This change does not create releases or modify release keys.

Candidate filenames, versions, build-source revisions, sizes, digests and planned
release URLs are recorded. The `source` field identifies the tested build revision.
All packages include node revision `a09d22335117d04ac6e05f4be771dafd7ed4cdc1`.
The existing project public key remains unchanged. All four records stay
`published: false` until the public package bytes and checksum manifests are
downloaded and verified, and all three manifest signatures verify against the
trusted project key. Planned URLs are not evidence of publication.

Keep future records unpublished until their exact public assets, metadata,
requirements and signatures are verified. Update platform help alongside each
release. Do not infer support from the browser or reuse the Mac release metadata
for another platform.

`node test-site.mjs` validates real records against their declared publication
state and uses independent published/unpublished fixtures for every supported
format. Invalid metadata must hide and clear both new and previously rendered
links. Mac publication is independent of other platforms.

Candidate validation: the installed Linux .deb and extracted AppImage UI
were tested; normal AppImage FUSE mounting was not. The Windows shipped executable
passed startup and mining checks on Windows Server 2025; full UI tests used an
instrumented build. Installing WebView2 on a machine missing that runtime was not
tested. The Windows test environment used Ubuntu 24.04 in WSL. The WSL setup minimum is not a desktop Windows app support
matrix. Physical GPU and live-network behavior are not established by these tests.
