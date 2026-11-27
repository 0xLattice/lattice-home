# Build: start here

How an app on Lattice is put together, what you need before you write one,
and which page to read for each part.

If Lattice itself is new to you, read
[How Lattice works](/docs/learn/how-it-works/) first. It takes ten minutes
and this section assumes it.

## Why build on Lattice

- **No backend to run.** The chain stores your app's data and enforces
  your rules. Your app can be a static web page.
- **Users own their accounts.** They sign their own writes with their own
  keys. You never hold a password or a key for them.
- **Your own rules and your own room.** With a chain of its own, your app
  sets its own fees and limits, and other apps' traffic cannot crowd it.
- **Answers anyone can check.** What your app reads from a node is checked
  against the chain's fingerprints, so users do not have to trust your
  server, or anyone's.

The costs are real too: writes are slow, never final and always public, and
a chain's rules cannot be changed after launch.
[Why Lattice is built this way](/docs/learn/why/) explains each one.

## What an app is made of

```text
your web page  ──reads──▶  a node  ──▶  the chain's data
      │
      └──asks the user's wallet to sign──▶  a transaction  ──▶  the chain
```

| Part | What it is | Where it is documented |
|---|---|---|
| A chain | Where the app's data lives. Often the app's own child chain, such as `Nexus/<app>`. | [ChainSpec reference](/docs/build/chainspec/) |
| Key-value data | The app's records: named entries on the chain, each holding text (usually JSON). | [Client patterns](/docs/build/client-patterns/) |
| A validity policy | A small WebAssembly program that accepts or rejects each write. It is how an app says who may write what. | [Validity policies](/docs/build/policies/) |
| A client | Your code, often a static web page. It reads the chain through a node and asks the user's wallet to sign writes. | [Getting started](/docs/build/getting-started/) |

There is no server of yours in this picture. The chain stores the data, the
policy enforces the rules, and users sign for themselves.

## What is different from other platforms

- **A policy is not a smart contract.** It only answers accept or reject.
  It cannot hold coin, change data or call another program, and there is no
  gas.
- **Writes are compare-and-swap.** Every write names the value it expects
  to replace and fails if that value has changed.
- **Writes are not instant and not final.** A write waits for the next
  block and can still be replaced afterwards. Show it as pending, then
  confirm by reading it back.
- **Everything is public.** Encrypt private data before writing it.
- **A chain's rules cannot be changed.** To change the policy, launch a new
  chain. Develop on a throwaway chain first.

## Do you need your own chain?

Not always. A chain enforces exactly one set of rules. Use an existing
chain when its rules already fit your app. Launch your own when you need:

- rules of your own (a policy);
- your own block time, limits and fees;
- room that other apps' traffic cannot fill.

## A first project, step by step

1. **Build a page that reads and writes.** The SDK guide makes a guestbook
   on the public test chain, `Nexus/testnet`, with no coin and no wallet:
   [Getting started](/docs/build/getting-started/).
2. **Learn the common recipes**: reading keys, writing, storing files and
   finding a node: [Client patterns](/docs/build/client-patterns/).
3. **Write the rules.** Decide who may write which keys and turn that into
   a policy: [Validity policies](/docs/build/policies/).
4. **Launch a development chain** under `Nexus/testnet` with your policy.
   This needs a node: [Child chains](/docs/run/child-chains/), with the
   settings explained in the
   [ChainSpec reference](/docs/build/chainspec/).
5. **Let users pay nothing, if you want.** A
   [fee sponsor](/docs/run/fee-sponsor/) pays fees on their behalf.

Building with a coding agent? Point it at
[For coding agents](/docs/build/agents/).

## Reference pages

| Page | Use it when |
|---|---|
| [Transaction format](/docs/build/transaction-format/) | You build or sign a transaction yourself instead of through the SDK or a wallet. |
| [HTTP API](/docs/build/http-api/) | You talk to a node directly, in any language. |
| [Fee sponsor HTTP API](/docs/build/sponsor-api/) | Your client asks a sponsor to pay a fee. |
| [`connect` reference](/docs/build/sdk/connect/) | You want to know what `connect` checks and every option it takes. |
| [SDK API reference](/docs/build/sdk/api/) | You look up a function or type. |
| SDK packages (in the sidebar) | You want one capability of the SDK without the rest. |
