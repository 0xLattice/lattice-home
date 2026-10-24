import { readFileSync } from "node:fs";
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

// Written by sync.mjs from sources.mjs.
const sidebar = JSON.parse(readFileSync(new URL("./src/sidebar.json", import.meta.url), "utf8"));

export default defineConfig({
  site: "https://lattice.build",
  base: "/docs",
  trailingSlash: "always",
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
