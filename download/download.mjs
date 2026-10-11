import { releases, isAvailable, platformNames } from "./release.mjs";

export function renderRelease(release, document, prefix = "") {
  const platform = platformNames[release?.platform] || "This platform";
  const element = id => document.getElementById(prefix + id);
  // Clear stale links as well as keeping initial unpublished markup unavailable.
  for (const id of ["download-link", "checksums-link", "signature-link", "public-key-link"]) {
    element(id).removeAttribute("href");
  }
  element("download-link").hidden = true;
  element("verification-links").hidden = true;
  element("release-status").textContent = "The download is not available yet.";
  element("verification-status").textContent = "Verification files are not available yet.";
  const metadata = [release?.version && `Version ${release.version}`, release?.architecture, release?.requirements];
  element("requirements").textContent = metadata.every(value => typeof value === "string" && value.trim())
    ? metadata.join(" · ")
    : "Release version, architecture, and supported OS versions will be listed with the download.";
  element("platform-choice").textContent = `${platform} · not available yet`;
  if (!isAvailable(release)) return;
  for (const [id, value] of Object.entries({
    "download-link": release.artifact,
    "checksums-link": release.checksums,
    "signature-link": release.signature,
    "public-key-link": release.publicKey,
  })) element(id).href = value;
  element("platform-choice").textContent = platform;
  element("release-status").textContent = `Lattice Desktop ${release.version} is available for ${platform}.`;
  element("requirements").textContent = `Version ${release.version} · ${release.architecture} · ${release.requirements}`;
  element("download-link").textContent = `Download for ${platform} — ${release.format === "zip" ? "ZIP" : release.format}`;
  element("download-link").hidden = false;
  element("verification-links").hidden = false;
  element("verification-status").textContent = `Download SHA256: ${release.sha256}`;
}

if (typeof document !== "undefined") {
  for (const [platform, release] of Object.entries(releases)) {
    renderRelease(release, document, platform === "mac" ? "" : `${platform}-`);
  }
}
