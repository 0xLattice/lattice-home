#!/bin/sh
# Install the Lattice command-line tools (lattice, lattice-node,
# lattice-miner, lattice-mining-coordinator) from a lattice-node release.
#
#   curl -fsSL https://lattice.build/install.sh | sh
#
# LATTICE_VERSION   release tag to install (default: the latest release)
# LATTICE_BIN_DIR   where to put the binaries (default: ~/.lattice/bin)
set -eu

fail() { echo "install.sh: $*" >&2; exit 1; }

# Everything runs from main, called on the last line, so a truncated download
# executes nothing.
main() {
  repo="https://github.com/0xLattice/lattice-node"
  bin_dir="${LATTICE_BIN_DIR:-$HOME/.lattice/bin}"

  case "$(uname -s)/$(uname -m)" in
    Darwin/arm64) platform=macos-arm64 ;;
    Linux/x86_64) platform=linux-amd64 ;;
    *) fail "no prebuilt release for $(uname -s) $(uname -m); build from source: $repo" ;;
  esac

  version="${LATTICE_VERSION:-}"
  if [ -z "$version" ]; then
    latest=$(curl -fsSLI -o /dev/null -w '%{url_effective}' "$repo/releases/latest") ||
      fail "could not reach $repo"
    version="${latest##*/}"
    [ -n "$version" ] && [ "$version" != latest ] || fail "could not find the latest release"
  fi

  name="lattice-node-$version-$platform"
  tmp=$(mktemp -d)
  trap 'rm -rf "$tmp"' EXIT

  echo "Downloading Lattice $version ($platform)"
  curl -fsSL -o "$tmp/$name.tar.gz" "$repo/releases/download/$version/$name.tar.gz" ||
    fail "download failed: $repo/releases/download/$version/$name.tar.gz"
  curl -fsSL -o "$tmp/$name.tar.gz.sha256" "$repo/releases/download/$version/$name.tar.gz.sha256" ||
    fail "checksum download failed"

  expected=$(cut -d' ' -f1 "$tmp/$name.tar.gz.sha256")
  if command -v sha256sum >/dev/null 2>&1; then
    actual=$(sha256sum "$tmp/$name.tar.gz" | cut -d' ' -f1)
  else
    actual=$(shasum -a 256 "$tmp/$name.tar.gz" | cut -d' ' -f1)
  fi
  [ "$expected" = "$actual" ] || fail "checksum mismatch for $name.tar.gz"

  tar -xzf "$tmp/$name.tar.gz" -C "$tmp"
  mkdir -p "$bin_dir"
  for tool in lattice lattice-node lattice-miner lattice-mining-coordinator; do
    install -m 0755 "$tmp/$name/bin/$tool" "$bin_dir/$tool"
  done

  echo "Installed to $bin_dir: lattice, lattice-node, lattice-miner, lattice-mining-coordinator"
  case ":$PATH:" in
    *":$bin_dir:"*) ;;
    *) echo "Add it to your PATH:  export PATH=\"$bin_dir:\$PATH\"" ;;
  esac
}

main "$@"
