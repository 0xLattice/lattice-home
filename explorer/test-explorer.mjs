// The explorer's chain resolution and child listing, run in a sandbox with a
// scripted network: no browser, no real nodes.
//
//   node --test explorer/test-explorer.mjs
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import vm from "node:vm";

const NEXUS = "https://nexus.test";
const FOLLOWER = "https://follower.test";
const OTHER_NET = "https://other-network.test";
const GENESIS = "bafy-nexus-genesis";

const source = readFileSync(new URL("./assets/app.js", import.meta.url), "utf8");
assert.ok(source.trimEnd().endsWith("boot();"), "app.js ends by booting");
const library = source.trimEnd().slice(0, -"boot();".length);

/**
 * A fresh explorer over `routes`: "<origin><path>?chainPath=<p>" → a JSON
 * body, or a number for an error status. Unlisted requests are 404.
 */
function explorer(routes) {
  const requests = [];
  const respond = (url) => {
    const u = new URL(url);
    const key = u.origin + u.pathname + (u.searchParams.get("chainPath") ? `?chainPath=${u.searchParams.get("chainPath")}` : "");
    requests.push(key);
    const answer = typeof routes === "function" ? routes(key) : routes[key];
    const status = answer === undefined ? 404 : typeof answer === "number" ? answer : 200;
    const body = typeof answer === "object" ? JSON.stringify(answer) : "{}";
    return { ok: status === 200, status, text: async () => body };
  };
  const element = () => ({ appendChild() {}, setAttribute() {}, addEventListener() {}, style: {}, isConnected: true });
  const context = {
    window: { LATTICE_CONFIG: { nodeUrls: [NEXUS] }, location: { href: "https://lattice.build/explorer/" }, addEventListener() {} },
    document: { createElement: element, createTextNode: () => ({}), querySelector: () => null, body: { contains: () => true } },
    localStorage: { getItem: () => null, setItem() {}, removeItem() {} },
    fetch: async (url) => respond(url),
    AbortController, URL, URLSearchParams, setTimeout, clearTimeout, console, Node: class {},
  };
  vm.createContext(context);
  vm.runInContext(library, context);
  return { run: (expression) => vm.runInContext(expression, context), requests };
}

const nexusGenesis = { [`${NEXUS}/api/chain/genesis?chainPath=Nexus`]: { genesisHash: GENESIS } };

test("a child is found through its hosts even when its parent commits a block nobody serves", async () => {
  // Nexus's tip commits a testnet block that lost; nobody serves it. The
  // follower serves testnet.
  const net = explorer({
    ...nexusGenesis,
    [`${NEXUS}/api/chain/endpoints?chainPath=Nexus/testnet`]: { committedBlock: "bafy-lost", endpoints: [FOLLOWER] },
    [`${FOLLOWER}/api/chain/info?chainPath=Nexus/testnet`]: { chain: ["Nexus", "testnet"], height: "18000" },
    [`${FOLLOWER}/api/chain/genesis?chainPath=Nexus`]: { genesisHash: GENESIS },
  });
  const resolved = await net.run(`resolveChain("Nexus/testnet")`);
  assert.equal(resolved.ep, FOLLOWER);
  assert.ok(!net.requests.some((r) => r.includes("bafy-lost")), "the committed block is never required");
});

test("an endpoint on another network is not accepted", async () => {
  const net = explorer({
    ...nexusGenesis,
    [`${NEXUS}/api/chain/endpoints?chainPath=Nexus/testnet`]: { endpoints: [OTHER_NET] },
    [`${OTHER_NET}/api/chain/info?chainPath=Nexus/testnet`]: { chain: ["Nexus", "testnet"], height: "5" },
    [`${OTHER_NET}/api/chain/genesis?chainPath=Nexus`]: { genesisHash: "bafy-some-other-genesis" },
  });
  const resolved = await net.run(`resolveChain("Nexus/testnet")`);
  assert.equal(resolved.ep, undefined);
});

test("a rate-limited lookup is busy, not offline, and is not kept", async () => {
  let limited = true;
  const net = explorer((key) => {
    if (key === `${NEXUS}/api/chain/endpoints?chainPath=Nexus/testnet`) {
      return limited ? 429 : { endpoints: [FOLLOWER] };
    }
    return {
      ...nexusGenesis,
      [`${FOLLOWER}/api/chain/info?chainPath=Nexus/testnet`]: { chain: ["Nexus", "testnet"], height: "1" },
      [`${FOLLOWER}/api/chain/genesis?chainPath=Nexus`]: { genesisHash: GENESIS },
    }[key];
  });
  const busy = await net.run(`probeChain("Nexus/testnet")`);
  assert.equal(busy.status, "unknown");
  assert.equal(busy.busy, true);
  limited = false;
  const found = await net.run(`resolveChain("Nexus/testnet")`);
  assert.equal(found.ep, FOLLOWER, "the busy answer was not cached");
});

test("children come from the node's list of directory names", async () => {
  const net = explorer({ [`${NEXUS}/api/chain/children`]: { chainPath: ["Nexus"], directories: ["stoa", "testnet"] } });
  const kids = await net.run(`chainChildren()`);
  assert.deepEqual(JSON.parse(JSON.stringify(kids)), [{ directory: "stoa" }, { directory: "testnet" }]);
});

test("a node without the list falls back to its tip's children, and only on 404 or 403", async () => {
  const fallback = explorer({
    [`${NEXUS}/api/block/latest`]: { hash: "bafy-tip", height: "5" },
    [`${NEXUS}/api/block/bafy-tip/children`]: { children: [{ directory: "testnet", blockHash: "bafy-child" }] },
  });
  const kids = await fallback.run(`chainChildren()`);
  assert.deepEqual(JSON.parse(JSON.stringify(kids)), [{ directory: "testnet", blockHash: "bafy-child" }]);

  const limited = explorer({ [`${NEXUS}/api/chain/children`]: 429 });
  await assert.rejects(limited.run(`chainChildren()`));
  assert.ok(!limited.requests.some((r) => r.includes("/api/block/")), "a 429 does not fall back");
});
