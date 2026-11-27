# Protocol: start here

A map of the protocol documentation: what each document is, who it is for,
and the order to read them in.

These pages are for people who implement Lattice, audit it or study it. To
use, build on or operate Lattice you do not need them;
[How Lattice works](/docs/learn/how-it-works/) is enough.

## Reading order

1. [How Lattice works](/docs/learn/how-it-works/), if you have not read it.
   It gives the vocabulary.
2. [Architecture](/docs/protocol/architecture/): who decides what. Each
   chain is validated on its own; the node routes and stores.
3. [Work and fork choice](/docs/protocol/fork-choice/): how mining work is
   counted for each chain and how a chain picks its tip.
4. [Cross-chain transfers](/docs/protocol/cross-chain/): how coin moves
   between a chain and its child.
5. [Specification](/docs/protocol/spec/): the rules themselves. Read it
   last; it is exact rather than gentle.

The [glossary](/docs/learn/glossary/) defines every term these pages use.

## Which document settles a question

| Question | Document |
|---|---|
| Is this block or transaction valid? | [Specification](/docs/protocol/spec/). It is the only authority on consensus. |
| Does my implementation agree with it? | [Conformance vectors](/docs/protocol/vectors/): inputs with the exact bytes and results expected. |
| How do nodes talk to each other? | [Peer protocol](/docs/protocol/node/peer-protocol/). |
| Which transactions does a node accept and pass on? | [Transaction pool policy](/docs/protocol/node/mempool/). This is each node's choice, not consensus. |
| How does the node software work inside? | [Node architecture](/docs/protocol/node/architecture/). |
| What does the node guarantee, and what tests it? | [Node invariants](/docs/protocol/node/invariants/). |
| Why was it designed this way? | [Node design documents](/docs/protocol/design/) and [Design philosophy](/docs/learn/philosophy/). |
| How does it behave under attack? | [Consensus simulator](/docs/protocol/simulator/) and [Adversarial security](/docs/network/adversarial-security/). |

## Consensus and policy

Two kinds of rule appear in these pages, and they are easy to confuse.

- **Consensus rules** decide whether a block is valid. Every node on a
  chain must agree on them, and they are in the specification.
- **Node policy** is what one node chooses to do: which transactions it
  keeps waiting, which peers it serves, how much history it stores. Two
  correct nodes can differ.

## The libraries

The node is assembled from libraries, each documented under Components in
the sidebar.

| Library | Does |
|---|---|
| Lattice | The consensus rules: blocks, state, work and fork choice. |
| Ivy | Networking between nodes. |
| Tally | Peer reputation. |
| VolumeBroker | Storage of content on disk. |
| cashew | The content-addressed data structures everything is built from. |
