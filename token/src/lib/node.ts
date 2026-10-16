// Read-only node access for the Buy list: find the child chain's node, list
// its sell deposits, and ask the parent which are already paid for. Answers
// are shown, never trusted: the wallet proves each deposit before it pays.

import { ChainNodeFinder, ChainOfflineError } from "../../../vendor/lattice-sdk.js";
import { NEXUS_NODE } from "./config.ts";
import { byPrice, depositKey, parseDepositRow, unsigned, type Deposit } from "./deposits.ts";

const TIMEOUT_MS = 8_000;
const LIST_PAGE = 100;
const MAX_LIST_PAGES = 20;

export class NodeReadError extends Error {}

async function getJSON(base: string, path: string, params: Record<string, string>): Promise<Record<string, unknown>> {
  const url = new URL(base.replace(/\/$/, "") + path);
  for (const [name, value] of Object.entries(params)) url.searchParams.set(name, value);
  let response: Response;
  try {
    response = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS), redirect: "error", credentials: "omit", headers: { Accept: "application/json" } });
  } catch {
    throw new NodeReadError(`${url.host} did not answer.`);
  }
  if (response.status === 429) throw new NodeReadError(`${url.host} is limiting requests. Wait a moment, then press Refresh.`);
  if (!response.ok) throw new NodeReadError(`${url.host} answered HTTP ${response.status}.`);
  const body: unknown = await response.json().catch(() => null);
  if (!body || typeof body !== "object" || Array.isArray(body)) throw new NodeReadError(`${url.host} sent an unexpected answer.`);
  return body as Record<string, unknown>;
}

// Finding a chain's node is the SDK's: the Nexus read service when it serves the
// chain, else a host found through the chain's declared endpoints that serves it
// on the same network. What a parent commits never decides; consistency, not proof.
const finder = new ChainNodeFinder(NEXUS_NODE, { fetch: (input, init) => fetch(input, init) });

/** A node that answers for `chain`. */
export async function endpointFor(chain: readonly string[]): Promise<string> {
  try {
    return (await finder.nodeFor(chain)).url;
  } catch (error) {
    if (error instanceof ChainOfflineError) throw new NodeReadError(`No reachable node serves ${chain.join("/")}.`);
    const host = new URL(NEXUS_NODE).host;
    if ((error as { status?: unknown }).status === 429) throw new NodeReadError(`${host} is limiting requests. Wait a moment, then press Refresh.`);
    throw new NodeReadError(`${host} did not answer.`);
  }
}

/** `url`, from {@link endpointFor}, failed reading `chain`: find another next time. */
export function forgetEndpoint(chain: readonly string[], url: string): Promise<void> {
  return finder.forget(chain, { url, found: url !== finder.startURL });
}

/** Every sell deposit the child node lists, cheapest first. `truncated` when
 * the node had more pages than this page reads. `tipHeight` is the node's tip
 * read just before the list, so a confirmation count is never overstated by
 * blocks that arrived while the list was being read. `unusable` counts listed
 * rows left out because a wallet could not buy them as given. */
export async function listDeposits(childNode: string, childChain: readonly string[]): Promise<{ deposits: Deposit[]; truncated: boolean; tipHeight: bigint | null; unusable: number }> {
  const chainPath = childChain.join("/");
  const tipHeight = await getJSON(childNode, "/api/chain/info", { chainPath }).then((info) => unsigned(info.height), () => null);
  const found = new Map<string, Deposit>();
  let after: string | undefined, unusable = 0;
  for (let page = 0; page < MAX_LIST_PAGES; page += 1) {
    const body = await getJSON(childNode, "/api/deposits", { chainPath, limit: String(LIST_PAGE), ...(after === undefined ? {} : { after }) });
    if (!Array.isArray(body.deposits)) throw new NodeReadError("The node did not return a deposit list.");
    for (const row of body.deposits) {
      const deposit = parseDepositRow(row);
      if (deposit) found.set(depositKey(deposit), deposit); else unusable += 1;
    }
    // A node with nothing further sends null or omits the cursor.
    if (typeof body.next !== "string" || body.next === after) return { deposits: [...found.values()].sort(byPrice), truncated: false, tipHeight, unusable };
    after = body.next;
  }
  return { deposits: [...found.values()].sort(byPrice), truncated: true, tipHeight, unusable };
}

/** Whether the parent chain already holds a payment for this deposit. */
export async function isBought(parentNode: string, childChain: readonly string[], deposit: Deposit): Promise<boolean> {
  const body = await getJSON(parentNode, "/api/receipt-state", {
    demander: deposit.demander, amount: deposit.amountDemanded.toString(), nonce: deposit.depositNonce.toString(), chainPath: childChain.join("/"),
  });
  if (typeof body.exists !== "boolean") throw new NodeReadError("The parent node sent an unexpected receipt answer.");
  return body.exists;
}

/** The next `count` deposits from `start` that nobody has paid for yet, and
 * where to continue from. Checks a few at a time, in price order. */
export async function nextOpenDeposits(
  parentNode: string, childChain: readonly string[], sorted: readonly Deposit[], start: number, count: number,
  bought: (deposit: Deposit) => Promise<boolean> = (deposit) => isBought(parentNode, childChain, deposit),
): Promise<{ open: Deposit[]; next: number }> {
  const open: Deposit[] = [];
  let index = start;
  while (open.length < count && index < sorted.length) {
    const batch = sorted.slice(index, index + Math.min(6, count - open.length));
    const taken = await Promise.all(batch.map(bought));
    batch.forEach((deposit, position) => { if (!taken[position]) open.push(deposit); });
    index += batch.length;
  }
  return { open, next: index };
}
