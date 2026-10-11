// Set published only after all exact public URLs and downloaded bytes are verified.
export const release = Object.freeze({
  platform: "mac",
  architecture: "Apple silicon",
  requirements: "macOS 15 or later",
  format: "zip",
  filename: "Lattice-0.1.0-macos-arm64.zip",
  version: "0.1.0",
  source: "578dad10c7ca7a95e06187534fc9e803d54144b2",
  sha256: "62fccf7c5c0fee158fd99ac615a036cd4082aa7549b34926a16ee365033a7993",
  published: true,
  artifact: "https://github.com/adalinxx/lattice-desktop/releases/download/v0.1.0/Lattice-0.1.0-macos-arm64.zip",
  checksums: "https://github.com/adalinxx/lattice-desktop/releases/download/v0.1.0/SHA256SUMS",
  signature: "https://github.com/adalinxx/lattice-desktop/releases/download/v0.1.0/SHA256SUMS.minisig",
  publicKey: "https://github.com/adalinxx/lattice-desktop/releases/download/v0.1.0/lattice-releases.pub",
});

// Linux/Windows URLs are reserved release destinations, not yet published.
// Keep published false until signatures and public downloads are verified.
export const releases = Object.freeze({
  mac: release,
  linux: Object.freeze({ platform: "linux", published: false, version: "0.1.0",
    source: "62d1ed6888ab38752972659259fec9480fa5d800", architecture: "amd64 (x86-64)",
    requirements: "Debian/Ubuntu with glibc 2.35 or later; WebKitGTK 4.1, GTK 3 and SQLite", format: "deb",
    filename: "Lattice_0.1.0_amd64.deb", bytes: 137233768,
    artifact: "https://github.com/adalinxx/lattice-desktop-linux/releases/download/v0.1.0/Lattice_0.1.0_amd64.deb",
    sha256: "24451008ab68bd8426e0951b9464019175d5fc930fa98656ccb38ae72999b809",
    checksums: "https://github.com/adalinxx/lattice-desktop-linux/releases/download/v0.1.0/SHA256SUMS",
    signature: "https://github.com/adalinxx/lattice-desktop-linux/releases/download/v0.1.0/SHA256SUMS.minisig",
    publicKey: "https://github.com/adalinxx/lattice-desktop/releases/download/v0.1.0/lattice-releases.pub" }),
  "linux-appimage": Object.freeze({ platform: "linux", published: false, version: "0.1.0",
    source: "62d1ed6888ab38752972659259fec9480fa5d800", architecture: "amd64 (x86-64)",
    requirements: "glibc 2.35 or later; FUSE mounting or extraction", format: "AppImage",
    filename: "Lattice_0.1.0_amd64.AppImage", bytes: 201021944,
    artifact: "https://github.com/adalinxx/lattice-desktop-linux/releases/download/v0.1.0/Lattice_0.1.0_amd64.AppImage",
    sha256: "54305d0d35b3378fbc48df725de076e529065dea7dc8363b6ca76134c18ea4b3",
    checksums: "https://github.com/adalinxx/lattice-desktop-linux/releases/download/v0.1.0/SHA256SUMS",
    signature: "https://github.com/adalinxx/lattice-desktop-linux/releases/download/v0.1.0/SHA256SUMS.minisig",
    publicKey: "https://github.com/adalinxx/lattice-desktop/releases/download/v0.1.0/lattice-releases.pub" }),
  windows: Object.freeze({ platform: "windows", published: false, version: "0.1.0",
    source: "0b6d3fa9152be1b99a9a0947ef0d6583bf15d3a2", architecture: "x64",
    requirements: "WebView2 and an initialized default WSL distribution", format: "exe",
    filename: "Lattice_0.1.0_x64-setup.exe", bytes: 86694054,
    artifact: "https://github.com/adalinxx/lattice-desktop-windows/releases/download/v0.1.0/Lattice_0.1.0_x64-setup.exe",
    sha256: "0cdf6c3d313c1bba6fabe1dda1de58d22a118ae235cd0a550858e32956201b05",
    checksums: "https://github.com/adalinxx/lattice-desktop-windows/releases/download/v0.1.0/SHA256SUMS",
    signature: "https://github.com/adalinxx/lattice-desktop-windows/releases/download/v0.1.0/SHA256SUMS.minisig",
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
