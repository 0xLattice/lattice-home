import { release, isAvailable } from "./release.mjs";

if (isAvailable(release)) {
  for (const [id, value] of Object.entries({
    "download-link": release.zip,
    "checksums-link": release.checksums,
    "signature-link": release.signature,
    "public-key-link": release.publicKey,
  })) document.getElementById(id).href = value;
  document.getElementById("release-status").textContent = `Lattice Desktop ${release.version} is available for Mac with Apple silicon.`;
  document.getElementById("download-link").hidden = false;
  document.getElementById("verification-links").hidden = false;
  document.getElementById("verification-status").textContent = `ZIP SHA256: ${release.sha256}`;
}
