# Browser peer

`index.html` joins the network as an overlay peer from the tab and follows a
chain, checking each header's CID and proof of work. It dials
`wss://lattice-testnet-apps-iad.fly.dev:4002/ivy` by default (`?node=` and
`?key=` point it at another node), follows Nexus on that session to keep it
open, and for a child chain finds a host with `connectToChainHost`: a
provider already connected, else one of its web addresses, direct or
relayed.

Built files:

- `ivy.wasm`: Ivy's WebAssembly core, `0xLattice/Ivy2` at tag 3.3.0
  (3b7f806): `cd Web && npm ci && IVY_WASM_SDK=swift-6.4.1-RELEASE_wasm
  SWIFT="swiftly run +6.4.1 swift" sh build.sh`, then
  `wasm-opt --strip-debug --strip-dwarf --strip-producers -Os` (binaryen 133).
- `peer.js`: esbuild 0.24.0 bundle of Ivy's `Web/dist/src/index.js` (same
  revision) and `@adalin/lattice-peer` from `0xLattice/lattice-sdk` at
  97bac48 (`npm ci && npm run build`):
  `esbuild main.js --bundle --format=esm --minify --target=es2022`, where
  `main.js` re-exports `Ivy`, `IvyModule`, `connectWebSocket`,
  `ChainFollower` and `connectToChainHost`.
