// Fails if any page in dist/ links to a /docs/ path that was not built, or to
// an anchor missing from the target page.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const dist = new URL("./dist/", import.meta.url).pathname;
const pages = readdirSync(dist, { recursive: true }).filter((f) => f.endsWith(".html"));
const ids = new Map();
const idsOf = (file) => {
  if (!ids.has(file)) ids.set(file, new Set([...readFileSync(file, "utf8").matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
  return ids.get(file);
};

const broken = [];
for (const page of pages) {
  const html = readFileSync(join(dist, page), "utf8");
  for (const [, href] of html.matchAll(/href="(\/docs\/[^"]*)"/g)) {
    const [path, hash] = href.slice("/docs/".length).split("#");
    if (/\.(?:svg|css|js|xml|png|ico)$/.test(path) || path.startsWith("_astro/") || path.startsWith("pagefind/")) continue;
    let file = join(dist, path);
    if (existsSync(file) && statSync(file).isDirectory()) file = join(file, "index.html");
    if (!existsSync(file)) broken.push(`${page}: ${href} (no page)`);
    else if (hash && !idsOf(file).has(decodeURIComponent(hash))) broken.push(`${page}: ${href} (no anchor)`);
  }
}
if (broken.length) {
  console.error(broken.join("\n"));
  process.exit(1);
}
console.log(`links: ${pages.length} pages, no broken /docs/ links`);
