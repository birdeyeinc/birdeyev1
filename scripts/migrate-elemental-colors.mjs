/**
 * Replace arbitrary Tailwind hex classes and common inline color styles
 * with Elemental token utilities / CSS variables.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const hexMap = {
  ...JSON.parse(
    readFileSync(path.join(repoRoot, "scripts/elemental-hex-map.json"), "utf8"),
  ),
  ...JSON.parse(
    readFileSync(path.join(repoRoot, "scripts/elemental-hex-aliases.json"), "utf8"),
  ),
};
try {
  const pass3 = path.join(repoRoot, "scripts/elemental-hex-aliases-pass3.json");
  Object.assign(hexMap, JSON.parse(readFileSync(pass3, "utf8")));
} catch {
  /* optional pass3 file */
}

function normalizeHex(hex) {
  let h = hex.toLowerCase();
  if (!h.startsWith("#")) h = `#${h}`;
  if (/^#[0-9a-f]{3}$/.test(h)) {
    h = `#${h[1]}${h[1]}${h[2]}${h[2]}${h[3]}${h[3]}`;
  }
  return h;
}

function lookupToken(hex) {
  const n = normalizeHex(hex);
  return hexMap[n] ?? hexMap[n.replace(/ff$/, "")];
}

const ROOTS = [
  path.join(repoRoot, "src/app"),
  path.join(repoRoot, "src/styles"),
  path.join(repoRoot, "src/themes"),
];

const SKIP_DIRS = new Set(["node_modules"]);
const SKIP_FILES = new Set([
  "elemental-colors.css",
  "elemental-tailwind-theme.css",
  "theme.css",
]);
const EXT = new Set([".tsx", ".ts", ".jsx", ".js", ".css"]);

/** After hex migration — normalize dark-mode pairs for primary/secondary text */
const DARK_PAIR_REPLACEMENTS = [
  ["text-gray-900 dark:text-muted-foreground", "text-gray-900 dark:text-foreground"],
  ["text-gray-300 dark:text-foreground", "text-gray-300 dark:text-muted-foreground"],
];

function walk(dir, files = []) {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const full = path.join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, files);
    else if (EXT.has(path.extname(name))) files.push(full);
  }
  return files;
}

function tokenToUtility(prefix, token) {
  return `${prefix}-${token}`;
}

function migrateContent(content, filePath) {
  let out = content;
  let changes = 0;

  // Tailwind arbitrary with optional variant stack: dark:placeholder:text-[#hex]
  const arbitraryRe =
    /((?:[a-z][\w-]*:)*)(text|bg|border|ring|fill|stroke|from|to|via|outline|decoration|divide|placeholder|caret|accent|ring-offset)-\[#([0-9a-fA-F]{3,8})\]/gi;

  out = out.replace(arbitraryRe, (match, variants, prop, hex) => {
    const token = lookupToken(hex);
    if (!token) return match;
    changes++;
    return `${variants}${tokenToUtility(prop, token)}`;
  });

  // fill="#hex" stroke="#hex" in JSX/SVG (common in components)
  const attrRe = /\b(fill|stroke)=["']#([0-9a-fA-F]{3,8})["']/g;
  out = out.replace(attrRe, (match, attr, hex) => {
    const token = lookupToken(hex);
    if (!token) return match;
    changes++;
    return `${attr}="var(--${token})"`;
  });

  // style={{ color: '#hex' }} or color: '#hex'
  const styleColorRe =
    /(color:\s*['"])#([0-9a-fA-F]{3,8})(['"])/g;
  out = out.replace(styleColorRe, (match, pre, hex, post) => {
    const token = lookupToken(hex);
    if (!token) return match;
    changes++;
    return `${pre}var(--${token})${post}`;
  });

  const styleBgRe =
    /(background(?:Color)?:\s*['"])#([0-9a-fA-F]{3,8})(['"])/g;
  out = out.replace(styleBgRe, (match, pre, hex, post) => {
    const token = lookupToken(hex);
    if (!token) return match;
    changes++;
    return `${pre}var(--${token})${post}`;
  });

  const borderColorRe =
    /(borderColor:\s*['"])#([0-9a-fA-F]{3,8})(['"])/g;
  out = out.replace(borderColorRe, (match, pre, hex, post) => {
    const token = lookupToken(hex);
    if (!token) return match;
    changes++;
    return `${pre}var(--${token})${post}`;
  });

  // Plain CSS: property: #hex;
  const cssColorRe =
    /((?:^|[;{\s])(?:color|background|background-color|border-color|fill|stroke)\s*:\s*)#([0-9a-fA-F]{3,8})\b/gim;
  out = out.replace(cssColorRe, (match, pre, hex) => {
    const token = lookupToken(hex);
    if (!token) return match;
    changes++;
    return `${pre}var(--${token})`;
  });

  for (const [from, to] of DARK_PAIR_REPLACEMENTS) {
    if (out.includes(from)) {
      out = out.split(from).join(to);
      changes++;
    }
  }

  if (out !== content) {
    writeFileSync(filePath, out, "utf8");
  }
  return changes;
}

let totalFiles = 0;
let totalChanges = 0;

for (const root of ROOTS) {
  for (const file of walk(root)) {
    const base = path.basename(file);
    if (SKIP_FILES.has(base)) continue;
    const content = readFileSync(file, "utf8");
    const n = migrateContent(content, file);
    if (n > 0) {
      totalFiles++;
      totalChanges += n;
    }
  }
}

console.log(
  `[migrate:colors] Updated ${totalFiles} files (${totalChanges} replacements)`,
);
