# Network facts

This section states how the network is configured and how to check it
yourself. It makes no claims about price or future value.

## Configuration

- [Nexus tokenomics](/docs/network/tokenomics/): block time, issuance schedule,
  and supply as configured. The values that define Nexus have one canonical
  home, `NexusGenesis.swift` in `lattice-node`.
- [Fees and majority-reorg cost](/docs/network/fees-and-reorg-cost/): how fees
  are set and what reversing history costs an attacker.
- [Specification](/docs/protocol/spec/): the normative consensus rules.

## Security evidence

- [Adversarial security](/docs/network/adversarial-security/): the no-finality
  attack analysis.
- [Reproducible builds](/docs/run/reproducible-builds/) and
  [release verification](/docs/run/release-verification/): how to check that a
  binary matches its source.
- [Correctness invariants](/docs/protocol/node/invariants/): what the node
  guarantees, each with the check or test that enforces it.

## Live state

The [explorer](https://lattice.build/explorer/) reads chain heights, blocks,
and transactions directly from public nodes. Any node's
[HTTP API](/docs/build/http-api/) answers the same questions.

## Status

Lattice is pre-1.0 software. Chains have no finality, and a launched chain's
rules cannot be changed.
