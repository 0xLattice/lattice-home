# What Lattice is

Lattice is a network of proof-of-work blockchains arranged as a tree.
**Nexus** is the root chain. Anyone can launch a child chain beneath a chain
their node runs, with one command and no approval.

A chain is named by its path from the root: `Nexus`, `Nexus/Payments`,
`Nexus/Payments/Rollups`.

## How it works

- **Each chain is its own ledger.** It has its own rules, its own coin, its
  own block time and its own limits, fixed when it is launched. It validates
  its own blocks and chooses its own best chain.
- **One mining search secures many chains.** A miner searches for a single
  proof of work that counts on every chain it chooses to mine. This is
  called merged mining.
- **A child is secured by the work that includes it.** A parent block can
  carry a child block. The child is credited only with work from blocks that
  actually carry it. It does not inherit all of Nexus's mining power.
- **Parents do not validate children.** A parent records that a child block
  exists. Whether that block is valid is decided by the nodes that run the
  child.
- **Coins move between a chain and its direct child** by a two-party
  exchange, not a bridge.

## What an app on Lattice is made of

1. **A chain**, usually the app's own child chain, such as `Nexus/<app>`.
2. **Key-value state** on that chain. Every write names the value it expects
   to replace and is rejected if that value has changed, so two writers
   cannot silently overwrite each other.
3. **A validity policy**: a small WebAssembly program that accepts or rejects
   each write. A policy is not a smart contract: it cannot hold funds or
   change state, and there is no gas.
4. **A client**, often a static web page, that reads state it can verify and
   writes through the user's wallet.

An app does not always need a chain of its own. A chain enforces exactly one
set of rules, so its own chain buys an app custom rules, isolation from other
apps' traffic, and its own fees and limits.

## What Lattice does not do

- **No finality.** A block can be replaced by a heavier chain, and there is
  no standard number of confirmations. Confirm an important write by reading
  it back.
- **No instant writes.** A write waits for the next block. Nexus's block
  time is one hour; a child chain sets its own.
- **No private data.** Everything on a chain is public. Encrypt what must
  stay private before writing it.
- **No changing the rules.** A chain's parameters and policy cannot be
  changed after launch. To change them, launch a new chain.
- **No programs that act on their own.** A policy only accepts or rejects a
  write someone submits.

## Read next

- [Glossary](/docs/learn/glossary/): the vocabulary used across these docs.
- [Common misconceptions](/docs/learn/misconceptions/): what people expect
  from other blockchains that is not true here.
- [Design philosophy](/docs/learn/philosophy/): why it is built this way,
  and the tradeoffs.
- [Work and fork choice](/docs/protocol/fork-choice/): how mining secures
  each chain.
