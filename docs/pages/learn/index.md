# What Lattice is

Lattice is a network of permissionless proof-of-work ledgers arranged as a
tree. **Nexus** is the root. Anyone can add a child chain beneath any chain
they host, with one command and no approval. Miners merge-mine: one search
counts on every chain they choose to mine.

Each chain validates its own blocks, owns its own parameters, and runs its own
fork choice. A child receives only the verified work that actually commits it;
it does not inherit all of Nexus's hashpower.

## What an app on Lattice is made of

1. **A chain**, usually its own child chain, such as `Nexus/<app>`.
2. **Key–value state** on that chain. Every write names the value it read, so
   writes are compare-and-swap.
3. **A WASM validity policy** that accepts or rejects writes. Policies are not
   smart contracts: they cannot hold funds or change state, and there is no
   gas metering.
4. **A client**, often a static web page, that reads verified state and writes
   through the user's wallet.

An app does not always need its own chain. A chain enforces exactly one set of
rules, so a chain of its own buys custom rules, isolation from other apps'
traffic, and its own fees and limits.

## Read next

- [Design philosophy](/docs/learn/philosophy/): motivation, tradeoffs, and limits.
- [Glossary](/docs/learn/glossary/): the vocabulary used across these docs.
- [Common misconceptions](/docs/learn/misconceptions/): what Lattice does not do.
- [Work and fork choice](/docs/protocol/fork-choice/): how mining secures each chain.
