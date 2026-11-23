# Publishing a desktop release

`download/release.mjs` holds verified public version 0.1.1 packages for Mac,
Linux (.deb and AppImage), and Windows. Version 0.1.0 releases remain available
in each platform repository's release history.
No download URL is emitted unless `published` is true, release metadata is
complete, and all four URL fields pass validation. Missing JavaScript leaves the links hidden with an explanation.

For a new release, download the exact public package, SHA256SUMS,
SHA256SUMS.minisig, and project public key. Verify the package digest and manifest
signature against the trusted key, and confirm the version, source revision,
requirements, and setup instructions before setting `published: true`.
Run `node test-site.mjs` and the token checks above, then test the direct download
in a browser. This change does not create releases or modify release keys.

Published filenames, versions, build-source revisions, sizes, digests and
release URLs are recorded. The `source` field identifies the tested build revision.
All packages include node revision `fd3684842e8091856b372d2fd56806a3551ba6a4`
and wallet revision `d1d6b9531994884a98a1abc0557945009c87915e`.
The existing project public key remains unchanged. All four public packages were
downloaded without authentication and checked against the approved sizes and
SHA256 digests. The three checksum manifests and signatures match the frozen
release files and verify against the trusted project key.

Keep future records unpublished until their exact public assets, metadata,
requirements and signatures are verified. Update platform help alongside each
release. Do not infer support from the browser or reuse the Mac release metadata
for another platform.

`node test-site.mjs` validates real records against their declared publication
state and uses independent published/unpublished fixtures for every supported
format. Invalid metadata must hide and clear both new and previously rendered
links. Mac publication is independent of other platforms.

Release validation: the installed Linux .deb and extracted AppImage UI
were tested; normal AppImage FUSE mounting was not. The Windows shipped executable
passed startup and mining checks on Windows Server 2025; full UI tests used an
instrumented build. Installing WebView2 on a machine missing that runtime was not
tested. The Windows test environment used Ubuntu 24.04 in WSL. The WSL setup minimum is not a desktop Windows app support
matrix. Physical GPU and live-network behavior are not established by these tests.
