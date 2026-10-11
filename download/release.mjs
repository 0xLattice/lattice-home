// Set published only after all exact public URLs and downloaded bytes are verified.
export const release = Object.freeze({
  version: "0.1.0",
  source: "578dad10c7ca7a95e06187534fc9e803d54144b2",
  sha256: "62fccf7c5c0fee158fd99ac615a036cd4082aa7549b34926a16ee365033a7993",
  published: true,
  zip: "https://github.com/adalinxx/lattice-desktop/releases/download/v0.1.0/Lattice-0.1.0-macos-arm64.zip",
  checksums: "https://github.com/adalinxx/lattice-desktop/releases/download/v0.1.0/SHA256SUMS",
  signature: "https://github.com/adalinxx/lattice-desktop/releases/download/v0.1.0/SHA256SUMS.minisig",
  publicKey: "https://github.com/adalinxx/lattice-desktop/releases/download/v0.1.0/lattice-releases.pub",
});

export function isAvailable(data) {
  if (data.published !== true || !/^[a-f0-9]{64}$/.test(data.sha256)) return false;
  try {
    const assets = [data.zip, data.checksums, data.signature].map(value => new URL(value));
    const key = new URL(data.publicKey);
    const valid = url => url.protocol === "https:" && !url.username && !url.password && !url.search && !url.hash;
    return assets.every(url => valid(url) && url.hostname === "github.com" &&
      /^\/adalinxx\/lattice-desktop\/releases\/download\/[^/]+\/[^/]+$/.test(url.pathname)) &&
      assets.every(url => url.pathname.split('/').slice(0, 6).join('/') === assets[0].pathname.split('/').slice(0, 6).join('/')) &&
      /\.zip$/.test(assets[0].pathname) && /\/SHA256SUMS$/.test(assets[1].pathname) &&
      /\/SHA256SUMS\.minisig$/.test(assets[2].pathname) && valid(key) &&
      ["github.com", "raw.githubusercontent.com"].includes(key.hostname) &&
      key.pathname.startsWith("/adalinxx/lattice-desktop/");
  } catch { return false; }
}
