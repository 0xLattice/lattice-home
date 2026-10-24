import { readFileSync } from "node:fs";
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import { satteri } from "@astrojs/markdown-satteri";

// Written by sync.mjs from sources.mjs.
const sidebar = JSON.parse(readFileSync(new URL("./src/sidebar.json", import.meta.url), "utf8"));

// Pages come from other repositories without review here and are served on
// the lattice.build origin, which wallets trust: raw HTML in them is shown as
// text, never rendered; links may only use web and mail schemes; images must
// be remote, so no source file is ever copied into the site.
const safeLink = (url) => !/^[^/?#]*:/.test(url) || /^(?:https?|mailto):/i.test(url);
const remote = (url) => /^https?:\/\//i.test(url);
const guard = (allowed) => (node, ctx) => {
  if (!allowed(node.url)) ctx.setProperty(node, "url", "#");
};
const untrustedMarkdown = {
  name: "untrusted-markdown",
  html(node, ctx) {
    ctx.replaceNode(node, { type: "text", value: node.value });
  },
  link: guard(safeLink),
  image: guard(remote),
  // A definition may serve an image, so it gets the image rule plus mail,
  // in-page anchors, and this site's pages.
  definition: guard((url) => remote(url) || /^(?:mailto:|#|\/docs\/)/i.test(url)),
};

export default defineConfig({
  site: "https://lattice.build",
  base: "/docs",
  trailingSlash: "always",
  markdown: { processor: satteri({ mdastPlugins: [untrustedMarkdown] }) },
  integrations: [
    starlight({
      title: "Lattice",
      logo: { src: "./public/lattice-mark.svg" },
      favicon: "/lattice-mark.svg",
      social: [{ icon: "github", label: "GitHub", href: "https://github.com/adalinxx" }],
      customCss: ["./src/styles/lattice.css"],
      sidebar,
    }),
  ],
});
