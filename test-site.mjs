import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const pages = ["index.html", "community/index.html", "download/index.html"];
const required = {
  "download/index.html": ["Download", "macOS 15", "Apple silicon", "Open Anyway", "Mining", "SHA256", "minisign", "WebView2", "Authenticode", "glibc 2.35", "WebKitGTK 4.1", "AppImage", "NSIS"],
  "index.html": ["Download", "Command-line setup", "Docs", "Explorer", "Community", "GitHub"],
  "community/index.html": ["Run a node", "Launch a child chain", "Mine", "Understand the protocol", "Build software", "Help the community"],
};
const ownedGitHubLinks = new Set();

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
    assert.ok(existsSync(path), `${page} local target exists: ${target}`);
  }
}

assert.ok(ownedGitHubLinks.has("https://github.com/adalinxx/lattice-node/tree/main/docs"), "Docs has a canonical project destination");
assert.ok(ownedGitHubLinks.has("https://github.com/adalinxx/lattice-node/discussions"), "community forum is linked");
for (const policy of ["CONTRIBUTING.md", "CODE_OF_CONDUCT.md", "SECURITY.md"]) {
  assert.ok(ownedGitHubLinks.has(`https://github.com/adalinxx/lattice-node/blob/main/${policy}`), `${policy} has a canonical lattice-node link`);
}
for (const component of ["lattice-node", "nexus-wallet", "lattice-home", "lattice-sdk", "lattice-miner-gpu", "Lattice"]) {
  assert.ok(ownedGitHubLinks.has(`https://github.com/adalinxx/${component}`), `${component} is in the software directory`);
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
assert.equal(releases.mac.artifact, "https://github.com/adalinxx/lattice-desktop/releases/download/v0.1.0/Lattice-0.1.0-macos-arm64.zip", "preserve the live Mac ZIP");
assert.match(readFileSync("index.html", "utf8"), /href="\.\/download\/">Download Lattice Desktop/);
const elements = Object.assign({}, ...Object.keys(releases).map(key => page(key === "mac" ? "" : `${key}-`).elements));
delete elements["linux-appimage-platform-choice"];
const catalogPage = { getElementById: id => elements[id] };
renderCatalog(releases, catalogPage);
assert.equal(elements["download-link"].hidden, false);
for (const key of ["linux", "linux-appimage", "windows"]) {
  assert.equal(elements[`${key}-download-link`].hidden, true);
  assert.equal(elements[`${key}-download-link`].href, undefined);
}
const appImage = releases["linux-appimage"];
const appImageBase = "https://github.com/adalinxx/lattice-desktop-linux/releases/download/test/";
const appImageReady = { ...appImage, published: true, artifact: appImageBase + appImage.filename,
  checksums: appImageBase + "SHA256SUMS", signature: appImageBase + "SHA256SUMS.minisig", publicKey: appImageBase + "lattice-releases.pub" };
renderCatalog({ ...releases, "linux-appimage": appImageReady }, catalogPage);
assert.equal(elements["linux-download-link"].hidden, true);
assert.equal(elements["linux-appimage-download-link"].hidden, false);
assert.equal(elements["linux-platform-choice"].textContent, "Linux");
assert.equal(elements["download-link"].href, releases.mac.artifact);
renderCatalog(releases, catalogPage);
assert.equal(elements["linux-appimage-download-link"].href, undefined);
assert.equal(elements["linux-platform-choice"].textContent, "Linux · not available yet");
console.log("platform release validation and published/unpublished rendering checks passed");
