// Set published only after all exact public URLs and downloaded bytes are verified.
export const release = Object.freeze({
  platform: "mac",
  architecture: "Apple silicon",
  requirements: "macOS 15 or later",
  format: "zip",
  version: "0.1.0",
  source: "578dad10c7ca7a95e06187534fc9e803d54144b2",
  sha256: "62fccf7c5c0fee158fd99ac615a036cd4082aa7549b34926a16ee365033a7993",
  published: true,
  artifact: "https://github.com/adalinxx/lattice-desktop/releases/download/v0.1.0/Lattice-0.1.0-macos-arm64.zip",
  checksums: "https://github.com/adalinxx/lattice-desktop/releases/download/v0.1.0/SHA256SUMS",
  signature: "https://github.com/adalinxx/lattice-desktop/releases/download/v0.1.0/SHA256SUMS.minisig",
  publicKey: "https://github.com/adalinxx/lattice-desktop/releases/download/v0.1.0/lattice-releases.pub",
});

// Unpublished platforms intentionally contain no guessed artifacts or requirements.
export const releases = Object.freeze({
  mac: release,
  linux: Object.freeze({ platform: "linux", published: false, version: null,
    source: null, architecture: null, requirements: null, format: null,
    artifact: null, sha256: null, checksums: null, signature: null, publicKey: null }),
  windows: Object.freeze({ platform: "windows", published: false, version: null,
    source: null, architecture: null, requirements: null, format: null,
    artifact: null, sha256: null, checksums: null, signature: null, publicKey: null }),
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
      assets[0].pathname.endsWith(`.${data.format}`) && /\/SHA256SUMS$/.test(assets[1].pathname) &&
      /\/SHA256SUMS\.minisig$/.test(assets[2].pathname) && valid(key) &&
      ["github.com", "raw.githubusercontent.com"].includes(key.hostname) &&
      [repository, "lattice-desktop"].some(repo => key.pathname.startsWith(`/adalinxx/${repo}/`));
  } catch { return false; }
}
