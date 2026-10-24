import { readFileSync } from "node:fs";
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import { satteri } from "@astrojs/markdown-satteri";

// Written by sync.mjs from sources.mjs.
const sidebar = JSON.parse(readFileSync(new URL("./src/sidebar.json", import.meta.url), "utf8"));

// Pages come from other repositories without review here and are served on
// the lattice.build origin, which wallets trust: raw HTML in them is shown as
// text, never rendered.
const htmlAsText = {
  name: "html-as-text",
  html(node, ctx) {
    ctx.replaceNode(node, { type: "text", value: node.value });
  },
};

export default defineConfig({
  site: "https://lattice.build",
  base: "/docs",
  trailingSlash: "always",
  markdown: { processor: satteri({ mdastPlugins: [htmlAsText] }) },
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
