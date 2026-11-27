# What Lattice is

Lattice is a network of blockchains arranged as a tree. This page explains
the idea in plain words. It assumes only that you have heard of Bitcoin.

## The idea in one minute

A blockchain is a shared record that nobody owns. Bitcoin is one: a single
chain of blocks, kept honest by miners who spend computing power on it.

Lattice is many such chains instead of one. They form a tree:

```text
Nexus                     the root chain
├── Payments              a chain launched under Nexus
│   └── Rollups           a chain launched under Payments
└── Guestbook             another chain under Nexus
```

- **Nexus** is the chain at the root. There is exactly one.
- Every other chain is a **child chain**. It sits under one **parent**.
- A chain is named by its path from the root, like a folder:
  `Nexus/Payments/Rollups`.

Anyone can launch a child chain, with one command and nobody's approval.

## Why a tree

The short version is below;
[Why Lattice is built this way](/docs/learn/why/) gives the reasons for
every design choice and what each costs.

One chain has one set of rules, one coin and one queue for everyone's
transactions. Lattice lets each use have its own chain instead:

- **Its own rules.** A chain decides what a valid write is.
- **Its own coin**, with its own supply schedule.
- **Its own pace and limits**: how often blocks come and how big they are.
- **Its own traffic.** A busy chain does not fill up its neighbours' blocks.

The chains still share one thing: mining. A miner does one piece of work,
and that work counts on Nexus and on every child chain the miner chose to
include. A miner can secure a new chain without taking computing power away
from the others.

## What you can do with it

| You are | You can |
|---|---|
| Someone who holds coins or uses apps | Keep your own keys, pay, and use apps that run on a chain. See [Keys and the desktop app](/docs/use/). |
| A developer | Build an app that stores its data on a chain and lets users sign their own writes. See [Build](/docs/build/). |
| An operator | Run a node, mine, or launch a chain of your own. See [Run](/docs/run/). |
| A researcher or implementer | Read the rules every node enforces. See [Protocol](/docs/protocol/). |

## What Lattice does not do

Lattice leaves out some things other blockchains have. Knowing them early
saves surprises.

- **No finality.** A block can be replaced if a branch with more mining
  work behind it appears. There is no number of confirmations after which a
  write is guaranteed. Confirm an important write by reading it back.
- **No instant writes.** A write waits for the next block. On Nexus a block
  comes about once an hour; a child chain sets its own pace.
- **No private data.** Everything on a chain is public. Encrypt what must
  stay private before you write it.
- **No changing the rules.** A chain's settings are fixed when it is
  launched. To change them, launch a new chain.
- **No smart contracts.** A chain can run a small program that accepts or
  rejects each write, but that program cannot hold coins or act on its own.

## Read next

1. [Why Lattice is built this way](/docs/learn/why/): the problem, each
   design choice, and what each one costs.
2. [How Lattice works](/docs/learn/how-it-works/): blocks, mining, the
   tree, transactions and apps, one idea at a time.
3. [Look at the live network](/docs/learn/first-look/): read real blocks
   from your terminal.
4. [Glossary](/docs/learn/glossary/): every term these docs use.

If you already know another blockchain well,
[Common misconceptions](/docs/learn/misconceptions/) lists what works
differently here, and [Design philosophy](/docs/learn/philosophy/) gives
the reasoning in the protocol's own terms.
