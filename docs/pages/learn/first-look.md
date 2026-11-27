# Look at the live network

Read real blocks from the Lattice network in five minutes, with nothing to
install. You need a terminal with `curl`. The examples pipe through
[`jq`](https://jqlang.org) to make the output readable; leave `| jq` off if
you do not have it.

Everything here only reads. Nothing costs coin, and nothing needs a key.

If a term is new, [How Lattice works](/docs/learn/how-it-works/) introduces
it.

## 1. Ask a node about Nexus

A node answers questions over HTTP. This one is public:

```bash
NODE=https://lattice-mainnet-read.fly.dev
curl -s $NODE/api/chain/info | jq
```

```json
{
  "chain": ["Nexus"],
  "height": "6671",
  "tipCID": "bafyreiavkb…",
  "genesisHash": "bafyreiggtg…",
  "minRelayFee": "1",
  "acceptsSubmit": true
}
```

| Field | Meaning |
|---|---|
| `chain` | The chain's path, one name per level. |
| `height` | How many blocks the chain has after its first. Yours will be higher. |
| `tipCID` | The newest block's fingerprint (its CID). |
| `genesisHash` | The first block's CID. It identifies the network: compare it with [Network facts](/docs/network/). |
| `minRelayFee` | The smallest fee this node passes on. Each node sets its own. |

Large numbers arrive as strings (`"6671"`), so no program rounds them.

## 2. Read the newest block

```bash
curl -s $NODE/api/block/latest | jq
```

```json
{
  "height": "6671",
  "hash": "bafyreiavkb…",
  "previousBlock": "bafyreidoob…",
  "timestamp": "1795758182805",
  "transactionCount": 0,
  "rewardRecipient": "bafyreicxos…",
  "rewardCredited": "1048576"
}
```

- `previousBlock` is the link to the block before. Blocks form a chain
  because each one names the last.
- `timestamp` is in milliseconds since 1970.
- `rewardRecipient` is the address the miner chose to be paid at, and
  `rewardCredited` is what the block paid it.

## 3. Follow the chain backwards

Copy the `previousBlock` value from your output and ask for that block:

```bash
curl -s $NODE/api/block/<previousBlock> | jq
```

Its `height` is one less. You can also ask by height
(`$NODE/api/block/1`), or list the newest few:

```bash
curl -s "$NODE/api/blocks?limit=3" | jq
```

## 4. Look up an account

Copy the `rewardRecipient` from step 2:

```bash
curl -s $NODE/api/state/account/<address> | jq
```

```json
{
  "owner": "bafyreicxos…",
  "balance": "58720256",
  "nonce": "0"
}
```

`balance` is in whole units; Nexus's coin has no decimal places. `nonce` is
the counter the account's next transaction must carry. Here it is 0: this
miner has earned rewards and never sent a transaction.

## 5. See the tree

List the chains launched directly under Nexus:

```bash
curl -s $NODE/api/chain/children | jq
```

```json
{
  "chainPath": ["Nexus"],
  "directories": ["hearth", "moniker", "swap-relays", "testnet"]
}
```

Each name is a child chain: `Nexus/testnet`, `Nexus/moniker`, and so on.
Your list may be longer.

A node only answers for the chains it follows, and this one follows Nexus
alone. Ask it who serves `Nexus/testnet`:

```bash
curl -s "$NODE/api/chain/endpoints?chainPath=Nexus/testnet" | jq
```

Then ask one of the listed nodes about the child chain itself:

```bash
TESTNET=https://ams.testnet.lattice.build
curl -s "$TESTNET/api/chain/info?chainPath=Nexus/testnet" | jq
curl -s "$TESTNET/api/chain/spec?chainPath=Nexus/testnet" | jq
```

The second command prints the chain's spec, the settings it was launched
with. Compare `targetBlockTime` (in milliseconds) and `initialReward` with
Nexus's: a child chain chooses its own. The testnet aims at one block a
minute where Nexus aims at one an hour.

## What you just did

- Read a chain's tip, a block and an account from a node you do not run.
- Followed the links that make blocks a chain.
- Walked from the root chain to a child chain.

The same questions can be asked in a browser at the
[explorer](https://lattice.build/explorer/).

## Next

| To | Read |
|---|---|
| Run a node of your own and ask it instead | [Run: start here](/docs/run/) |
| Read and write a chain from an app | [Build: start here](/docs/build/) |
| See every question a node answers | [HTTP API](/docs/build/http-api/) |
