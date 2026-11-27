# How Lattice works

The ideas the rest of the documentation builds on, one at a time. Each
section is short, introduces its own terms, and ends with a link to the
full account. Read [What Lattice is](/docs/learn/) first. For the reasons
behind each choice, see
[Why Lattice is built this way](/docs/learn/why/).

## 1. A chain is a list of blocks

A **chain** keeps a record: who holds how much coin, and whatever data its
apps have written. That record is the chain's **state**.

The state changes one **block** at a time. A block holds a list of
**transactions** (signed requests to change the state) and a link to the
block before it. Following the links back leads to the chain's first block,
its **genesis**. A block's **height** is how far it is from the genesis.

```text
genesis ── block 1 ── block 2 ── block 3   ← the tip
height 0   height 1   height 2   height 3
```

The newest block is the **tip**.

## 2. Mining decides which blocks count

Anyone can propose a block. To be accepted, a block must come with **proof
of work**: its miner has to find a number, by trial and error, that makes
the block's hash small enough. Finding it takes a lot of computing;
checking it takes almost none.

- The miner of a block receives the block's **reward** (new coin, on a
  schedule fixed when the chain was launched) and the **fees** of the
  transactions in it.
- The chain adjusts how hard the search is after every block, so blocks
  keep arriving at the chain's chosen pace.
- When two branches compete, nodes follow the one with more work behind it.
  The other branch is dropped, and its transactions go back to waiting.
  This is a **reorganization**.

Because a branch with more work always wins, no block is ever beyond
replacement. That is what "Lattice has no finality" means.

- Why: [no finality](/docs/learn/why/#why-there-is-no-finality).
- More: [Work and fork choice](/docs/protocol/fork-choice/).

## 3. Chains form a tree

Nexus is the root. Any chain can have child chains, and they can have
children of their own. A chain's name is its path: `Nexus/Payments`.

A child chain is a full chain, not a part of its parent:

- It has its own state, its own coin, its own block time and its own size
  limits. These settings are its **spec**, and they are fixed at launch.
- It checks its own blocks and picks its own tip.
- Its parent does not check the child's blocks. A parent block only records
  that a child block exists.

Launching a child chain takes no transaction and no permission. Whoever
runs a node on the parent writes a spec and starts mining the new chain.

- Why: [a tree](/docs/learn/why/#why-a-tree-of-chains), and
  [parents that do not check children](/docs/learn/why/#why-a-parent-does-not-check-its-children).
- More: [Child chains](/docs/run/child-chains/).

## 4. One search mines many chains

A miner does not pick one chain to work on. It builds a block for Nexus and
tucks the next block of each child chain it runs inside, like nested
envelopes. Then it searches once. Each attempt is checked against every
chain in the bundle. This is **merged mining**.

```text
one attempt
  ├─ good enough for Nexus?          → a Nexus block
  ├─ good enough for Nexus/Payments? → a Payments block
  └─ good enough for Nexus/Guestbook? → a Guestbook block
```

A child chain can be easier to mine than Nexus. An attempt that fails on
Nexus can then still produce a block for the child.

Two consequences:

- **A child is only as secure as the mining that includes it.** It is
  credited with the work of attempts that carried its blocks, not with all
  of Nexus's mining power.
- **A chain nobody mines stands still.**

- Why: [shared mining](/docs/learn/why/#why-one-mining-search-counts-on-many-chains).
- More: [Mining](/docs/run/mining/).

## 5. Accounts, keys and transactions

An **account** is a balance on one chain. It is controlled by a **key**: a
secret that only its owner holds. The account's **address** is derived from
the key and looks like `bafyrei…`. There is no sign-up and no password
reset. Whoever holds the key controls the account.

A **transaction** is a request signed with a key. It can:

- move coin between accounts;
- write data to the chain;
- take a step in moving coin between a chain and its child.

A transaction names the chain it is for and carries a counter (its
**nonce**), so it cannot be replayed on another chain or used twice.

**Fees.** A transaction pays a fee by taking slightly more from its sender
than it gives to anyone. The difference goes to the miner. Each node sets
the smallest fee it will pass on; when blocks are full, higher fees get in
first.

More: [Transaction format](/docs/build/transaction-format/).

## 6. Apps store data on a chain

Besides balances, a chain stores **key-value data**: named entries such as
`user/alice/profile`, each holding a piece of text. An app's data lives
there.

Every write says what value it expects to replace. If someone else changed
the entry first, the write is rejected, so two writers never silently
overwrite each other.

By default anyone may write any entry. A chain restricts that with a
**validity policy**: a small program, fixed in the chain's spec, that looks
at each transaction and answers accept or reject. A typical policy says
"only Alice's key may write under `user/alice/`".

A policy is not a smart contract. It cannot hold coin, change state, or run
on its own.

So an app on Lattice has four parts:

1. **A chain**, often the app's own child chain.
2. **Key-value data** on that chain.
3. **A validity policy** that says which writes are allowed.
4. **A client**, often a plain web page, that reads the chain and asks the
   user's wallet to sign writes.

- Why: [policies, not smart contracts](/docs/learn/why/#why-policies-instead-of-smart-contracts).
- More: [Build: start here](/docs/build/).

## 7. Coins move between a chain and its child

Each chain has its own coin. Coin moves between a chain and its direct
child by an exchange between two people, not through a bridge:

1. Alice has coin on the child and wants coin on the parent. She locks her
   coin on the child and states the amount she wants on the parent.
2. Bob pays Alice that amount on the parent.
3. Bob claims the coin Alice locked on the child.

Chains further apart need one exchange per step of the tree. A lock cannot
be cancelled or refunded, so it is only worth making when someone is ready
to take the other side.

- Why: [an exchange, not a bridge](/docs/learn/why/#why-coins-move-by-exchange-not-through-a-bridge).
- More: [Cross-chain transfers](/docs/protocol/cross-chain/).

## 8. Nodes, and checking what they tell you

A **node** is a program that follows chains: it downloads blocks, checks
them, and answers questions about them. A node follows Nexus and whichever
child chains its operator chooses.

You do not need to run a node to use Lattice; an app can ask someone else's.
What keeps that safe is that almost everything on Lattice is named by a
**CID**, a fingerprint of its content. If you ask for a block by its CID,
you can check that the bytes you receive match the fingerprint, whoever
sent them.

The one thing a fingerprint cannot tell you is which block is the current
tip. For that you rely on the nodes you ask, or run your own.

- Why: [fingerprints](/docs/learn/why/#why-everything-is-named-by-a-fingerprint).
- More: [Run: start here](/docs/run/).

## Where to go next

- [Look at the live network](/docs/learn/first-look/): see these ideas in
  real data.
- [Glossary](/docs/learn/glossary/): precise definitions of every term
  above.
- [Common misconceptions](/docs/learn/misconceptions/): where Lattice
  differs from other blockchains.
