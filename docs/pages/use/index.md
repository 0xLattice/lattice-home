# Wallets and the desktop app

Lattice keys are held by their owners. There is no account to sign up for and
no password to reset: whoever holds the recovery phrase controls the coins.
Never share it, and never enter it into a web page.

## Selfhold

[Selfhold](https://github.com/adalinxx/selfhold-wallet) is a self-custodial
wallet for Chrome. Keys are generated and used on your device; the wallet
talks directly to a node you choose and signs locally. Web apps on Lattice ask
Selfhold to sign and pay; the page never holds your keys.

## Lattice Desktop

[Lattice Desktop](https://lattice.build/download/) runs a full node and a
wallet on macOS, Linux, or Windows. It does not yet sign for web apps.

## Before you rely on a node

A node you do not run can serve a stale or wrong answer about balances and
inclusion. Read [Node trust and purchase safety](/docs/use/node-trust/) before
paying through someone else's node, and
[Networks, chain paths, and replay](/docs/use/network-binding/) before reusing
a key on more than one network.

Writes are not final. Lattice has no finality and no standard confirmation
depth; confirm an important payment by reading it back.
