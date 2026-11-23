import { sellView } from "./views/transfer.ts";
import { buyView } from "./views/buy.ts";
import { childChainFromQuery } from "./lib/intent.ts";

const app = document.querySelector<HTMLDivElement>("#app")!;
const homeUrl = ["127.0.0.1", "localhost"].includes(location.hostname)
  ? "http://127.0.0.1:5174/"
  : "../";

app.innerHTML = `
  <header class="topbar">
    <a class="brand" href="${homeUrl}" aria-label="Lattice home">
      <svg class="mark" viewBox="0 0 48 48" width="24" height="24" aria-hidden="true"><g class="node"><circle cx="8" cy="8" r="2.4"/><circle cx="24" cy="8" r="2.4"/><circle cx="40" cy="8" r="2.4"/><circle cx="8" cy="24" r="2.4"/><circle cx="40" cy="24" r="2.4"/><circle cx="8" cy="40" r="2.4"/><circle cx="24" cy="40" r="2.4"/><circle cx="40" cy="40" r="2.4"/></g><circle class="proof" cx="24" cy="24" r="5"/></svg>
      <span class="wordmark">Lattice</span><span class="brand-sub">Token</span>
    </a>
  </header>
  <main id="view"></main>
  <footer>
    <span>Lattice Token</span>
    <span>Stages orders. Wallets complete settlement.</span>
  </footer>
`;

const view = document.querySelector<HTMLElement>("#view")!;
function selectedChildPath(): string {
  const parts = childChainFromQuery(new URLSearchParams(location.search).get("chain"));
  return parts ? parts.join("/") : "Nexus/Payments";
}

function route(): void {
  const parts = location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
  if (parts[1] === "sell") sellView(view, selectedChildPath());
  else buyView(view, selectedChildPath());
  window.scrollTo(0, 0);
}

window.addEventListener("hashchange", route);
route();
