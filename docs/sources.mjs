// What the docs site publishes, in sidebar order. Each page is either a file in
// one of the project repositories (fetched at the version lattice-node main
// pins) or a page written here under `pages/`. Repository docs stay in their
// repositories; edit them there.

// Repositories pinned by lattice-node's Package.resolved are fetched at that
// version. The rest follow their default branch.
export const PINNED = { lattice: "Lattice", ivy2: "Ivy2", tally: "Tally", volumebroker: "VolumeBroker", cashew: "cashew" };
export const UNPINNED = ["lattice-node", "lattice-sdk", "lattice-skills", "lattice-sponsor"];

const p = (slug, file, label) => ({ slug, file, label });
const r = (slug, repo, path, label) => ({ slug, repo, path, label });

export const SECTIONS = [
  {
    label: "Learn",
    items: [
      p("learn", "docs/pages/learn/index.md", "What Lattice is"),
      p("learn/how-it-works", "docs/pages/learn/how-it-works.md", "How Lattice works"),
      p("learn/first-look", "docs/pages/learn/first-look.md", "Look at the live network"),
      r("learn/glossary", "lattice-skills", "skills/lattice-concepts/references/glossary.md", "Glossary"),
      r("learn/misconceptions", "lattice-skills", "skills/lattice-concepts/references/misconceptions.md", "Common misconceptions"),
      r("learn/philosophy", "Lattice", "docs/philosophy.md", "Design philosophy"),
    ],
  },
  {
    label: "Use",
    items: [
      p("use", "docs/pages/use/index.md", "Keys and the desktop app"),
    ],
  },
  {
    label: "Build",
    items: [
      p("build", "docs/pages/build/index.md", "Start here"),
      r("build/getting-started", "lattice-sdk", "docs/getting-started.md", "Getting started"),
      r("build/client-patterns", "lattice-skills", "skills/lattice-app-builder/references/client-patterns.md", "Client patterns"),
      r("build/policies", "lattice-skills", "skills/lattice-app-builder/references/policy.md", "Validity policies"),
      r("build/chainspec", "lattice-skills", "skills/lattice-child-chains/references/chainspec.md", "ChainSpec reference"),
      r("build/transaction-format", "lattice-skills", "skills/lattice-transactions/references/transaction-format.md", "Transaction format"),
      {
        label: "HTTP API",
        items: [
          r("build/http-api", "lattice-node", "docs/rpc-api.md", "Overview and route index"),
          r("build/http-api/reads-and-transactions", "lattice-node", "docs/api-reads-and-transactions.md", "Reads and transactions"),
          r("build/http-api/mining", "lattice-node", "docs/api-mining.md", "Mining routes"),
          r("build/http-api/operator", "lattice-node", "docs/api-operator.md", "Operator routes"),
        ],
      },
      r("build/sponsor-api", "lattice-sponsor", "docs/api.md", "Fee sponsor HTTP API"),
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
      p("run", "docs/pages/run/index.md", "Start here"),
      r("run/getting-started", "lattice-node", "docs/getting-started.md", "Getting started"),
      r("run/configuration", "lattice-node", "docs/configuration.md", "Configuration"),
      r("run/operator-cli", "lattice-node", "docs/operator-cli.md", "Operator CLI"),
      r("run/child-chains", "lattice-node", "docs/child-chains.md", "Child chains"),
      r("run/mining", "lattice-node", "docs/mining.md", "Mining"),
      r("run/mining-workers", "lattice-node", "docs/mining-workers.md", "Mining worker contract"),
      r("run/networking", "lattice-node", "docs/networking.md", "Networking"),
      r("run/storage", "lattice-node", "docs/storage.md", "Storage"),
      r("run/operations", "lattice-node", "docs/operations.md", "Running in production"),
      r("run/deployment", "lattice-node", "deploy/README.md", "systemd units"),
      r("run/troubleshooting", "lattice-node", "docs/troubleshooting.md", "Troubleshooting"),
      {
        label: "Fee sponsor",
        items: [
          r("run/fee-sponsor", "lattice-sponsor", "README.md", "Overview"),
          r("run/fee-sponsor/operating", "lattice-sponsor", "docs/operating.md", "Operating a fee sponsor"),
          r("run/fee-sponsor/risks", "lattice-sponsor", "docs/risks.md", "Risks"),
        ],
      },
      r("run/reproducible-builds", "lattice-node", "docs/reproducible-builds.md", "Reproducible builds"),
      r("run/release-verification", "lattice-node", "docs/release-verification.md", "Release verification"),
    ],
  },
  {
    label: "Protocol",
    items: [
      p("protocol", "docs/pages/protocol/index.md", "Start here"),
      r("protocol/architecture", "Lattice", "docs/foundational-architecture.md", "Architecture"),
      r("protocol/fork-choice", "Lattice", "docs/consensus-fork-choice.md", "Work and fork choice"),
      r("protocol/cross-chain", "Lattice", "docs/cross-chain.md", "Cross-chain transfers"),
      r("protocol/spec", "Lattice", "docs/spec.md", "Specification"),
      r("protocol/simulator", "Lattice", "docs/consensus-simulator.md", "Consensus simulator"),
      r("protocol/vectors", "Lattice", "Vectors/README.md", "Conformance vectors"),
      {
        label: "Node",
        items: [
          r("protocol/node/peer-protocol", "lattice-node", "docs/protocol.md", "Peer protocol"),
          r("protocol/node/mempool", "lattice-node", "docs/mempool.md", "Transaction pool policy"),
          r("protocol/node/architecture", "lattice-node", "docs/architecture.md", "Node architecture"),
          r("protocol/node/invariants", "lattice-node", "docs/correctness-invariants.md", "Node invariants"),
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
        label: "Node design documents",
        items: [
          r("protocol/design", "lattice-node", "docs/design/README.md", "Index"),
          r("protocol/design/fractal-structure", "lattice-node", "docs/design/fractal-structure.md"),
          r("protocol/design/chain-addressing", "lattice-node", "docs/design/chain-addressing.md"),
          r("protocol/design/process-trust-model", "lattice-node", "docs/design/process-trust-model.md"),
          r("protocol/design/consensus-fork-choice", "lattice-node", "docs/design/consensus-fork-choice.md"),
          r("protocol/design/proof-derived-work", "lattice-node", "docs/design/proof-derived-work.md"),
          r("protocol/design/modular-import-pipeline", "lattice-node", "docs/design/modular-import-pipeline.md"),
          r("protocol/design/weight-first-acquisition", "lattice-node", "docs/design/weight-first-acquisition.md"),
          r("protocol/design/block-fetching", "lattice-node", "docs/design/block-fetching.md"),
          r("protocol/design/mining-role-boundaries", "lattice-node", "docs/design/mining-role-boundaries.md"),
          r("protocol/design/bitcoin-anchored-genesis", "lattice-node", "docs/design/bitcoin-anchored-genesis.md"),
          r("protocol/design/node-design", "lattice-node", "docs/design/node-design.md"),
          r("protocol/design/sync-architecture", "lattice-node", "docs/design/sync-architecture.md"),
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
