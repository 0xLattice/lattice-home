import assert from "node:assert/strict";
import { test } from "node:test";
import { publishedIndex, rewriteLinks, toPage } from "./sync.mjs";

const index = publishedIndex(
  [{ label: "S", items: [{ slug: "run/ops", repo: "lattice-node", path: "docs/operations.md" },
    { label: "G", items: [{ slug: "protocol/spec", repo: "Lattice", path: "docs/spec.md" }] }] }],
  [{ repo: "lattice-node", path: "docs/index.md", slug: "" }],
);
const source = { repo: "lattice-node", ref: "abc", path: "docs/getting-started.md" };

test("relative links to published files become site URLs, keeping anchors", () => {
  assert.equal(rewriteLinks("[o](operations.md#env)", source, index), "[o](/docs/run/ops/#env)");
  assert.equal(rewriteLinks("[i](./index.md)", source, index), "[i](/docs/)");
});

test("relative links to unpublished files go to GitHub at the fetched version", () => {
  assert.equal(rewriteLinks("[t](testing.md)", source, index), "[t](https://github.com/adalinxx/lattice-node/blob/abc/docs/testing.md)");
  assert.equal(rewriteLinks("[d](../deploy)", source, index, () => true), "[d](https://github.com/adalinxx/lattice-node/tree/abc/deploy)");
});

test("GitHub links to published files at any version become site URLs", () => {
  assert.equal(rewriteLinks("[s](https://github.com/adalinxx/lattice/blob/43.1.0/docs/spec.md#10-economic-model)", source, index),
    "[s](/docs/protocol/spec/#10-economic-model)");
  assert.equal(rewriteLinks('<a href="https://github.com/adalinxx/Lattice/blob/1.0.0/README.md">r</a>', source, index),
    '<a href="https://github.com/adalinxx/Lattice/blob/1.0.0/README.md">r</a>');
});

test("fenced code, anchors, and other sites are untouched", () => {
  const md = "```\n[x](operations.md)\n```\n[a](#here) [w](https://example.com/x.md)";
  assert.equal(rewriteLinks(md, source, index), md);
});

test("toPage moves the H1 into frontmatter and drops skill frontmatter", () => {
  const page = toPage("---\nname: x\n---\n# Glossary\n\nBody", { editUrl: "https://e", footer: "Source" });
  assert.equal(page, '---\ntitle: "Glossary"\neditUrl: "https://e"\n---\nBody\n\n---\n\nSource\n');
  assert.match(toPage("# A\nB", { title: "Label" }), /^---\ntitle: "Label"\neditUrl: false\n---\nB$/);
});
