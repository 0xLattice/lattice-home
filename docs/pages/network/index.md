# Network facts

How Nexus, the root chain, is configured, and how to check it yourself. This
page makes no claims about price or future value.

## Nexus

| | |
|---|---|
| Block time | One hour (target) |
| Block reward | 1,048,576 per block, halving every 876,600 blocks (about 100 years) |
| Premine | 183,836,344,320, credited in the genesis block: about 10% of supply |
| Maximum supply | 1,838,362,566,600 |
| Difficulty adjustment | Every block (ASERT), with a half-life of 120 blocks, about five days |
| Block size | At most 1,000,000 bytes |
| State growth | At most 3,000,000 bytes per block |
| Transactions | At most 5,000 per block |
| Fees | A transaction's fee is what it debits beyond what it credits. The block's reward recipient collects it. |
| Finality | None |
| Genesis | `bafyreiggtg4ezifboyekbf4gxst2jr3mpjqcxsbmopy7w6fp46g4ngpgxa` |

Amounts are whole units; the chain has no decimal places. These values are
fixed in the genesis block and cannot be changed. Where they come from, and
the arithmetic, is in [Nexus tokenomics](/docs/network/tokenomics/).

Every child chain sets its own values for all of these when it is launched.

## Reaching the network

| | |
|---|---|
| Explorer | [lattice.build/explorer](https://lattice.build/explorer/) |
| Public read node | `https://lattice-mainnet-read.fly.dev` |
| Seed nodes | `seed1.lattice.build` to `seed4.lattice.build`, port 4001 |
| Test network | The child chain `Nexus/testnet` |

Any node's [HTTP API](/docs/build/http-api/) answers the same questions the
explorer does. To run your own, see
[Run: getting started](/docs/run/getting-started/).

## Security

- [Fees and majority-reorg cost](/docs/network/fees-and-reorg-cost/): how
  fees work and what reversing history costs an attacker.
- [Merged-mining security of a child chain](/docs/network/merged-mining-security/):
  what reorganizing a child chain costs.
- [Adversarial security](/docs/network/adversarial-security/): simulated
  attacks on a chain with no finality, and the thresholds found.
- [Specification](/docs/protocol/spec/): the consensus rules.

## Checking the software

- [Reproducible builds](/docs/run/reproducible-builds/) and
  [release verification](/docs/run/release-verification/): how to check that
  a binary matches its source.
- [Correctness invariants](/docs/protocol/node/invariants/): what the node
  guarantees, each with the test that enforces it.
