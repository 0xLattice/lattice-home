# Run: start here

What a node is, whether you need one, and which page to read for what you
want to do.

## What a node does

A node is a program that follows the Lattice network. It:

- connects to other nodes and downloads blocks;
- checks every block against the rules, trusting nobody;
- keeps the chains' data on disk;
- answers questions about the chains over HTTP.

A node always follows Nexus. It also follows the child chains you tell it
to, which is called **hosting** them. One node process handles all of them.

## Do you need one?

| You want to | Need a node? |
|---|---|
| Hold coins and pay | No. [Lattice Desktop](https://lattice.build/download/) runs one for you beside its wallet. |
| Use or build an app | No. An app can read from public nodes. Run one when you do not want to rely on someone else's. |
| Mine | Yes. |
| Launch a child chain | Yes. A chain advances only while someone hosts and mines it. |
| Serve an explorer or an app's users | Yes. |

## The pieces

| Program | What it is |
|---|---|
| `lattice` | The command-line tool. You do everything through it. |
| `lattice-node` | The node itself. `lattice up` starts it. |
| The miner | A separate process that searches for blocks through a node. Optional. |

A node keeps everything under one directory, its **root**: its settings
(`lattice.json`), its identity key and its data.

## Your first node

1. [Getting started](/docs/run/getting-started/): install, start a node and
   watch it sync. A few minutes of work.
2. Pick what you want it to do:

   | Goal | Page |
   |---|---|
   | Earn rewards | [Mining](/docs/run/mining/) |
   | Launch your own chain, or follow someone's | [Child chains](/docs/run/child-chains/) |
   | Let other machines and apps reach it | [Networking](/docs/run/networking/) |
   | Keep it running as a service | [Running in production](/docs/run/operations/) |

3. When something goes wrong:
   [Troubleshooting](/docs/run/troubleshooting/) lists problems by symptom.

To experiment without touching real coin, host the public test chain,
`Nexus/testnet`, and launch throwaway chains beneath it.

## Reference pages

| Page | Use it when |
|---|---|
| [Configuration](/docs/run/configuration/) | You want to know what a setting does. |
| [Operator CLI](/docs/run/operator-cli/) | You want to know what a command does. |
| [Storage](/docs/run/storage/) | You need to limit disk use or back up. |
| [Mining worker contract](/docs/run/mining-workers/) | You are writing your own mining program. |
| [Fee sponsor](/docs/run/fee-sponsor/) | You want to pay transaction fees for an app's users. |
| [Reproducible builds](/docs/run/reproducible-builds/) and [Release verification](/docs/run/release-verification/) | You want to check a release before running it. |
