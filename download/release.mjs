// Set published only after all exact public URLs and downloaded bytes are verified.
export const release = Object.freeze({
  platform: "mac",
  architecture: "Apple silicon",
  requirements: "macOS 15 or later",
  format: "zip",
  filename: "Lattice-0.1.1-macos-arm64.zip",
  version: "0.1.1",
  bytes: 41248525,
  source: "fecb3e2e7bf6d387950e48209f28d2c71402356a",
  sha256: "3dc4c20b3079175d646f94a24ecff1f75ac5d8232f453afd07b2e9a0fed2faf5",
  published: true,
  artifact: "https://github.com/0xLattice/lattice-desktop/releases/download/v0.1.1/Lattice-0.1.1-macos-arm64.zip",
  checksums: "https://github.com/0xLattice/lattice-desktop/releases/download/v0.1.1/SHA256SUMS",
  signature: "https://github.com/0xLattice/lattice-desktop/releases/download/v0.1.1/SHA256SUMS.minisig",
  publicKey: "https://github.com/0xLattice/lattice-desktop/releases/download/v0.1.0/lattice-releases.pub",
});

// source identifies the tested build revision, not the later release merge commit.
// v0.1.1 public package bytes, manifests and signatures verified before enabling.
// Bundled node source: fd3684842e8091856b372d2fd56806a3551ba6a4
// Bundled wallet source: d1d6b9531994884a98a1abc0557945009c87915e
export const releases = Object.freeze({
  mac: release,
  linux: Object.freeze({ platform: "linux", published: true, version: "0.1.1",
    source: "a3ef6c2f04d227fc1030ba8671812d6b25848fa6", architecture: "amd64 (x86-64)",
    requirements: "Debian/Ubuntu with glibc 2.35 or later; WebKitGTK 4.1, GTK 3 and SQLite", format: "deb",
    filename: "Lattice_0.1.1_amd64.deb", bytes: 137340426,
    artifact: "https://github.com/0xLattice/lattice-desktop-linux/releases/download/v0.1.1/Lattice_0.1.1_amd64.deb",
    sha256: "55a843e725e09b01d61eff3001675dc24080e8ea03d9fa9660ad893e28a8ef12",
    checksums: "https://github.com/0xLattice/lattice-desktop-linux/releases/download/v0.1.1/SHA256SUMS",
    signature: "https://github.com/0xLattice/lattice-desktop-linux/releases/download/v0.1.1/SHA256SUMS.minisig",
    publicKey: "https://github.com/0xLattice/lattice-desktop/releases/download/v0.1.0/lattice-releases.pub" }),
  "linux-appimage": Object.freeze({ platform: "linux", published: true, version: "0.1.1",
    source: "a3ef6c2f04d227fc1030ba8671812d6b25848fa6", architecture: "amd64 (x86-64)",
    requirements: "glibc 2.35 or later; FUSE mounting or extraction", format: "AppImage",
    filename: "Lattice_0.1.1_amd64.AppImage", bytes: 201116152,
    artifact: "https://github.com/0xLattice/lattice-desktop-linux/releases/download/v0.1.1/Lattice_0.1.1_amd64.AppImage",
    sha256: "2fa1f88a1f44a336f778c01aef3dc5c381ebff1e55c515530d5079e52105c37a",
    checksums: "https://github.com/0xLattice/lattice-desktop-linux/releases/download/v0.1.1/SHA256SUMS",
    signature: "https://github.com/0xLattice/lattice-desktop-linux/releases/download/v0.1.1/SHA256SUMS.minisig",
    publicKey: "https://github.com/0xLattice/lattice-desktop/releases/download/v0.1.0/lattice-releases.pub" }),
  windows: Object.freeze({ platform: "windows", published: true, version: "0.1.1",
    source: "865d9ed977f240b3246cd563e486041418d00151", architecture: "x64",
    requirements: "WebView2 and an initialized default WSL distribution", format: "exe",
    filename: "Lattice_0.1.1_x64-setup.exe", bytes: 86771402,
    artifact: "https://github.com/0xLattice/lattice-desktop-windows/releases/download/v0.1.1/Lattice_0.1.1_x64-setup.exe",
    sha256: "0da0a32e61714990d316f8572ec98cf5c8dccce53860a9e16f3ba8de6cad28f1",
    checksums: "https://github.com/0xLattice/lattice-desktop-windows/releases/download/v0.1.1/SHA256SUMS",
    signature: "https://github.com/0xLattice/lattice-desktop-windows/releases/download/v0.1.1/SHA256SUMS.minisig",
    publicKey: "https://github.com/0xLattice/lattice-desktop/releases/download/v0.1.0/lattice-releases.pub" }),
});

const repositories = {
  mac: "lattice-desktop",
  linux: "lattice-desktop-linux",
  windows: "lattice-desktop-windows",
};
const formats = { mac: ["zip"], linux: ["deb", "AppImage"], windows: ["exe"] };
export const platformNames = { mac: "Mac", linux: "Linux", windows: "Windows" };

export function isAvailable(data) {
  if (!data || data.published !== true || !/^[a-f0-9]{64}$/.test(data.sha256) ||
      !/^[a-f0-9]{40}$/.test(data.source) || !/^[0-9]+\.[0-9]+\.[0-9]+$/.test(data.version) ||
      ![data.architecture, data.requirements].every(value => typeof value === "string" && value.trim()) ||
      !/^[A-Za-z0-9_.-]+$/.test(data.filename || "") ||
      !Object.hasOwn(repositories, data.platform) || !formats[data.platform].includes(data.format)) return false;
  try {
    const repository = repositories[data.platform];
    const assets = [data.artifact, data.checksums, data.signature].map(value => new URL(value));
    const key = new URL(data.publicKey);
    const valid = url => url.protocol === "https:" && !url.username && !url.password && !url.port && !url.search && !url.hash;
    const prefix = `/0xLattice/${repository}/releases/download/`;
    return assets.every(url => valid(url) && url.hostname === "github.com" &&
      url.pathname.startsWith(prefix) && /^[^/]+\/[^/]+$/.test(url.pathname.slice(prefix.length))) &&
      assets.every(url => url.pathname.split('/').slice(0, 6).join('/') === assets[0].pathname.split('/').slice(0, 6).join('/')) &&
      assets[0].pathname.endsWith(`/${data.filename}`) && data.filename.endsWith(`.${data.format}`) && /\/SHA256SUMS$/.test(assets[1].pathname) &&
      /\/SHA256SUMS\.minisig$/.test(assets[2].pathname) && valid(key) &&
      ["github.com", "raw.githubusercontent.com"].includes(key.hostname) &&
      [repository, "lattice-desktop"].some(repo => key.pathname.startsWith(`/0xLattice/${repo}/`));
  } catch { return false; }
}
