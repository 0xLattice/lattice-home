# Why Lattice is built this way

The reasons behind Lattice's design, in plain words. Each section names a
problem, says what Lattice does about it, and says what that choice costs.
Nothing here is needed to use Lattice, but it makes the rest of the
documentation easier to follow.

## The problem Lattice starts from

Suppose many apps want a blockchain. There are two usual answers, and each
has a cost.

| Usual answer | What goes wrong |
|---|---|
| **Everyone shares one chain.** | All apps compete for the same block space, so one busy app makes every other app slow and expensive. All apps also live under one set of rules that somebody has to govern. |
| **Every app runs its own separate chain.** | Each new chain has to find its own miners or validators from nothing. Until it does, it is cheap to attack. And moving coins between two separate chains needs a go-between that both sides must trust. |

Lattice aims for the middle: **chains that stay independent, but share
mining.**

- Independent, so one chain's traffic and rules do not affect another's.
- Shared mining, so a new chain does not start with no security.

Everything below follows from trying to get both at once.

## Why a tree of chains

**Problem.** One chain cannot be good at everything. A chain that is cheap
for anyone to run must stay small and slow. A chain that is fast and roomy
is expensive to run, so fewer people can check it.

**What Lattice does.** It keeps the root chain, Nexus, deliberately light:
a block about once an hour, at most one megabyte. Anything that needs to be
faster, bigger or different launches a child chain with its own settings.

**What you get.** Nexus stays cheap enough that many people can run it. An
app that needs one block a minute can have it without making anyone else
pay for it.

**What it costs.** A child chain's data is kept only by the people who
choose to run that chain. Deeper chains take more effort to follow.

## Why one mining search counts on many chains

**Problem.** Proof of work is only as strong as the computing power behind
it. A brand-new chain has almost none, so a separate proof-of-work chain is
easy to attack when it is young.

**What Lattice does.** A miner bundles blocks for several chains together
and searches once. The same attempt can produce a block on Nexus and on any
child chain in the bundle. Supporting one more chain costs the miner no
extra computing power.

**What you get.** A new chain can borrow existing miners instead of
recruiting its own.

**What it costs.** Nothing is free. A child chain is credited only with the
mining that actually included it, and each attempt is counted once, never
once per chain. A child that few miners include is weakly secured, and a
child that nobody mines stops.

## Why a parent does not check its children

**Problem.** If Nexus had to check every child chain's blocks, everyone
running Nexus would have to run every child too. Nexus would become as
heavy as all the chains put together, and children would depend on the
parent's approval.

**What Lattice does.** A parent block only records the fingerprint of a
child block. Whether that child block is valid is decided by the people
running the child chain, and nobody else.

**What you get.** Running Nexus stays cheap no matter how many chains hang
beneath it. A child chain answers to no one: its parent cannot approve,
reject or reorder its blocks.

**What it costs.** A child's correctness rests on its own participants. A
chain that nobody but its creator runs is only as trustworthy as its
creator.

## Why anyone can launch a chain

**Problem.** If launching a chain needed approval, someone would be the
gatekeeper of what may be built.

**What Lattice does.** Launching a chain takes no transaction and no
permission. You write its settings and start mining it under
a chain you already run.

**What it costs.** A name is not owned. If two people launch a chain at the
same path, both exist and the one with more mining behind it wins. An app
should pin a known block of the chain it means, not only the name.

## Why a chain's rules can never change

**Problem.** If someone could change a chain's rules, everyone using it
would have to trust that person.

**What Lattice does.** A chain's settings and its policy are fixed in its
first block. Nobody can change them afterwards, including whoever launched
the chain.

**What you get.** The rules you checked are the rules that stay.

**What it costs.** A mistake cannot be patched. To change a rule you launch
a new chain and move to it, so it pays to test on a throwaway chain first.

## Why everything is named by a fingerprint

**Problem.** Most people will not run a node. They ask someone else's, and
that someone could lie.

**What Lattice does.** Blocks, transactions, settings and stored data are
each named by a **CID**: a fingerprint computed from the content itself.
Change one byte and the fingerprint changes.

**What you get.** It does not matter who hands you the data. If its
fingerprint matches, it is the right data. Nodes can supply data, but they
cannot make false data look true.

**What it costs.** A fingerprint proves what a block contains, not that it
is the newest one. For "what is the latest block?" you still depend on the
nodes you ask, so ask more than one or run your own.

## Why policies instead of smart contracts

**Problem.** On a smart-contract chain, every node runs every app's
programs. Apps compete for that shared computer, pay for each step in gas,
and a bug in a program that holds coins can lose them.

**What Lattice does.** A chain may attach a **validity policy**: a small
program that looks at a proposed write and answers yes or no. That is all
it can do. It cannot hold coins, change data or start anything on its own.

**What you get.** Rules that are simple to reason about. No gas. An app's
rules run only on its own chain, not on everyone's.

**What it costs.** Nothing happens on a chain by itself. Anything automatic
has to be done by an app outside the chain, which then submits a write like
any user.

## Why coins move by exchange, not through a bridge

**Problem.** A bridge between two chains is a third party holding
everyone's coins. If it is hacked or dishonest, the coins are gone.

**What Lattice does.** Coins move between a chain and its direct child by a
swap between two people. One locks coins on the child and names a price.
The other pays that price on the parent, then collects the locked coins by
proving the payment happened. Each chain checks only its own half.

**What you get.** No go-between holds anything or has to be trusted.

**What it costs.** A swap needs someone willing to take the other side.
Once coins are locked there is no cancel, timeout or refund. Chains further
apart need one swap per level between them.

## Why there is no finality

Lattice uses plain proof of work: when two versions of history compete, the
one with more mining behind it wins. It adds no second mechanism that
declares a block permanent.

**What it costs.** No write is ever guaranteed. A block becomes harder to
replace as more mining is added on top of it, but there is no number of
blocks after which it is certain. An app should show a write as pending and
confirm it by reading it back.

## The costs in one place

- Writes are slow on Nexus and never final anywhere.
- A child chain is only as secure as the mining that includes it.
- A child chain's data exists only while someone chooses to keep it.
- A chain's rules cannot be fixed after launch.
- Moving coins between chains needs a counterparty.
- Everything written to a chain is public.

## Read next

- [How Lattice works](/docs/learn/how-it-works/): the same ideas as
  mechanisms, one at a time.
- [Design philosophy](/docs/learn/philosophy/): the full reasoning, in the
  protocol's own terms.
- [Fees and majority-reorg cost](/docs/network/fees-and-reorg-cost/): what
  replacing history would cost an attacker.
