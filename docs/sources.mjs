// What the docs site publishes, in sidebar order. Each page is either a file in
// one of the project repositories (fetched at the version lattice-node main
// pins) or a page written here under `pages/`. Repository docs stay in their
// repositories; edit them there.

// Repositories pinned by lattice-node's Package.resolved are fetched at that
// version. The rest follow their default branch.
export const PINNED = { lattice: "Lattice", ivy2: "Ivy2", tally: "Tally", volumebroker: "VolumeBroker", cashew: "cashew" };
export const UNPINNED = ["lattice-node", "lattice-sdk", "selfhold-wallet", "lattice-skills"];

const p = (slug, file, label) => ({ slug, file, label });
const r = (slug, repo, path, label) => ({ slug, repo, path, label });

export const SECTIONS = [
  {
    label: "Learn",
    items: [
      p("learn", "docs/pages/learn/index.md", "What Lattice is"),
      r("learn/philosophy", "Lattice", "docs/philosophy.md", "Design philosophy"),
      r("learn/glossary", "lattice-skills", "skills/lattice-concepts/references/glossary.md", "Glossary"),
      r("learn/misconceptions", "lattice-skills", "skills/lattice-concepts/references/misconceptions.md", "Common misconceptions"),
    ],
  },
  {
    label: "Use",
    items: [
      p("use", "docs/pages/use/index.md", "Wallets and the desktop app"),
      r("use/node-trust", "selfhold-wallet", "docs/node-trust.md", "Node trust and purchase safety"),
      r("use/network-binding", "selfhold-wallet", "docs/network-binding.md", "Networks, chain paths, and replay"),
      r("use/backup-formats", "selfhold-wallet", "docs/qr-formats.md", "Backup and transfer formats"),
      r("use/privacy", "selfhold-wallet", "docs/privacy-policy.md", "Selfhold privacy policy"),
    ],
  },
  {
    label: "Build",
    items: [
      r("build/getting-started", "lattice-sdk", "docs/getting-started.md", "Getting started"),
      r("build/client-patterns", "lattice-skills", "skills/lattice-app-builder/references/client-patterns.md", "Client patterns"),
      r("build/policies", "lattice-skills", "skills/lattice-app-builder/references/policy.md", "Validity policies"),
      r("build/chainspec", "lattice-skills", "skills/lattice-child-chains/references/chainspec.md", "ChainSpec reference"),
      r("build/transaction-format", "lattice-skills", "skills/lattice-transactions/references/transaction-format.md", "Transaction format"),
      r("build/http-api", "lattice-node", "docs/rpc-api.md", "HTTP API"),
      p("build/agents", "agents.md", "For coding agents"),
      {
        label: "SDK",
        items: [
          r("build/sdk/architecture", "lattice-sdk", "docs/architecture.md", "Architecture"),
          r("build/sdk/content-gateway", "lattice-sdk", "docs/content-gateway.md", "Content gateway"),
          r("build/sdk/sdk", "lattice-sdk", "packages/sdk/README.md", "lattice-sdk"),
          r("build/sdk/client", "lattice-sdk", "packages/client/README.md", "lattice-client"),
          r("build/sdk/core", "lattice-sdk", "packages/core/README.md", "lattice-core"),
          r("build/sdk/volumes", "lattice-sdk", "packages/volumes/README.md", "lattice-volumes"),
          r("build/sdk/relay", "lattice-sdk", "packages/relay/README.md", "lattice-relay"),
        ],
      },
    ],
  },
  {
    label: "Run",
    items: [
      r("run/getting-started", "lattice-node", "docs/getting-started.md", "Getting started"),
      r("run/operator-cli", "lattice-node", "docs/operator-cli.md", "Operator CLI"),
      r("run/lattice-json", "lattice-skills", "skills/lattice-node-operator/references/lattice-json.md", "lattice.json reference"),
      r("run/operations", "lattice-node", "docs/operations.md", "Operations runbook"),
      r("run/deployment", "lattice-node", "deploy/README.md", "Deployment"),
      r("run/mining-workers", "lattice-node", "docs/mining-workers.md", "Mining workers"),
      r("run/reproducible-builds", "lattice-node", "docs/reproducible-builds.md", "Reproducible builds"),
      r("run/release-verification", "lattice-node", "docs/release-verification.md", "Release verification"),
    ],
  },
  {
    label: "Protocol",
    items: [
      r("protocol/spec", "Lattice", "docs/spec.md", "Specification"),
      r("protocol/architecture", "Lattice", "docs/foundational-architecture.md", "Architecture"),
      r("protocol/fork-choice", "Lattice", "docs/consensus-fork-choice.md", "Work and fork choice"),
      r("protocol/cross-chain", "Lattice", "docs/cross-chain.md", "Cross-chain transfers"),
      r("protocol/simulator", "Lattice", "docs/consensus-simulator.md", "Consensus simulator"),
      r("protocol/vectors", "Lattice", "Vectors/README.md", "Conformance vectors"),
      {
        label: "Node",
        items: [
          r("protocol/node/boundary", "lattice-node", "docs/protocol.md", "Protocol boundary"),
          r("protocol/node/architecture", "lattice-node", "docs/architecture.md", "Architecture"),
          r("protocol/node/invariants", "lattice-node", "docs/correctness-invariants.md", "Correctness invariants"),
        ],
      },
      {
        label: "Components",
        items: [
          r("protocol/ivy", "Ivy2", "README.md", "Ivy (networking)"),
          r("protocol/ivy/architecture", "Ivy2", "docs/architecture.md", "Ivy architecture"),
          r("protocol/ivy/event-codec", "Ivy2", "docs/event-codec.md", "Ivy event codec"),
          r("protocol/ivy/invariants", "Ivy2", "docs/correctness-invariants.md", "Ivy invariants"),
          r("protocol/tally", "Tally", "README.md", "Tally (peer reputation)"),
          r("protocol/tally/architecture", "Tally", "docs/architecture.md", "Tally architecture"),
          r("protocol/tally/invariants", "Tally", "docs/correctness-invariants.md", "Tally invariants"),
          r("protocol/volumebroker", "VolumeBroker", "README.md", "VolumeBroker (storage)"),
          r("protocol/volumebroker/invariants", "VolumeBroker", "docs/correctness-invariants.md", "VolumeBroker invariants"),
          r("protocol/cashew", "cashew", "README.md", "cashew (content-addressed data)"),
          r("protocol/cashew/architecture", "cashew", "docs/architecture.md", "cashew architecture"),
          r("protocol/cashew/data-structures", "cashew", "docs/data-structures.md", "cashew data structures"),
          r("protocol/cashew/encryption", "cashew", "Sources/cashew/Encryption/README.md", "cashew encryption"),
          r("protocol/cashew/invariants", "cashew", "docs/correctness-invariants.md", "cashew invariants"),
        ],
      },
      {
        label: "Design records",
        items: [
          r("protocol/design/fractal-structure", "lattice-node", "docs/design/fractal-structure.md"),
          r("protocol/design/chain-addressing", "lattice-node", "docs/design/chain-addressing.md"),
          r("protocol/design/process-trust-model", "lattice-node", "docs/design/process-trust-model.md"),
          r("protocol/design/consensus-fork-choice", "lattice-node", "docs/design/consensus-fork-choice.md"),
          r("protocol/design/proof-derived-work", "lattice-node", "docs/design/proof-derived-work.md"),
          r("protocol/design/modular-import-pipeline", "lattice-node", "docs/design/modular-import-pipeline.md"),
          r("protocol/design/weight-first-acquisition", "lattice-node", "docs/design/weight-first-acquisition.md"),
          r("protocol/design/acquisition-work-gating", "lattice-node", "docs/design/acquisition-work-gating.md"),
          r("protocol/design/bulk-sync-stream", "lattice-node", "docs/design/bulk-sync-stream.md"),
          r("protocol/design/block-fetching", "lattice-node", "docs/design/block-fetching.md"),
          r("protocol/design/mining-role-boundaries", "lattice-node", "docs/design/mining-role-boundaries.md"),
          r("protocol/design/operator-finality", "lattice-node", "docs/design/operator-finality.md"),
          r("protocol/design/bitcoin-anchored-genesis", "lattice-node", "docs/design/bitcoin-anchored-genesis.md"),
          r("protocol/design/deterministic-simulation-testing", "lattice-node", "docs/design/deterministic-simulation-testing.md"),
        ],
      },
    ],
  },
  {
    label: "Network",
    items: [
      p("network", "docs/pages/network/index.md", "Network facts"),
      r("network/tokenomics", "Lattice", "docs/economics/nexus-tokenomics.md", "Nexus tokenomics"),
      r("network/fees-and-reorg-cost", "Lattice", "docs/economics/fee-market-and-51pct.md", "Fees and majority-reorg cost"),
      r("network/adversarial-security", "Lattice", "docs/consensus/adversarial-report.md", "Adversarial security"),
    ],
  },
];

// Repository files the site replaces: links to them land on the site page.
export const ALIASES = [
  { repo: "lattice-node", path: "docs", slug: "" },
  { repo: "lattice-node", path: "docs/index.md", slug: "" },
  { repo: "Lattice", path: "docs/index.md", slug: "" },
];
