# Docs site

The Lattice documentation at [lattice.build/docs](https://lattice.build/docs/),
built with [Starlight](https://starlight.astro.build/).

Each document has one home: the repository whose code it describes. This site
is the place to read them. `sync.mjs` fetches `lattice-node` main, reads its
`Package.resolved`, and fetches Lattice, Ivy2, Tally, VolumeBroker and cashew at
the versions it pins (`lattice-sdk`, `selfhold-wallet` and `lattice-skills`
follow their default branch). It copies the files listed in `sources.mjs` into
`src/content/docs`, rewrites links between published files to site URLs and
other relative links to GitHub at the fetched version, and writes the sidebar.
Every page's footer names its source file and version; edit the source there.

`pages/` holds the few pages that belong to no other repository (the
landing page and the section overviews).

```sh
npm ci --prefix docs
npm test --prefix docs              # link rewriting
npm run build --prefix docs         # sync + build into docs/dist
node docs/check-links.mjs           # every /docs/ link and anchor resolves
DOCS_SOURCES=<dir> npm run build --prefix docs   # reuse checkouts in <dir>/<repo>
```

Pages deploys `docs/dist` at `/docs/` and rebuilds daily, so a version bump in
`lattice-node` main reaches the site within a day.
