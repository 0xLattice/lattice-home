// Set published only after all exact public URLs and downloaded bytes are verified.
export const release = Object.freeze({
  platform: "mac",
  architecture: "Apple silicon",
  requirements: "macOS 15 or later",
  format: "zip",
  filename: "Lattice-0.1.1-macos-arm64.zip",
  version: "0.1.1",
  bytes: 41137495,
  source: "43b90ef948adcb32dc2b01d279a228d9596fc048",
  sha256: "e22193d49f7368d15253c2d442dd8c05885ac73f9cf57092085e02001e67fe40",
  published: false,
  artifact: "https://github.com/adalinxx/lattice-desktop/releases/download/v0.1.1/Lattice-0.1.1-macos-arm64.zip",
  checksums: "https://github.com/adalinxx/lattice-desktop/releases/download/v0.1.1/SHA256SUMS",
  signature: "https://github.com/adalinxx/lattice-desktop/releases/download/v0.1.1/SHA256SUMS.minisig",
  publicKey: "https://github.com/adalinxx/lattice-desktop/releases/download/v0.1.0/lattice-releases.pub",
});

// source identifies the tested build revision, not the later release merge commit.
// Draft v0.1.1: planned URLs only; public assets and signatures await verification.
// Bundled node source: a09d22335117d04ac6e05f4be771dafd7ed4cdc1
export const releases = Object.freeze({
  mac: release,
  linux: Object.freeze({ platform: "linux", published: false, version: "0.1.1",
    source: "3aabc216ccbb654792d814662cd4a5d991f7e34d", architecture: "amd64 (x86-64)",
    requirements: "Debian/Ubuntu with glibc 2.35 or later; WebKitGTK 4.1, GTK 3 and SQLite", format: "deb",
    filename: "Lattice_0.1.1_amd64.deb", bytes: 137233782,
    artifact: "https://github.com/adalinxx/lattice-desktop-linux/releases/download/v0.1.1/Lattice_0.1.1_amd64.deb",
    sha256: "44e6c90e6bf7cea23a9e03a98ed5c4f8139df1d7801c4ad6d5d868d8cdc1c664",
    checksums: "https://github.com/adalinxx/lattice-desktop-linux/releases/download/v0.1.1/SHA256SUMS",
    signature: "https://github.com/adalinxx/lattice-desktop-linux/releases/download/v0.1.1/SHA256SUMS.minisig",
    publicKey: "https://github.com/adalinxx/lattice-desktop/releases/download/v0.1.0/lattice-releases.pub" }),
  "linux-appimage": Object.freeze({ platform: "linux", published: false, version: "0.1.1",
    source: "3aabc216ccbb654792d814662cd4a5d991f7e34d", architecture: "amd64 (x86-64)",
    requirements: "glibc 2.35 or later; FUSE mounting or extraction", format: "AppImage",
    filename: "Lattice_0.1.1_amd64.AppImage", bytes: 200989176,
    artifact: "https://github.com/adalinxx/lattice-desktop-linux/releases/download/v0.1.1/Lattice_0.1.1_amd64.AppImage",
    sha256: "5d02dc81d31c5bd0960670ca8a62e63a4b43fbb77479758079e71ec2ad8c6204",
    checksums: "https://github.com/adalinxx/lattice-desktop-linux/releases/download/v0.1.1/SHA256SUMS",
    signature: "https://github.com/adalinxx/lattice-desktop-linux/releases/download/v0.1.1/SHA256SUMS.minisig",
    publicKey: "https://github.com/adalinxx/lattice-desktop/releases/download/v0.1.0/lattice-releases.pub" }),
  windows: Object.freeze({ platform: "windows", published: false, version: "0.1.1",
    source: "de5671db2d453ead356b4ac121ac4e11f6415f1d", architecture: "x64",
    requirements: "WebView2 and an initialized default WSL distribution", format: "exe",
    filename: "Lattice_0.1.1_x64-setup.exe", bytes: 86689961,
    artifact: "https://github.com/adalinxx/lattice-desktop-windows/releases/download/v0.1.1/Lattice_0.1.1_x64-setup.exe",
    sha256: "c33bbf7f8a627be8a5195af4556945afc78096898ee028b7c85e89dadc5574c9",
    checksums: "https://github.com/adalinxx/lattice-desktop-windows/releases/download/v0.1.1/SHA256SUMS",
    signature: "https://github.com/adalinxx/lattice-desktop-windows/releases/download/v0.1.1/SHA256SUMS.minisig",
    publicKey: "https://github.com/adalinxx/lattice-desktop/releases/download/v0.1.0/lattice-releases.pub" }),
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
    const prefix = `/adalinxx/${repository}/releases/download/`;
    return assets.every(url => valid(url) && url.hostname === "github.com" &&
      url.pathname.startsWith(prefix) && /^[^/]+\/[^/]+$/.test(url.pathname.slice(prefix.length))) &&
      assets.every(url => url.pathname.split('/').slice(0, 6).join('/') === assets[0].pathname.split('/').slice(0, 6).join('/')) &&
      assets[0].pathname.endsWith(`/${data.filename}`) && data.filename.endsWith(`.${data.format}`) && /\/SHA256SUMS$/.test(assets[1].pathname) &&
      /\/SHA256SUMS\.minisig$/.test(assets[2].pathname) && valid(key) &&
      ["github.com", "raw.githubusercontent.com"].includes(key.hostname) &&
      [repository, "lattice-desktop"].some(repo => key.pathname.startsWith(`/adalinxx/${repo}/`));
  } catch { return false; }
}
