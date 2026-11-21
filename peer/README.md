# Browser peer

`index.html` joins the network as an overlay peer from the tab and follows a
chain, checking each header's CID and proof of work. By default it dials
`wss://lattice-testnet-apps-iad.fly.dev:4002/ivy`; `?node=` and `?key=` point
it at another node.

Built files:

- `ivy.wasm`: Ivy's WebAssembly core, `0xLattice/Ivy2` at 2a21777
  (`Web/build.sh` with Swift 6.4.1 and its wasm SDK), then
  `wasm-opt --strip-debug --strip-dwarf --strip-producers -Os`.
- `peer.js`: esbuild bundle of Ivy's `Web/dist/src/index.js` (same revision)
  and `@adalin/lattice-peer` from `0xLattice/lattice-sdk` at 0621b47:
  `esbuild main.js --bundle --format=esm --minify --target=es2022`, where
  `main.js` re-exports `Ivy`, `IvyModule`, `connectWebSocket` and
  `ChainFollower`.
