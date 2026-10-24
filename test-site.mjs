import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const pages = ["index.html", "apps/index.html", "community/index.html", "download/index.html"];
const required = {
  "download/index.html": ["Download", "macOS 15", "Apple silicon", "Open Anyway", "Mining", "SHA256", "minisign", "WebView2", "Authenticode", "glibc 2.35", "WebKitGTK 4.1", "AppImage", "NSIS", "sha256sum Lattice_0.1.1_amd64.deb", "Get-FileHash -LiteralPath", "minisign.exe -Vm"],
  "index.html": ["Download", "Command-line setup", "Docs", "Explorer", "Community", "GitHub"],
  "apps/index.html": ["Apps with no backend", "apps.json", "Add yours", "not an audit"],
  "community/index.html": ["Run a node", "Launch a child chain", "Mine", "Understand the protocol", "Build software", "Help the community"],
};
const ownedGitHubLinks = new Set();
// The docs site is built into docs/dist (docs/README.md); its pages are
// checked when it has been built.
const docsRoot = `${process.cwd()}/docs/`;
const docsBuilt = existsSync(`${docsRoot}dist/index.html`);
const pagesLinkingDocs = new Set();

for (const page of pages) {
  const html = readFileSync(page, "utf8");
  assert.match(html, /<html lang="en">/, `${page} declares its language`);
  assert.match(html, /<meta name="viewport"/, `${page} is responsive`);
  assert.match(html, /<nav>/, `${page} has primary navigation`);
  assert.match(html, /aria-label="Lattice home"/, `${page} has an accessible home link`);
  for (const label of required[page]) assert.ok(html.includes(label), `${page} exposes ${label}`);

  for (const match of html.matchAll(/(?:href|src)="([^"#]+)"/g)) {
    const target = match[1];
    if (target.startsWith("https://github.com/adalinxx/")) { ownedGitHubLinks.add(target); continue; }
    if (/^(?:https?:|mailto:|data:)/.test(target) || target.includes("${")) continue;
    const resolved = new URL(target, new URL(`file://${process.cwd()}/${page}`));
    let path = decodeURIComponent(resolved.pathname);
    if (path.endsWith("/")) path += "index.html";
    if (path.startsWith(docsRoot)) {
      if (path === `${docsRoot}index.html`) pagesLinkingDocs.add(page);
      if (!docsBuilt) continue;
      path = `${docsRoot}dist/${path.slice(docsRoot.length)}`;
    }
    assert.ok(existsSync(path), `${page} local target exists: ${target}`);
  }
}

for (const page of pages) assert.ok(pagesLinkingDocs.has(page), `${page} links Docs to the docs site`);
assert.ok(ownedGitHubLinks.has("https://github.com/adalinxx/lattice-node/discussions"), "community forum is linked");
for (const policy of ["CONTRIBUTING.md", "CODE_OF_CONDUCT.md", "SECURITY.md"]) {
  assert.ok(ownedGitHubLinks.has(`https://github.com/adalinxx/lattice-node/blob/main/${policy}`), `${policy} has a canonical lattice-node link`);
}
for (const component of ["lattice-node", "nexus-wallet", "lattice-home", "lattice-sdk", "lattice-miner-gpu", "Lattice"]) {
  assert.ok(ownedGitHubLinks.has(`https://github.com/adalinxx/${component}`), `${component} is in the software directory`);
}

// apps.json is the one list of apps; the home page may feature some of them.
const apps = JSON.parse(readFileSync("apps.json", "utf8"));
assert.ok(Array.isArray(apps) && apps.length > 0, "apps.json lists apps");
const names = new Set();
const fields = new Set(["name", "summary", "url", "source", "chain", "network", "status", "built", "added"]);
for (const app of apps) {
  for (const field of Object.keys(app)) assert.ok(fields.has(field), `${app.name}: unknown field ${field}`);
  for (const field of ["name", "summary", "url", "chain", "network", "status", "added"])
    assert.ok(typeof app[field] === "string" && app[field], `${app.name}: ${field}`);
  assert.match(app.name, /^[A-Za-z0-9][A-Za-z0-9 .'-]{0,23}$/, `${app.name}: a short plain name`);
  assert.ok(!names.has(app.name.toLowerCase()), `${app.name} is listed once`); names.add(app.name.toLowerCase());
  assert.ok(app.summary.split(/\s+/).length <= 12 && app.summary.length <= 100, `${app.name}: summary is 12 words or fewer`);
  assert.ok(["experimental", "beta", "stable"].includes(app.status), `${app.name}: status`);
  for (const link of [app.url, app.source].filter(Boolean)) assert.match(link, /^https:\/\//, `${app.name}: https link`);
  assert.match(app.chain, /^Nexus(\/[A-Za-z0-9._-]+){1,5}$/, `${app.name}: chain path`);
  assert.ok(["testnet", "mainnet"].includes(app.network), `${app.name}: network`);
  assert.ok(Array.isArray(app.built) && app.built.length >= 1 && app.built.length <= 3 &&
    app.built.every((line) => typeof line === "string" && line && line.length <= 160), `${app.name}: one to three lines on how it's built`);
  assert.match(app.added, /^\d{4}-\d{2}-\d{2}$/, `${app.name}: added date`);
  assert.ok(new Date(`${app.added}T00:00:00Z`).toISOString().startsWith(app.added), `${app.name}: added is a real date`);
}
const home = readFileSync("index.html", "utf8");
const featured = home.slice(home.indexOf('<table class="apps">'), home.indexOf("</table>", home.indexOf('<table class="apps">')));
const rows = [...featured.matchAll(/<tr><td>([^<]+)<\/td><td>([^<]+)<\/td><td><code>([^<]+)<\/code><\/td><td class="go"><a href="([^"]+)">Open<\/a>(?: · <a href="([^"]+)">Source<\/a>)?/g)];
assert.equal(rows.length, [...featured.matchAll(/<tr><td>/g)].length, "every featured row has the checked shape");
for (const [, name, summary, chain, url, source] of rows) {
  const app = apps.find((a) => a.name === name);
  assert.ok(app, `home features ${name}, which apps.json lists`);
  assert.deepEqual([summary, chain, url, source], [app.summary, app.chain, app.url, app.source], `home row for ${name} matches apps.json`);
}

console.log("site checks passed");

// Published fixtures are deliberately independent of the current release config.
const { releases, isAvailable } = await import("./download/release.mjs");
const { renderRelease, renderCatalog } = await import("./download/download.mjs");
const download = readFileSync("download/index.html", "utf8");
const ids = ["download-link", "checksums-link", "signature-link", "public-key-link", "release-status", "verification-links", "verification-status", "requirements", "platform-choice"];
function page(prefix) {
  const elements = Object.fromEntries(ids.map(id => [prefix + id, {
    hidden: true, removeAttribute(name) { delete this[name]; },
  }]));
  return { elements, getElementById: id => elements[id] };
}
for (const [platform, repository, format] of [
  ["mac", "lattice-desktop", "zip"],
  ["linux", "lattice-desktop-linux", "deb"],
  ["linux", "lattice-desktop-linux", "AppImage"],
  ["windows", "lattice-desktop-windows", "exe"],
]) {
  const prefix = platform === "mac" ? "" : `${platform}-`;
  const base = `https://github.com/adalinxx/${repository}/releases/download/test/`;
  const ready = { platform, architecture: "test architecture", requirements: "test OS", format,
    version: "0.1.0", source: "a".repeat(40), sha256: "b".repeat(64), published: true,
    filename: `Lattice.${format}`, artifact: base + `Lattice.${format}`, checksums: base + "SHA256SUMS",
    signature: base + "SHA256SUMS.minisig", publicKey: base + "lattice-releases.pub" };
  const unavailable = { ...ready, published: false };
  assert.equal(isAvailable(ready), true, `${platform}/${format} published fixture`);
  assert.equal(isAvailable(unavailable), false, `${platform}/${format} unpublished fixture`);
  const invalid = [unavailable, null, { ...ready, platform: "other" }, { ...ready, format: "html" },
    { ...ready, signature: base.replace("/test/", "/other/") + "SHA256SUMS.minisig" },
    { ...ready, artifact: "https://github.com/adalinxx/lattice-desktop/releases" }];
  for (const field of ["artifact", "checksums", "signature", "publicKey"]) {
    for (const value of [undefined, null, "", "javascript:alert(1)", "https://example.com/file", "http://github.com/file"])
      invalid.push({ ...ready, [field]: value });
  }
  for (const field of ["filename", "sha256", "source", "version", "architecture", "requirements"]) {
    for (const value of [undefined, null, ""])
      invalid.push({ ...ready, [field]: value });
  }
  invalid.push({ ...ready, sha256: "g".repeat(64) });
  for (const data of invalid) {
    assert.equal(isAvailable(data), false, `${platform}: invalid data is unavailable`);
    const doc = page(prefix);
    renderRelease(ready, doc, prefix); // Invalid metadata must also clear previously rendered links.
    renderRelease(data, doc, prefix);
    assert.equal(doc.elements[prefix + "download-link"].hidden, true);
    assert.equal(doc.elements[prefix + "verification-links"].hidden, true);
    for (const id of ["download-link", "checksums-link", "signature-link", "public-key-link"])
      assert.equal(doc.elements[prefix + id].href, undefined);
  }
  const doc = page(prefix);
  renderRelease(ready, doc, prefix);
  assert.equal(doc.elements[prefix + "download-link"].hidden, false);
  assert.equal(doc.elements[prefix + "download-link"].href, ready.artifact);
  assert.equal(doc.elements[prefix + "verification-links"].hidden, false);
  assert.equal(doc.elements[prefix + "public-key-link"].href, ready.publicKey);
  assert.ok(!doc.elements[prefix + "platform-choice"].textContent.includes("not available"));
}
for (const [platform, release] of Object.entries(releases)) {
  assert.equal(release.platform, platform === "linux-appimage" ? "linux" : platform, "release belongs to its platform");
  assert.equal(isAvailable(release), release.published, `${platform} configured state is valid`);
  const prefix = platform === "mac" ? "" : `${platform}-`;
  const doc = page(prefix);
  for (const id of ids.filter(id => platform !== "linux-appimage" || id !== "platform-choice")) assert.equal([...download.matchAll(new RegExp(`id="${prefix}${id}"`, "g"))].length, 1, `${prefix}${id} exists once in HTML`);
  renderRelease(release, doc, prefix);
  assert.equal(doc.elements[prefix + "download-link"].hidden, !release.published);
  assert.match(download, new RegExp(`id="${prefix}download-link"[^>]*hidden`));
  assert.doesNotMatch(download, new RegExp(`id="${prefix}download-link"[^>]*href=`));
  assert.ok(download.includes(`href="#${platform}"`));
  assert.ok(download.includes(`id="${platform}"`));
}
for (const data of Object.values(releases)) {
  assert.equal(data.version, "0.1.1");
  assert.equal(typeof data.published, "boolean", "publication state is explicit");
  assert.equal(isAvailable({ ...data, published: true }), true, "candidate URL structure is valid");
  assert.ok(Number.isSafeInteger(data.bytes) && data.bytes > 0);
  assert.ok(download.includes(data.filename) || data.platform === "mac");
  assert.equal(data.publicKey, "https://github.com/adalinxx/lattice-desktop/releases/download/v0.1.0/lattice-releases.pub");
}
assert.match(readFileSync("index.html", "utf8"), /href="\.\/download\/">Download Lattice Desktop/);
const elements = Object.assign({}, ...Object.keys(releases).map(key => page(key === "mac" ? "" : `${key}-`).elements));
delete elements["linux-appimage-platform-choice"];
const catalogPage = { getElementById: id => elements[id] };
renderCatalog(releases, catalogPage);
assert.equal(elements["download-link"].hidden, !releases.mac.published);
for (const [key, data] of Object.entries(releases)) {
  const prefix = key === "mac" ? "" : `${key}-`;
  assert.equal(elements[`${prefix}download-link`].hidden, !data.published);
  assert.equal(elements[`${prefix}download-link`].href, data.published ? data.artifact : undefined);
}
const publishedCatalog = Object.fromEntries(Object.entries(releases).map(([key, data]) => [key, { ...data, published: true }]));
renderCatalog(publishedCatalog, catalogPage);
for (const [key, data] of Object.entries(publishedCatalog)) {
  const prefix = key === "mac" ? "" : `${key}-`;
  assert.equal(elements[prefix + "download-link"].href, data.artifact);
  assert.equal(elements[prefix + "download-link"].hidden, false);
}
const allUnavailable = Object.fromEntries(Object.entries(releases).map(([key, data]) => [key, { ...data, published: false }]));
renderCatalog(allUnavailable, catalogPage);
for (const key of Object.keys(releases)) {
  const prefix = key === "mac" ? "" : `${key}-`;
  assert.equal(elements[prefix + "download-link"].href, undefined);
  assert.equal(elements[prefix + "download-link"].hidden, true);
}
// Explicit mixed-publication fixture: independent of production publication flags.
const unavailableCatalog = Object.fromEntries(Object.entries(releases).map(([key, data]) =>
  [key, key === "mac" ? data : { ...data, published: false }]));
const appImage = releases["linux-appimage"];
const appImageBase = "https://github.com/adalinxx/lattice-desktop-linux/releases/download/test/";
const appImageReady = { ...appImage, published: true, artifact: appImageBase + appImage.filename,
  checksums: appImageBase + "SHA256SUMS", signature: appImageBase + "SHA256SUMS.minisig", publicKey: appImageBase + "lattice-releases.pub" };
renderCatalog({ ...unavailableCatalog, "linux-appimage": appImageReady }, catalogPage);
assert.equal(elements["linux-download-link"].hidden, true);
assert.equal(elements["linux-appimage-download-link"].hidden, false);
assert.equal(elements["linux-platform-choice"].textContent, "Linux");
assert.equal(elements["download-link"].href, releases.mac.published ? releases.mac.artifact : undefined);
renderCatalog(unavailableCatalog, catalogPage);
assert.equal(elements["linux-appimage-download-link"].href, undefined);
assert.equal(elements["linux-platform-choice"].textContent, "Linux · not available yet");
console.log("platform release validation and published/unpublished rendering checks passed");
