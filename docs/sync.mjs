// Builds src/content/docs from sources.mjs: fetches each repository at the
// version lattice-node main pins, rewrites links between published files to
// site URLs (anything else to GitHub at the fetched version), and writes the
// sidebar. Set DOCS_SOURCES=<dir> to reuse checkouts already in <dir>/<repo>.
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, posix } from "node:path";
import { fileURLToPath } from "node:url";
import { ALIASES, PINNED, SECTIONS, UNPINNED } from "./sources.mjs";

const ORG = "https://github.com/adalinxx";
const BASE = "/docs";

export const siteURL = (slug) => (slug ? `${BASE}/${slug}/` : `${BASE}/`);

const githubURL = (repo, ref, path, isDir) => `${ORG}/${repo}/${isDir ? "tree" : "blob"}/${ref}/${path}`;

// Every (repo, path) the site publishes, keyed case-insensitively by repo.
export function publishedIndex(sections, aliases) {
  const index = new Map();
  const walk = (items) => {
    for (const item of items) {
      if (item.items) walk(item.items);
      else if (item.repo) index.set(`${item.repo.toLowerCase()}:${item.path}`, item.slug);
    }
  };
  for (const section of sections) walk(section.items);
  for (const a of aliases) index.set(`${a.repo.toLowerCase()}:${a.path}`, a.slug);
  return index;
}

// Rewrites Markdown link and HTML href/src targets outside fenced code.
// `source` is { repo, ref, path } or null for a page written here.
export function rewriteLinks(markdown, source, index, isDir = () => false) {
  const resolve = (target) => {
    if (target.startsWith("#") || /^(?:mailto|data):/.test(target)) return target;
    const [path, hash] = splitHash(target);
    const gh = path.match(/^https:\/\/github\.com\/adalinxx\/([^/]+)\/(?:blob|tree)\/[^/]+\/(.+)$/);
    if (gh) {
      const slug = index.get(`${gh[1].toLowerCase()}:${gh[2]}`);
      return slug === undefined ? target : siteURL(slug) + hash;
    }
    if (/^[a-z][a-z0-9+.-]*:/i.test(path) || path.startsWith("/") || !source) return target;
    const repoPath = posix.normalize(posix.join(posix.dirname(source.path), path)).replace(/\/$/, "");
    if (repoPath.startsWith("..")) return target;
    const slug = index.get(`${source.repo.toLowerCase()}:${repoPath}`);
    if (slug !== undefined) return siteURL(slug) + hash;
    return githubURL(source.repo, source.ref, repoPath, isDir(repoPath)) + hash;
  };
  let fenced = false;
  return markdown
    .split("\n")
    .map((line) => {
      if (/^\s*(```|~~~)/.test(line)) fenced = !fenced;
      if (fenced) return line;
      return line
        .replace(/(\]\()(<[^>]+>|[^)\s]+)/g, (_, open, t) =>
          open + (t.startsWith("<") ? `<${resolve(t.slice(1, -1))}>` : resolve(t)))
        .replace(/((?:href|src)=")([^"]+)"/g, (_, open, t) => `${open}${resolve(t)}"`);
    })
    .join("\n");
}

const splitHash = (t) => {
  const i = t.indexOf("#");
  return i < 0 ? [t, ""] : [t.slice(0, i), t.slice(i)];
};

// Drops a leading YAML block and the first H1; the title moves to frontmatter.
export function toPage(markdown, { title, editUrl, footer }) {
  let body = markdown.replace(/^---\n[\s\S]*?\n---\n/, "");
  const h1 = body.match(/^# (.+)$/m);
  if (h1 && body.slice(0, h1.index).trim() === "") body = body.slice(h1.index + h1[0].length);
  const fm = [`title: ${JSON.stringify(title ?? h1?.[1] ?? "Untitled")}`];
  fm.push(editUrl ? `editUrl: ${JSON.stringify(editUrl)}` : "editUrl: false");
  return `---\n${fm.join("\n")}\n---\n${body.trimStart()}${footer ? `\n\n---\n\n${footer}\n` : ""}`;
}

function git(args, cwd) {
  return execFileSync("git", args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "inherit"] }).trim();
}

// Returns { name → { dir, ref } } for every repository a page needs.
function fetchRepos(cacheDir) {
  mkdirSync(cacheDir, { recursive: true });
  const checkout = (name, ref) => {
    const dir = join(cacheDir, name);
    if (!existsSync(dir)) {
      const args = ["clone", "--quiet", "--depth", "1"];
      if (ref) args.push("--branch", ref);
      git([...args, `${ORG}/${name}.git`, dir]);
    }
    return { dir, ref: ref ?? git(["rev-parse", "HEAD"], dir) };
  };
  const repos = {};
  for (const name of UNPINNED) repos[name] = checkout(name);
  const resolved = JSON.parse(readFileSync(join(repos["lattice-node"].dir, "Package.resolved"), "utf8"));
  for (const [identity, name] of Object.entries(PINNED)) {
    const pin = resolved.pins.find((p) => p.identity === identity);
    if (!pin?.state.version) throw new Error(`lattice-node does not pin ${identity} to a version`);
    repos[name] = checkout(name, pin.state.version);
  }
  return repos;
}

function sidebar(items) {
  return items.map((item) =>
    item.items
      ? { label: item.label, collapsed: true, items: sidebar(item.items) }
      : { label: item.label ?? titleOf(item), link: siteURL(item.slug).slice(BASE.length) });
}

const titles = new Map();
const titleOf = (item) => titles.get(item.slug);

function main() {
  const root = dirname(fileURLToPath(import.meta.url));
  const out = join(root, "src/content/docs");
  const repos = fetchRepos(process.env.DOCS_SOURCES ?? join(root, ".sources"));
  const index = publishedIndex(SECTIONS, ALIASES);

  rmSync(out, { recursive: true, force: true });
  const write = (slug, text) => {
    const file = join(out, `${slug || "index"}.md`);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, text);
  };

  const pages = [{ slug: "", file: "docs/pages/index.md" }];
  const walk = (items) => items.forEach((i) => (i.items ? walk(i.items) : pages.push(i)));
  SECTIONS.forEach((s) => walk(s.items));

  for (const page of pages) {
    let markdown, source = null, editUrl, footer;
    if (page.repo) {
      const repo = repos[page.repo];
      source = { repo: page.repo, ref: repo.ref, path: page.path };
      markdown = readFileSync(join(repo.dir, page.path), "utf8");
      editUrl = `${ORG}/${page.repo}/edit/main/${page.path}`;
      footer = `Source: [${page.repo}/${page.path}](${githubURL(page.repo, repo.ref, page.path)}) at \`${repo.ref.slice(0, 12)}\``;
    } else {
      markdown = readFileSync(join(root, "..", page.file), "utf8");
      editUrl = `${ORG}/lattice-home/edit/main/${page.file}`;
    }
    const isDir = (p) => source && existsSync(join(repos[source.repo].dir, p)) && statSync(join(repos[source.repo].dir, p)).isDirectory();
    const body = rewriteLinks(markdown, source, index, isDir);
    titles.set(page.slug, page.label ?? markdown.match(/^# (.+)$/m)?.[1]);
    write(page.slug, toPage(body, { title: page.label, editUrl, footer }));
  }

  const nav = SECTIONS.map((s) => ({ label: s.label, items: sidebar(s.items) }));
  writeFileSync(join(root, "src/sidebar.json"), JSON.stringify(nav, null, 2) + "\n");
  console.log(`docs: ${pages.length} pages from ${Object.entries(repos).map(([n, r]) => `${n}@${r.ref.slice(0, 12)}`).join(", ")}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
